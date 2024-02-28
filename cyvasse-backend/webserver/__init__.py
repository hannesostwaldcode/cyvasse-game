from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
db = SQLAlchemy()
jwt = JWTManager()
def create_app():

    app = Flask(__name__)
    #cors = CORS(app)
    app.config['SECRET_KEY'] = 'verySecretKey'
    app.config["JWT_SECRET_KEY"] = 'alsoAGreatKey'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

    db.init_app(app)
    jwt.init_app(app)

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .home import home as main_blueprint
    app.register_blueprint(main_blueprint)

    BOARD_STRING = "////////////////am////////////aBaR////oD//////aLaFaf////aCam//////aKafafamaE////////////aBaD////////////////oL////aR////oT////oR////oB////om//////oKoFof//om////////////ofofoH//////////////////oS////// o aRaSaSaToBoLoH "
    return app
