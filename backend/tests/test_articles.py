# backend/tests/test_articles.py
import json

def get_auth_token(client, username='admin', password='password'):
    response = client.post('/api/auth/login', 
                          data=json.dumps({'username': username, 'password': password}),
                          content_type='application/json')
    return json.loads(response.data)['access_token']

def test_get_articles(client):
    response = client.get('/api/articles')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) > 0
    assert 'title' in data[0]
    assert 'content' in data[0]

def test_get_article_by_id(client):
    response = client.get('/api/articles/1')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['id'] == 1
    assert 'title' in data
    assert 'content' in data

def test_create_article(client):
    token = get_auth_token(client)
    
    response = client.post('/api/articles',
                          headers={'Authorization': f'Bearer {token}'},
                          data=json.dumps({
                              'title': 'New Test Article',
                              'content': 'This is new test content'
                          }),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['title'] == 'New Test Article'
    assert data['content'] == 'This is new test content'

def test_update_article(client):
    token = get_auth_token(client)
    
    response = client.put('/api/articles/1',
                         headers={'Authorization': f'Bearer {token}'},
                         data=json.dumps({
                             'title': 'Updated Test Article'
                         }),
                         content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['title'] == 'Updated Test Article'

def test_delete_article(client):
    token = get_auth_token(client)
    
    # First create a new article to delete
    response = client.post('/api/articles',
                          headers={'Authorization': f'Bearer {token}'},
                          data=json.dumps({
                              'title': 'Article to Delete',
                              'content': 'This will be deleted'
                          }),
                          content_type='application/json')
    
    article_id = json.loads(response.data)['id']
    
    # Then delete it
    response = client.delete(f'/api/articles/{article_id}',
                            headers={'Authorization': f'Bearer {token}'})
    
    assert response.status_code == 200