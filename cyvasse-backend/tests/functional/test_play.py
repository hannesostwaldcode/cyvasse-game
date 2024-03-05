def test_games(test_client):

    response = test_client.get('/testgame')
    assert response.status_code == 200
    assert b"Magnus" in response.data

def test_protected_page(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is posted to (POST)
    THEN check that a '405' (Method Not Allowed) status code is returned
    """
    response = test_client.get('/games')
    assert response.status_code == 401