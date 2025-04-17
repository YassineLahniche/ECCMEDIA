# backend/tests/conftest.py
import pytest
from app import app as flask_app
from models import db, User, Article

@pytest.fixture
def app():
    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with flask_app.app_context():
        db.create_all()
        # Create test admin user
        admin = User(username='admin', email='admin@test.com', is_admin=True)
        admin.set_password('password')
        db.session.add(admin)
        
        # Create regular user
        user = User(username='testuser', email='user@test.com')
        user.set_password('password')
        db.session.add(user)
        
        # Create test article
        article = Article(title='Test Article', content='This is test content', user_id=1)
        db.session.add(article)
        
        db.session.commit()
        
        yield flask_app
        
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()