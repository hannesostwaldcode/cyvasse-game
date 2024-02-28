import json
from flask import Blueprint, request, jsonify
from . import db, jwt
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone, timedelta
auth = Blueprint('auth', __name__)

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

@auth.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response

@auth.route('/login', methods=['POST'])
def login():

    email = request.form.get('email', None)
    password = request.form.get('password', None)
    remember = True if request.form.get('remember') else False
    print(email, password)
    user = User.query.filter_by(email=email).first()
    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user or not check_password_hash(user.password, password):
        
        return {"msg": "Wrong Email or Password"}, 401 # if the user doesn't exist or password is wrong, reload the page
    access_token = create_access_token(identity=user)
    response = {"access_token":access_token}
    return response

@auth.route('/signup', methods=['POST'])
def signup():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')
    country = request.form.get('country', "NN")
    elo = 1000
    user = User.query.filter_by(email=email).first()

    if user:
        return "Wrong"
    new_user = User(email=email, name=name,country=country, elo=elo, password=generate_password_hash(password, method='pbkdf2'))

    db.session.add(new_user)
    db.session.commit()
    
    return {"msg": "Successfully signed up"}, 200

@auth.route('/logout', methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response