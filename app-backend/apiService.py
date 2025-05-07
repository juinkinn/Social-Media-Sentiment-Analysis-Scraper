import requests
import os
from datetime import datetime, timedelta, date
from dotenv import load_dotenv
import pandas as pd
import csv
from bert import getSentiment
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI"))

API_KEY = os.getenv("API_KEY")

def save_to_csv(platform: str, query: str, data : list):
    if not os.path.isfile('data.csv'):
        with open('data.csv', 'w',newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'gameName', 'platform', 'comment', 'sentiment', 'date' , 'userSuggestion'])

    filename = 'data-' + str(date.today()) + '.csv'

    if not os.path.isfile(filename):
        with open(filename, 'w',newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'gameName', 'platform', 'comment', 'sentiment', 'date' , 'userSuggestion'])
    
    df = pd.read_csv(filename)
    existing_ids = []
    for _, row in df.iterrows():
        existing_ids.append(row['id'])
    
    for comment in data:
        if comment in existing_ids:
            continue

        obj = [
            comment['id'],
            query,
            platform,
            comment['Comment'],
            comment['Sentiment'],
            comment['Date'],
            comment['type'] if 'type' in comment else None
        ]

        with open(filename, 'a',newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow(obj)
        
        with open('data.csv', 'a',newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow(obj)

def search_reddit_comments(query, test = False):
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
        comment_id = comment.get("id", "").strip()

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
                'Game': query,
                'Platform': 'Reddit',
                'id': comment_id,
                'Date': created_date,
                'Comment': comment_text,
                'Sentiment': getSentiment(comment_text)
            }
            comments.append(obj)
        else:
            print(f"Skipping comment by {author} with no valid text.")

    save_to_csv('Reddit', query, comments) if not test else None
    return comments


def get_youtube_comments(query, test=False):
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

    comments = []
    if video:
        print(f"\nTop video for '{query}': {video['title']} by {video['author']}")
        obj = fetch_youtube_comments(video["video_id"])
        if obj:
            for comment in obj:
                comments.append({
                    'Game': query,
                    'Platform': 'Youtube',
                    'id': comment['commentId'],
                    'Date': comment["publishedTimeText"],
                    'Comment': comment["content"],
                    'Sentiment': getSentiment(comment["content"])
                })
        else:
            return { 'error': 'No comments found'}
    
    save_to_csv('Youtube', query, comments) if not test else None
    return comments
        

def get_facebook_comments(query, test=False):
    
    today = date.today()

    # Get yesterday's date
    yesterday = today - timedelta(days=1)

    # Format as yyyy-mm-dd
    today_str = today.strftime('%Y-%m-%d')
    yesterday_str = yesterday.strftime('%Y-%m-%d')

    headers = {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "facebook-scraper3.p.rapidapi.com"
    }
    
    
    def search_post():
        url = "https://facebook-scraper3.p.rapidapi.com/search/posts"
        params = {"query": query,
                "recent_posts":"true",
                "start_date": yesterday_str,
                "end_date": today_str
                }

        response = requests.get(url, headers=headers, params=params)
        if response.status_code != 200:
            print("Error:", response.status_code)
            return None
        
        posts = []

        for item in response.json()['results']:
            if item:
                posts.append(item['post_id'])

        if len(posts) != 0:
            return posts

        print("No post found.")
        return None
    
    posts = search_post()

    def get_comments(posts):
        results = []

        url = "https://facebook-scraper3.p.rapidapi.com/post/comments"

        for id in posts:
            querystring = {"post_id": id}

            response = requests.get(url, headers=headers, params=querystring)
            if response.status_code != 200:
                return None
            
            for comment in response.json()['results']:
                results.append(comment)

        return results
    
    raw_comments = get_comments(posts)
    comments = []

    for comment in raw_comments:
        comments.append({
                    'id': comment['comment_id'],
                    'Date': date.today(),
                    'Comment': comment["message"],
                    'Sentiment': getSentiment(comment["message"])
                })
    
    save_to_csv('Facebook', query, comments) if not test else None
    return comments


def steam_reviews(query, test=False):

    def get_game_id():
        url = "https://games-details.p.rapidapi.com/search"

        querystring = {"sugg": query}

        headers = {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": "games-details.p.rapidapi.com"
        }
        
        
        response = requests.get(url, headers=headers, params=querystring)
        if response.status_code != 200:
            None
        
        return response.json()['data']['search'][0]
        

    game = get_game_id()

    if not game:
        return {'error': 'cannot find game'}

    print(game['name'], game['id'])

    def get_recent_reviews():
        url = f"https://games-details.p.rapidapi.com/reviews/mostrecent/{game['id']}"

        querystring = {"limit":"30","offset":"0"}

        headers = {
            "x-rapidapi-key": API_KEY,
            "x-rapidapi-host": "games-details.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)

        if response.status_code != 200:
            return None
        
        return response.json()['data']['reviews']
    
    reviews_temp = get_recent_reviews()
    reviews = []
    if not reviews_temp:
        return { 'error': 'cannot fetch reviews'}
    else:
        print(len(reviews_temp))
        for review in reviews_temp:
            reviews.append(
                {
                    'Game': query,
                    'Platform': 'Steam',
                    'id': review['review_id'],
                    'Date': review['date'][8:],
                    'Comment': review['content'],
                    'type': review['title'],
                    'Sentiment': getSentiment(review['content'])
                }
            )
    
    save_to_csv('Steam', query, reviews) if not test else None
    return reviews


def get_data(date = ''):
    data = []
    df = None

    if date == '':
        df = pd.read_csv('data.csv')
    else:
        if not os.path.isfile(f'data-{date}.csv'):
            return None
        df = pd.read_csv(f'data-{date}.csv')

    for _,row in df.iterrows():
        data.append({
            'id': row['id'], 
            'gameName': row['gameName'], 
            'platform': row['platform'], 
            'comment': row['comment'], 
            'sentiment': row['sentiment'], 
            'date': row['date'] , 
            'userSuggestion': row['userSuggestion']
        })

    return data

def summarize(text):

    response = client.models.generate_content(
        model="gemini-2.0-flash", 
        contents="Summarize the given text into a list of important points." \
        "There can only be a maximum of 8 points and each point must not be greater than 10 words" \
        'Return only the summarized text in the format of one long continous string with a "|" being the separator bewteen each point' \
        'Example:  Great ost, good gameplay, high skill ceiling' \
        
        "Here is the text:" \
        f"{text}"
    )

    data = response.text.split("|")

    return data