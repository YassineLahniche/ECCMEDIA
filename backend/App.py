# backend/app.py
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Article
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///ecc_media.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Create tables
@app.before_first_request
def create_tables():
    with app.app_context():
        db.create_all()

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    # Validate required fields
    if not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Username or email already exists'}), 409
    
    # Create new user
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    # First user is admin
    if User.query.count() == 0:
        user.is_admin = True
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    
    if not all(k in data for k in ('username', 'password')):
        return jsonify({'message': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid username or password'}), 401
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict()
    })

# Article endpoints
@app.route('/api/articles', methods=['GET'])
def get_articles():
    articles = Article.query.order_by(Article.created_at.desc()).all()
    return jsonify([article.to_dict() for article in articles])

@app.route('/api/articles/<int:id>', methods=['GET'])
def get_article(id):
    article = Article.query.get_or_404(id)
    return jsonify(article.to_dict())

@app.route('/api/articles', methods=['POST'])
@jwt_required()
def create_article():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    data = request.json
    
    if not all(k in data for k in ('title', 'content')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    article = Article(title=data['title'], content=data['content'], user_id=user_id)
    db.session.add(article)
    db.session.commit()
    
    return jsonify(article.to_dict()), 201

@app.route('/api/articles/<int:id>', methods=['PUT'])
@jwt_required()
def update_article(id):
    user_id = get_jwt_identity()
    article = Article.query.get_or_404(id)
    
    # Check if user is author or admin
    user = User.query.get(user_id)
    if not user.is_admin and article.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.json
    
    if 'title' in data:
        article.title = data['title']
    if 'content' in data:
        article.content = data['content']
    
    db.session.commit()
    return jsonify(article.to_dict())

@app.route('/api/articles/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_article(id):
    user_id = get_jwt_identity()
    article = Article.query.get_or_404(id)
    
    # Check if user is author or admin
    user = User.query.get(user_id)
    if not user.is_admin and article.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    db.session.delete(article)
    db.session.commit()
    return jsonify({'message': 'Article deleted successfully'})

# User endpoints (admin only)
@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user.is_admin:
        return jsonify({'message': 'Unauthorized'}), 403
    
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

if __name__ == '__main__':
    app.run(debug=True)