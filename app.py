from flask import Flask, jsonify, request, render_template
from datetime import datetime
from backend.scryfall_api import ScryfallAPI
import time 

app = Flask(__name__, template_folder='frontend')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/random_cards', methods=['GET'])
def random_cards():
    scry = ScryfallAPI()
    cards = []
    for i in range(5):
        rc = scry.get_random_card()
        time.sleep(0.1)
        card = {
            'artist': rc['artist'],
            'finishes': rc['finishes'],
            'img': rc['image_uris']['large'],
            'legalities': rc['legalities'],
            'mana_cost': rc['mana_cost'],
            'name': rc['name'],
            'card_text': rc['oracle_text'],
            'prices': rc['prices'],
            'purchase': rc['purchase_uris'],
            'rarity': rc['rarity'],
            'release': rc['released_at'],
            'set': rc['set_name'],
            'type': rc['type_line']
        }
        cards.append(card)

    return cards



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)