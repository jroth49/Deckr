from scryfall_api import ScryfallAPI




def main():
    
    scry = ScryfallAPI()
    random_card = scry.get_random_card()
    print('Random Card: ')
    print(random_card)

    return 0


main()