from flask import Flask
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


if __name__ == '__main__':
    app.run(debug=True)