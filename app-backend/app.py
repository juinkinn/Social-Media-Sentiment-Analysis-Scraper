from flask import Flask, request, jsonify, send_from_directory
import json
import apiService
from flask_cors import CORS, cross_origin
import csv

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
    with open('data.csv', 'w') as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'gameName', 'platform', 'comment', 'sentiment', 'date' , 'userSuggestion'])
    return jsonify({'message': 'Data deleted successfully'})

@app.route('/data/<string:date>', methods=['GET'])
@cross_origin()
def getDateData(date):
    data = apiService.get_data(date)
    return jsonify(data)

@app.route('/data/<string:date>', methods=['DELETE'])
@cross_origin()
def deleteDateData(date):
    with open(f'data-{date}.csv', 'w') as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'gameName', 'platform', 'comment', 'sentiment', 'date' , 'userSuggestion'])
    return jsonify({'message': 'Data deleted successfully'})

@app.route('/summarize', methods=['POST'])
@cross_origin()
def summarizeText():
    req = request.get_json()
    if request.method == 'POST':
        text = req['text']
    data = apiService.summarize(text)
    
    return data

@app.route('/availableData', methods=['GET'])
@cross_origin()
def getAvailableData():
    data = apiService.get_available_data()
    if not data:
        return { 'error': 'data does not exist'}
    return jsonify(data)
    
# return a csv as a blob for download
@app.route('/downloadAll', methods=['GET'])
@cross_origin()
def download():
    with open('data.csv', 'r', encoding='utf-8') as f:
        data = f.read()
    response = app.response_class(
        response=data,
        status=200,
        mimetype='text/csv'
    )
    response.headers['Content-Disposition'] = 'attachment; filename=data.csv'
    return response

@app.route('/download/<string:date>', methods=['GET'])
@cross_origin()
def downloadDate(date):
    with open(f'data-{date}.csv', 'r', encoding='utf-8') as f:
        data = f.read()
    response = app.response_class(
        response=data,
        status=200,
        mimetype='text/csv'
    )
    response.headers['Content-Disposition'] = f'attachment; filename=data-{date}.csv'
    return response

if __name__ == '__main__':
    app.run(debug=True)