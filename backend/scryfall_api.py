import requests
import json

class ScryfallAPI:
    BASE_URL = "https://api.scryfall.com"

    def __init__(self):
        self.session = requests.Session()

    def get_card_by_name(self, name, fuzzy=False):
        """Search card by exact or fuzzy name."""
        endpoint = "/cards/named"
        params = {"fuzzy" if fuzzy else "exact": name}
        return self._get(endpoint, params)

    def search_cards(self, query, page=1):
        """Search cards using Scryfall query syntax."""
        endpoint = "/cards/search"
        params = {"q": query, "page": page}
        return self._get(endpoint, params)

    def get_set(self, code):
        """Get information about a card set."""
        endpoint = f"/sets/{code}"
        return self._get(endpoint)

    def get_random_card(self):
        """Get a random card."""
        endpoint = "/cards/random"
        return self._get(endpoint)

    def _get(self, endpoint, params=None):
        url = self.BASE_URL + endpoint
        print(url)
        print(params)
        try:
            response = self.session.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error during API call: {e}")
            return None
