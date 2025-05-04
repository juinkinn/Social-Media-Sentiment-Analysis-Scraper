from flask import Flask, request
import json
import apiService
from flask_cors import CORS, cross_origin
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app) # allow CORS for all domains on all routes.


@app.route('/')
@cross_origin()
def index():
    return  {'test': 'hi'}

@app.route('/reddit/<string:game>', methods=['GET'])
@cross_origin()
def getReddit(game):
    return apiService.search_reddit_comments(game)

@app.route('/youtube/<string:game>', methods=['GET'])
@cross_origin()
def getYoutube(game):
    return apiService.get_youtube_comments(game)

@app.route('/steam/<string:game>', methods=['GET'])
@cross_origin()
def getSteam(game):
    return apiService.steam_reviews(game)

@app.route('/facebook/<string:game>', methods=['GET'])
@cross_origin()
def getFacebook(game):
    return apiService.get_facebook_comments(game)

@app.route('/alldata', methods=['GET'])
@cross_origin()
def getAllData():
    return apiService.get_data()

@app.route('/data/<string:date>', methods=['GET'])
@cross_origin()
def getDateData(date):
    data = apiService.get_data(date)
    if not data:
        return { 'error': 'data does not exist'}
    return data

@app.route('/summarize', methods=['POST'])
@cross_origin()
def summarizeText():
    req = request.get_json()
    if request.method == 'POST':
        text = req['text']
    data = apiService.summarize(text)
    
    return data


if __name__ == '__main__':
    app.run(debug=True)