from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
jwt = JWTManager()
ma = Marshmallow()

def create_app():

    app = Flask(__name__)
    #cors = CORS(app)
    app.config.from_object("webserver.config.Config")

    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .home import home as main_blueprint
    app.register_blueprint(main_blueprint)

    from .play import play as play_blueprint
    app.register_blueprint(play_blueprint)

    return app
