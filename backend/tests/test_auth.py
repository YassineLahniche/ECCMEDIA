# backend/tests/test_auth.py
import json

def test_login_success(client):
    response = client.post('/api/auth/login', 
                          data=json.dumps({'username': 'admin', 'password': 'password'}),
                          content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data
    assert data['user']['username'] == 'admin'
    assert data['user']['is_admin'] == True

def test_login_invalid_credentials(client):
    response = client.post('/api/auth/login', 
                          data=json.dumps({'username': 'admin', 'password': 'wrong'}),
                          content_type='application/json')
    
    assert response.status_code == 401

def test_register_success(client):
    response = client.post('/api/auth/register', 
                          data=json.dumps({
                              'username': 'newuser',
                              'email': 'new@test.com',
                              'password': 'password'
                          }),
                          content_type='application/json')
    
    assert response.status_code == 201

def test_register_duplicate_username(client):
    response = client.post('/api/auth/register', 
                          data=json.dumps({
                              'username': 'admin',  # Already exists
                              'email': 'unique@test.com',
                              'password': 'password'
                          }),
                          content_type='application/json')
    
    assert response.status_code == 409