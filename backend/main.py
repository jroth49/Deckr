from scryfall_api import ScryfallAPI




def main():
    
    scry = ScryfallAPI()

    q = 'c:rg t:legend'

    results = scry.search_cards(query=q, page=1)
    cards = results['data']
    print(type(results))
    print(cards[0])
    print('Total Cards: ', results['total_cards'])
    print(results.keys())

    random_card = scry.get_random_card()

    print(random_card)

    return 0


main()