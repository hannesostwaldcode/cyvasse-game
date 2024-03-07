import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite://")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'verySecretKey'
    JWT_SECRET_KEY = 'alsoAGreatKey'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)