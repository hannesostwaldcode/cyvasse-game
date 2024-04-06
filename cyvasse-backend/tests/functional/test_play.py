
def test_protected_page(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/games' page is posted to (GET)
    THEN check that a '401' (No Auth) status code is returned
    """
    response = test_client.get('/games')
    assert response.status_code == 401
