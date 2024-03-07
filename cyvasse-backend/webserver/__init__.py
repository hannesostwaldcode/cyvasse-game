from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()
def create_app():

    app = Flask(__name__)
    #cors = CORS(app)
    app.config.from_object("webserver.config.Config")

    db.init_app(app)
    jwt.init_app(app)

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .home import home as main_blueprint
    app.register_blueprint(main_blueprint)

    BOARD_STRING = "////////////////am////////////aBaR////oD//////aLaFaf////aCam//////aKafafamaE////////////aBaD////////////////oL////aR////oT////oR////oB////om//////oKoFof//om////////////ofofoH//////////////////oS////// o aRaSaSaToBoLoH "
    return app
