import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("api_key")

headers = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "reddit-scraper2.p.rapidapi.com"
}

def search_reddit_comments(query):
    url = "https://reddit-scraper2.p.rapidapi.com/search_comments_v3"
    
    params = {
        "query": query,
        "sort": "NEW",  # Changed to NEW for real-time data
        "nsfw": "0",
        "time": "day"  # Restrict to last 24 hours
    }

    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
        return []

    data = response.json()

    if not data.get("data") or not isinstance(data["data"], list):
        print("No valid comments found or unexpected response format.")
        print("Note: The API may not be returning real-time data. Check RapidAPI documentation for supported parameters.")
        return []

    if not data["data"]:
        print("No comments found for the query. Try a different query or check API limitations.")
        return []

    print(f"Found {len(data['data'])} comments related to '{query}':\n")
    for comment in data["data"]:
        comment_text = comment.get("content", {}).get("text", "").strip()

        created_date = comment.get("creationDate", "No date available")
        if created_date and created_date != "No date available":
            try:
                created_date = datetime.strptime(created_date, "%Y-%m-%dT%H:%M:%S.%f+0000")
                created_date = created_date.strftime("%Y-%m-%d %H:%M:%S")
            except ValueError:
                created_date = "Invalid date format"

        author = comment.get("author", {}).get("name", "Unknown author")

        if comment_text:
            print(f"Author: {author}")
            print(f"Date: {created_date}")
            print(f"Comment: {comment_text}\n")
        else:
            print(f"Skipping comment by {author} with no valid text.")

# --- Entry Point ---
if __name__ == "__main__":
    query = input("Enter a topic to search on Reddit: ").strip()
    search_reddit_comments(query)