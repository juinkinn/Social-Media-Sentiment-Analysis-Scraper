import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("api_key")

def search_reddit_comments(query):
    headers = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "reddit-scraper2.p.rapidapi.com"
    }
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
    
    comments = []

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
            obj = {
                'Date': created_date,
                'Comment': comment_text
            }
            comments.append(obj)
        else:
            print(f"Skipping comment by {author} with no valid text.")

    return comments


def get_youtube_comments(query):
    YOUTUBE_API_HOST = "youtube138.p.rapidapi.com"

    headers = {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": YOUTUBE_API_HOST
    }

    def search_youtube_video(query):
        url = "https://youtube138.p.rapidapi.com/search/"
        params = {"q": query, "hl": "en", "gl": "US"}

        response = requests.get(url, headers=headers, params=params)
        if response.status_code != 200:
            print("Error:", response.status_code)
            return None

        for item in response.json().get("contents", []):
            video = item.get("video")
            if video:
                return {
                    "video_id": video["videoId"],
                    "title": video["title"],
                    "author": video.get("author", {}).get("title", "Unknown")
                }

        print("No video found.")
        return None

    def fetch_youtube_comments(video_id, limit=10):
        url = "https://youtube138.p.rapidapi.com/video/comments/"
        params = {
            "id": video_id,
            "hl": "en",
            "gl": "US"
        }

        response = requests.get(url, headers=headers, params=params)
        if response.status_code != 200:
            print("Error fetching comments:", response.status_code)
            return []

        json_data = response.json()
        comments = json_data.get("comments", [])
        
        return comments[:limit]
    

    video = search_youtube_video(query)

    if video:
        print(f"\nTop video for '{query}': {video['title']} by {video['author']}")
        comments = fetch_youtube_comments(video["video_id"])
        if comments:
            return comments
        else:
            return { 'error': 'No comments found'}