from flask import Flask, jsonify, request, render_template
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from datetime import datetime
from backend.scryfall_api import ScryfallAPI
import time
import re 

app = Flask(__name__, template_folder='frontend')
limiter = Limiter(get_remote_address, app=app)

#util functions
def convert_text(text):
    if text == 'N/A':
        return text
    
    pattern = r'\{[A-Za-z0-9]{1,2}\}'
    symbols = re.findall(pattern, text)

    if symbols == []:
        return text
    
    text = text.replace('\n', '<br><br>')
    
    for s in symbols:
        match s:
            case r'{0}':
                text = text.replace(r'{0}', '<img src="https://svgs.scryfall.io/card-symbols/0.svg" alt="1 Mana" style="width: 15px; height: auto;">')
            case r'{1}':
                text = text.replace(r'{1}', '<img src="https://svgs.scryfall.io/card-symbols/1.svg" alt="1 Mana" style="width: 15px; height: auto;">')
            case r'{2}':
                text = text.replace(r'{2}', '<img src="https://svgs.scryfall.io/card-symbols/2.svg" alt="2 Mana" style="width: 15px; height: auto;">')
            case r'{3}':
                text = text.replace(r'{3}', '<img src="https://svgs.scryfall.io/card-symbols/3.svg" alt="3 Mana" style="width: 15px; height: auto;">')
            case r'{4}':
                text = text.replace(r'{4}', '<img src="https://svgs.scryfall.io/card-symbols/4.svg" alt="4 Mana" style="width: 15px; height: auto;">')
            case r'{5}':
                text = text.replace(r'{5}', '<img src="https://svgs.scryfall.io/card-symbols/5.svg" alt="5 Mana" style="width: 15px; height: auto;">')
            case r'{6}':
                text = text.replace(r'{6}', '<img src="https://svgs.scryfall.io/card-symbols/6.svg" alt="6 Mana" style="width: 15px; height: auto;">')
            case r'{7}':
                text = text.replace(r'{7}', '<img src="https://svgs.scryfall.io/card-symbols/7.svg" alt="7 Mana" style="width: 15px; height: auto;">')
            case r'{8}':
                text = text.replace(r'{8}', '<img src="https://svgs.scryfall.io/card-symbols/8.svg" alt="8 Mana" style="width: 15px; height: auto;">')
            case r'{9}':
                text = text.replace(r'{9}', '<img src="https://svgs.scryfall.io/card-symbols/9.svg" alt="9 Mana" style="width: 15px; height: auto;">')
            case r'{W}':
                text = text.replace(r'{W}', '<img src="https://svgs.scryfall.io/card-symbols/W.svg" alt="White Mana" style="width: 15px; height: auto;">')
            case r'{U}':
                text = text.replace(r'{U}', '<img src="https://svgs.scryfall.io/card-symbols/U.svg" alt="Blue Mana" style="width: 15px; height: auto;">')
            case r'{B}':
                text = text.replace(r'{B}', '<img src="https://svgs.scryfall.io/card-symbols/B.svg" alt="Black Mana" style="width: 15px; height: auto;">')
            case r'{R}':
                text = text.replace(r'{R}', '<img src="https://svgs.scryfall.io/card-symbols/R.svg" alt="Red Mana" style="width: 15px; height: auto;">')
            case r'{G}':
                text = text.replace(r'{G}', '<img src="https://svgs.scryfall.io/card-symbols/G.svg" alt="Green Mana" style="width: 15px; height: auto;">')
            case r'{C}':
                text = text.replace(r'{C}', '<img src="https://svgs.scryfall.io/card-symbols/C.svg" alt="Colorless Mana" style="width: 15px; height: auto;">')
            case r'{WU}':
                text = text.replace(r'{WU}', '<img src="https://svgs.scryfall.io/card-symbols/WU.svg" alt="White-Blue Mana" style="width: 15px; height: auto;">')
            case r'{UB}':
                text = text.replace(r'{UB}', '<img src="https://svgs.scryfall.io/card-symbols/UB.svg" alt="Blue-Black Mana" style="width: 15px; height: auto;">')
            case r'{BR}':
                text = text.replace(r'{BR}', '<img src="https://svgs.scryfall.io/card-symbols/BR.svg" alt="Black-Red Mana" style="width: 15px; height: auto;">')
            case r'{WR}':
                text = text.replace(r'{WR}', '<img src="https://svgs.scryfall.io/card-symbols/WR.svg" alt="White-Red Mana" style="width: 15px; height: auto;">')
            case r'{WG}':
                text = text.replace(r'{WG}', '<img src="https://svgs.scryfall.io/card-symbols/WG.svg" alt="White-Green Mana" style="width: 15px; height: auto;">')
            case r'{UR}':
                text = text.replace(r'{UR}', '<img src="https://svgs.scryfall.io/card-symbols/UR.svg" alt="Blue-Red Mana" style="width: 15px; height: auto;">')
            case r'{UG}':
                text = text.replace(r'{UG}', '<img src="https://svgs.scryfall.io/card-symbols/UG.svg" alt="Blue-Green Mana" style="width: 15px; height: auto;">')
            case r'{BG}':
                text = text.replace(r'{BG}', '<img src="https://svgs.scryfall.io/card-symbols/BG.svg" alt="Black-Green Mana" style="width: 15px; height: auto;">')
            case r'{RG}':
                text = text.replace(r'{RG}', '<img src="https://svgs.scryfall.io/card-symbols/RG.svg" alt="Red-Green Mana" style="width: 15px; height: auto;">')
            case r'{2W}':
                text = text.replace(r'{2W}', '<img src="https://svgs.scryfall.io/card-symbols/2W.svg" alt="2 or White Mana" style="width: 15px; height: auto;">')
            case r'{2B}':
                text = text.replace(r'{2B}', '<img src="https://svgs.scryfall.io/card-symbols/2B.svg" alt="2 or Black Mana" style="width: 15px; height: auto;">')
            case r'{2U}':
                text = text.replace(r'{2U}', '<img src="https://svgs.scryfall.io/card-symbols/2U.svg" alt="2 or Blue Mana" style="width: 15px; height: auto;">')
            case r'{2G}':
                text = text.replace(r'{2G}', '<img src="https://svgs.scryfall.io/card-symbols/2G.svg" alt="2 or Green Mana" style="width: 15px; height: auto;">')
            case r'{2R}':
                text = text.replace(r'{2R}', '<img src="https://svgs.scryfall.io/card-symbols/2R.svg" alt="2 or Red Mana" style="width: 15px; height: auto;">')
            case r'{T}':
                text = text.replace(r'{T}', '<img src="https://svgs.scryfall.io/card-symbols/T.svg" alt="Tap Symbol" style="width: 15px; height: auto;">')
            case r'{U/P}':
                text = text.replace(r'{U/P}', '<img src="https://svgs.scryfall.io/card-symbols/UP.svg" alt="Tap Symbol" style="width: 15px; height: auto;">')
            case r'{U/R}':
                text = text.replace(r'{U/R}', '<img src="https://svgs.scryfall.io/card-symbols/UR.svg" alt="Tap Symbol" style="width: 15px; height: auto;">')
            case r'{10}':
                text = text.replace(r'{10}', '<img src="https://svgs.scryfall.io/card-symbols/10.svg" alt="Tap Symbol" style="width: 15px; height: auto;">')
            case r'{X}':
                text = text.replace(r'{X}', '<img src="https://svgs.scryfall.io/card-symbols/X.svg" alt="Tap Symbol" style="width: 15px; height: auto;">')
            case _:
                continue

    return text



@app.route('/')
def home():

    user_ip = request.remote_addr
    print(f'Your IP Address: {user_ip}')
    return render_template('index.html')

@app.route('/random_cards', methods=['GET'])
@limiter.limit('1 per 5 seconds; 10 per minute')
def random_cards():
    scry = ScryfallAPI()
    cards = []
    for i in range(10):
        rc = scry.get_random_card()

        card_text = convert_text(rc.get('oracle_text', 'N/A'))
        mana_cost = convert_text(rc.get('mana_cost', 'N/A'))

        time.sleep(0.2)
        card = {
            'artist': rc.get('artist', 'N/A'),
            'finishes': rc.get('finishes', 'N/A'),
            'img': rc.get('image_uris', {}).get('large', 'https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg/revision/latest?cb=20140813141013'),
            'legalities': rc.get('legalities', 'N/A'),
            'mana_cost': mana_cost,
            'name': rc.get('name', 'N/A'),
            'card_text': card_text,
            'prices': rc.get('prices', 'N/A'),
            'purchase': rc.get('purchase_uris', 'N/A'),
            'rarity': rc.get('rarity', 'N/A'),
            'release': rc.get('released_at', 'N/A'),
            'set': rc.get('set_name', 'N/A'),
            'type': rc.get('type_line', 'N/A')
        }
        print(card['mana_cost'])

        cards.append(card)

    return cards



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)