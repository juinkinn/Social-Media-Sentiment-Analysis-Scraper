import requests
from difflib import get_close_matches
from dotenv import load_dotenv
import os

load_dotenv()

# Get API key from environment
RAPIDAPI_KEY = os.getenv("api_key")

headers = {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": "opencritic-api.p.rapidapi.com"
}

def normalize_name(name):
    return name.lower().replace(" ", "")

def search_games_loosely(user_input):
    criteria = normalize_name(user_input)
    url = "https://opencritic-api.p.rapidapi.com/game/search"
    params = {"criteria": user_input}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        print("API error:", response.status_code)
        print("Message:", response.text)
        return []

    try:
        result = response.json()
    except ValueError:
        print("Failed to parse API response.")
        return []

    if not isinstance(result, list):
        print("Unexpected API response:", result)
        return []

    if not result:
        print("No games found.")
        return []

    name_map = {normalize_name(game["name"]): game for game in result if "name" in game}
    name_keys = list(name_map.keys())

    matches = get_close_matches(criteria, name_keys, n=5, cutoff=0.4)
    matched_games = [name_map[m] for m in matches]
    return matched_games

def fetch_game_reviews(game_id):
    url = f"https://opencritic-api.p.rapidapi.com/review/game/{game_id}"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print("Failed to fetch reviews:", response.status_code)
        print("Message:", response.text)
        return []

    try:
        reviews = response.json()
    except ValueError:
        print("Failed to parse review response.")
        return []

    return reviews

# --- Entry Point ---
if __name__ == "__main__":
    user_input = input("Enter a game name: ")
    matched_games = search_games_loosely(user_input)

    if matched_games:
        print(f"\nFound {len(matched_games)} matching games:")
        for i, game in enumerate(matched_games, 1):
            print(f"{i}. {game['name']} (ID: {game['id']})")

        selected = input("\nSelect a game by number to view reviews (or press Enter to skip): ")
        if selected.isdigit():
            selected_idx = int(selected) - 1
            if 0 <= selected_idx < len(matched_games):
                selected_game = matched_games[selected_idx]
                reviews = fetch_game_reviews(selected_game["id"])
                if reviews:
                    print(f"\nFound {len(reviews)} reviews for '{selected_game['name']}':\n")
                    for i, r in enumerate(reviews, 1):
                        snippet = r.get("snippet") or "No snippet available"
                        source = r.get("sourceName") or "Unknown source"
                        score = r.get("score", "N/A")
                        print(f"{i}. {source} | Score: {score}\n   {snippet}\n")
                else:
                    print("No reviews found for this game.")
            else:
                print("Invalid selection.")
    else:
        print("No matching games found.")
