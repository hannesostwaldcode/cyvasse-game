import json
from flask import Blueprint, request, jsonify
from . import db, jwt
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from .models import User, UserSchema, LogInSchema
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone, timedelta
from marshmallow import ValidationError 
import bleach

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
    form_data = request.form
    if not form_data:
        return jsonify({'message': 'No input data provided'}), 400
    schema = LogInSchema()
    try: 
        data = schema.load(form_data)
    except ValidationError as err:
        return jsonify(err.messages), 422
    
    user = User.query.filter_by(email=bleach.clean(data.get('email'))).first()
    # check if the user actually exists
    # take the user-supplied password, hash it, and compare it to the hashed password in the database
    if not user or not check_password_hash(user.password, data.get('password')):
        
        return {"msg": "Wrong Email or Password"}, 401 # if the user doesn't exist or password is wrong, reload the page
    access_token = create_access_token(identity=user)
    response = {"access_token":access_token}
    return response

@auth.route('/signup', methods=['POST'])
def signup():
    form_data = request.form
    if not form_data:
        return jsonify({'message': 'No input data provided'}), 400
    schema = UserSchema()
    try: 
        data = schema.load(form_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    user = User.query.filter_by(email=data.get('email')).first()

    if user:
        return "Email already exists", 403
    new_user = User(email=bleach.clean(data.get('email')), name=bleach.clean(data.get('name')),country=bleach.clean(data.get('country')), elo=1000, password=generate_password_hash(bleach.clean(data.get('password')), method='pbkdf2'))


    db.session.add(new_user)
    db.session.commit()
    
    return {"msg": "Successfully signed up"}, 200

@auth.route('/logout', methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response