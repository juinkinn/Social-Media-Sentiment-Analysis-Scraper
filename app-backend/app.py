from flask import Flask, request, jsonify, send_from_directory
import json
import apiService
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder='dist')
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app) # allow CORS for all domains on all routes.


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

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
    data = apiService.get_data()
    return jsonify(data)

@app.route('/alldata', methods=['DELETE'])
@cross_origin()
def deleteAllData():
    with open('data.csv', 'w') as f:
        f.write('')
    return jsonify({'message': 'Data deleted successfully'})

@app.route('/data/<string:date>', methods=['GET'])
@cross_origin()
def getDateData(date):
    data = apiService.get_data(date)
    return jsonify(data)

@app.route('/data/<string:date>', methods=['DELETE'])
@cross_origin()
def deleteDateData(date):
    with open(f'data-{date}.csv', 'w') as f:
        f.write('')
    return jsonify({'message': 'Data deleted successfully'})

@app.route('/summarize', methods=['POST'])
@cross_origin()
def summarizeText():
    req = request.get_json()
    if request.method == 'POST':
        text = req['text']
    data = apiService.summarize(text)
    
    return data

@app.route('/wordcloud', methods=['GET'])
@cross_origin()
def fetch_wordcloud(date=''):
    wordcloud = apiService.get_wordcloud(date)
    if wordcloud is None:
        return jsonify({'error': 'Data not found'}), 404
    return jsonify(wordcloud)

@app.route('/availableData', methods=['GET'])
@cross_origin()
def getAvailableData():
    data = apiService.get_available_data()
    if not data:
        return { 'error': 'data does not exist'}
    return jsonify(data)
    

if __name__ == '__main__':
    app.run(debug=True)