
def test_new_user(new_user):
    """
    GIVEN a User Model
    WHEN a user is created
    THEN check if fields are consumed correctly
    """
    assert new_user.email == "test@user.com"
    assert new_user.password != "1234"
    assert new_user.country == "DE"
    assert new_user.elo == 1000
    assert new_user.name == "Mark"