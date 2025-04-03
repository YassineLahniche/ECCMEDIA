from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock database
articles = [
    {"id": 1, "title": "Premier article", "content": "Contenu du premier article", "author": "ECC Media"},
    {"id": 2, "title": "Innovations scientifiques", "content": "Decouvertes recentes", "author": "ECC Team"}
]

@app.route('/api/articles', methods=['GET'])
def get_articles():
    return jsonify(articles)

@app.route('/api/articles/<int:id>', methods=['GET'])
def get_article(id):
    article = next((a for a in articles if a['id'] == id), None)
    return jsonify(article) if article else ('', 404)

@app.route('/api/articles', methods=['POST'])
def create_article():
    data = request.json
    new_id = max(a['id'] for a in articles) + 1
    new_article = {"id": new_id, **data}
    articles.append(new_article)
    return jsonify(new_article), 201

if __name__ == '__main__':
    app.run(debug=True)