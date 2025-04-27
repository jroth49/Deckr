from scryfall_api import ScryfallAPI




def main():
    
    scry = ScryfallAPI()

    q = 'c:rg t:legend'

    results = scry.search_cards(query=q, page=1)
    print(results)

    return 0