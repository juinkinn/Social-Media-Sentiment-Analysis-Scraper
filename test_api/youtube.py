import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("api_key")

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

def display_comments(comments):
    print("\n--- Recent YouTube Comments ---\n")
    for idx, comment in enumerate(comments, 1):
        content = comment.get("content", "")
        author = comment.get("author", {}).get("title", "Unknown")
        time = comment.get("publishedTimeText", "Unknown time")
        print(f"{idx}. {author} at {time}")
        print(f"   {content}\n")

# --- Entry Point ---
if __name__ == "__main__":
    query = input("Enter a topic to search on YouTube: ").strip()
    video = search_youtube_video(query)

    if video:
        print(f"\nTop video for '{query}': {video['title']} by {video['author']}")
        comments = fetch_youtube_comments(video["video_id"])
        if comments:
            display_comments(comments)
        else:
            print("No recent comments found.")
