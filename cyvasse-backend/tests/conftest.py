from webserver.models import User
from webserver import create_app
import pytest
from werkzeug.security import generate_password_hash

@pytest.fixture(scope='module')
def new_user():
    user = User(email="test@user.com", 
                name="Mark",
                country="DE", 
                elo=1000, 
                password=generate_password_hash("1234", method='pbkdf2'))
    return user


@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app()
    flask_app.config.update({
        "TESTING": True,
    })

    with flask_app.test_client() as test_client:
        with flask_app.app_context():
            yield test_client