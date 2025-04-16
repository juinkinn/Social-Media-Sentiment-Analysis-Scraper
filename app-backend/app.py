from flask import Flask
import apiService


app = Flask(__name__)

@app.route('/')
def index():
    return  {'test': 'hi'}

@app.route('/reddit/<string:game>', methods=['GET'])
def getReddit(game):
    return apiService.search_reddit_comments(game)

if __name__ == '__main__':
    app.run(debug=True)