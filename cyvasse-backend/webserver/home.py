from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user, get_jwt_identity
from . import db
from sqlalchemy.sql import or_, and_
from .models import User, Board

home = Blueprint('home', __name__)
    
@home.route("/testgame")
def get_games_t():
    games = Board.query.first()
    return jsonify({"data": games.serialized}), 200

@home.route("/currentuser")
@jwt_required() #new line
def get_current_user():
    user = User.query.filter_by(id = current_user.id).first()
    return user.serialized, 200

@home.route("/friends")
@jwt_required()
def get_friends():
    self = User.query.filter(User.id == current_user.id).one()
    friends = self.get_connected_users()
    return jsonify({"data": [user.serialized for user in friends]}), 200

@home.route("/friend-request")
@jwt_required()
def get_friend_requests():
    friend_req = User.query.filter(User.id != current_user.id).all()

    return jsonify({"data": [user.serialized_with_friend(current_user.id) for user in friend_req]}), 200


@home.route("/friend-request/<int:user_id>",  methods=['GET', 'POST'])
@jwt_required()
def friend_request(user_id):
    if request.method == 'POST':
        try:
            user: User = User.query.filter(User.id == current_user.id).one()
            requested: User = User.query.filter(User.id == user_id).one()
        except:
            return "Logged In user does no exist", 401
     
        user.add_user(requested, False)
        db.session.commit()
        return "Success", 200
    if request.method == 'GET':
        friend_req = User.query.filter(User.friend_requests == current_user.id).all()

@home.route("/users")
@jwt_required(optional=True)
def get_users():
    current_identity = get_jwt_identity()
    print(current_identity)
    if current_identity:
        users = User.query.filter(User.id != current_user.id).order_by(User.name).limit(10).all()
    else:
        users = User.query.order_by(User.name).limit(10).all()
    return jsonify({"data": [user.serialized for user in users]}), 200

@home.route("/archivedgames")
@jwt_required() #new line
def get_archived_games():
    user_id = current_user.id
    games = Board.query.filter(or_(Board.player_alabaster_id == user_id, Board.player_onyx_id == user_id)).filter(and_(Board.player_alabaster_id.is_not(None), Board.player_onyx_id.is_not(None))).filter(Board.unready != True, Board.archived == True).all()
    return jsonify({"data": [game.serialized_with_id(current_user.id) for game in games]}), 200

@home.route("/games")
@jwt_required() #new line
def get_games():
    user_id = current_user.id
    games = Board.query.filter(or_(Board.player_alabaster_id == user_id, Board.player_onyx_id == user_id)).filter(and_(Board.player_alabaster_id.is_not(None), Board.player_onyx_id.is_not(None))).filter(Board.unready != True, Board.archived == False).all()
    return jsonify({"data": [game.serialized_with_id(current_user.id) for game in games]}), 200
