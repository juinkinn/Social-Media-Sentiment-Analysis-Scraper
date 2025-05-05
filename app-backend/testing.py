import requests
from unittest.mock import patch
import apiService

def test_search_reddit_comments():
    result = apiService.search_reddit_comments("elden ring", True)
    assert isinstance(result, list)
    assert all(isinstance(item, dict) for item in result)


def test_get_youtube_comments():
    result = apiService.get_youtube_comments("elden ring", True)
    assert isinstance(result, list)
    assert all(isinstance(item, dict) for item in result)


def test_steam_reviews():
    result = apiService.steam_reviews("elden ring", True)
    assert isinstance(result, list)
    assert all(isinstance(item, dict) for item in result)


def test_get_data():
    result = apiService.get_data()
    assert isinstance(result, list)
    assert all(isinstance(item, dict) for item in result)


def test_summarize():
    result = apiService.summarize("elden ring")
    assert isinstance(result, list)
    assert all(isinstance(item, str) for item in result)

def test_get_sentiment(): 
    result = apiService.getSentiment("Didn’t realize ‘pay-to-win’ was a whole genre until I dropped $50 and still got owned. Take my money, I guess?")
    assert result == "NEGATIVE"
    result = apiService.getSentiment("this game is amazing. it's really my dream game. aircraft, tanks, and infantry all fighting side by side. there is no other game like this. the crazy part is you can play with out spending a penny. this game isn't pay to win. there are no weapons that are limited to members or people who spend tons of money. but don't get me wrong, planetside 2 is hard. when it was released, you were shot down into a pod and were in most cases killed instantly. they have added a ton of things to help out new players so if you picked it up in it's early days and left give it another go. make sure you join an outfit that suits you and always join a squad. people tell you where to go and you don't have to worry about it. it does have it's cons. i got bored around br 60 but took a break and got into it again. i have played a lot and it's pretty embarassing. since it has so many people and the servers are already handling so much it has client-side hit detection. meaning instead of the server processing that damage has been taken, what happens on your screen is what happened. content comes in kinda slow. the developers give us some gun that nobody uses instead of new abilities, vehicles, ect. you will encounter many bugs, however they are not game breaking most of the time (they tend to fix those). you need a nuclear power plant to run the game at 60fps on max settings in a huge fight.so if you're like me and spend 2 years on one game and then find a new one when you burn out, this is your game.")
    assert result == "POSITIVE"


if __name__ == "__main__":
    import unittest
    unittest.main()