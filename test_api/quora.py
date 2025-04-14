import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("api_key")

headers = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "quora-scraper.p.rapidapi.com"
}

def search_quora_answers(query):
    url = "https://quora-scraper.p.rapidapi.com/search_answers"
    
    params = {
        "query": query,  
        "language": "en", 
        "time": "all_times"  
    }

    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
        return []

    data = response.json()

    if data.get("data"):
        print(f"Found {len(data['data'])} answers related to '{query}':\n")
        for answer in data["data"]:
            answer_text = answer.get("content", "").strip()
            creation_date = answer.get("creationDate", "No date available")
            if answer_text:  
                print(f"Date: {creation_date}")
                print(f"Answer: {answer_text}\n")
            else:
                print(f"Date: {creation_date}")
                print("No content in this answer.\n")
    else:
        print("No answers found.")

# --- Entry Point ---
if __name__ == "__main__":
    query = input("Enter a game name or topic to search on Quora: ").strip() 
    search_quora_answers(query)