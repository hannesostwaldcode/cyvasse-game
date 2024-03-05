from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from . import db
from sqlalchemy.sql import func, or_, and_
from engine.engine import GameState
from .models import User, Board
from engine.util import boardstringToJson, JsonToBoardString

home = Blueprint('home', __name__)

@home.route("/submitMove",methods=['POST'])
@jwt_required() #new line
def submit_move():
    if request.method == 'POST':
        data = request.json
        gameId = data.get('gameId')
        playerId = current_user.id
        game = Board.query.filter(and_(or_(Board.player_onyx_id==playerId, Board.player_alabaster_id==playerId),Board.id==gameId)).first()
        if game:
            gs = GameState(game.positionString)
            self_is_alabaster = game.player_alabaster_id == playerId
            if self_is_alabaster == gs.alabasterToMove:
                startSquare = data.get('startSquare')
                endSquare = data.get('endSquare')
                unit = data.get('unit')
                madeMove = gs.validateAndMakeMove(endSquare, startSquare, unit)
                gs.getValidMoves()
                newboardString = gs.getBoardString()
                game.positionString = newboardString
                db.session.add(game)
                db.session.commit()
                moves = gs.getValidMovesJson() if self_is_alabaster == gs.alabasterToMove else []
                return {"board": boardstringToJson(newboardString),
                        "playerSelf": {"captures": gs.getCapturesSite(self_is_alabaster) },
                        "playerOpponent": {"captures": gs.getCapturesSite(not self_is_alabaster) },
                        "moves": moves,
                        "doubleMove": True if gs.doubleMove else False,
                        "gameEnded": gs.gameEnded,
                        "reserves": gs.getReserves(self_is_alabaster),
                        "last_move": madeMove.returnInfoObject(),
                }
        return {"status": 401}

@home.route("/createGame", methods=['GET', 'POST'])
@jwt_required() #new line
def createGame():
    if request.method == 'GET':
        game = Board.query.filter(Board.player_onyx == None).first()
        if game:
            print(game)
            return {"gameId": game.id}
        else:
            return "OK"
    if request.method == 'POST':
        game = Board.query.filter(Board.player_onyx == None).first()
        data = request.json
        board = data.get('board')
        reserves = data.get('reserves')
        player = current_user.id
        if game:
            boardString = JsonToBoardString(board, True, reserves, game.positionString)
            game.positionString = boardString
            game.player_onyx_id = player
            db.session.add(game)
            db.session.commit()
            return "OK"
        else:
            boardString = JsonToBoardString(board, True, reserves)
            board = Board(positionString=boardString, player_alabaster_id=player)
            db.session.add(board)
            db.session.commit()
            return "OK"

@home.route("/games")
@jwt_required() #new line
def get_games():
    games = Board.query.filter(and_(Board.player_alabaster_id.is_not(None), Board.player_onyx_id.is_not(None))).all()
    return jsonify({"data": [game.serialized for game in games]})

@home.route("/boardData/<int:gameId>")
@jwt_required() #new line
def get_board(gameId):
    playerId = current_user.id
    game = Board.query.filter(and_(or_(Board.player_onyx_id==playerId, Board.player_alabaster_id==playerId),Board.id==gameId)).first()
    
    if game:
        gs = GameState(game.positionString)
        moves = []
        self_is_alabaster = (game.player_alabaster_id == playerId)
        player = game.player_alabaster if self_is_alabaster else game.player_onyx
        opponent  = game.player_alabaster if not self_is_alabaster else game.player_onyx
        if self_is_alabaster == gs.alabasterToMove or gs.gameEnded:
            print("players Turn", playerId)
            moves = gs.getValidMovesJson()
        gameData = {
            "id": game.id,
            "playerSelf": {"id": player.id, "name": player.name, "elo": player.elo, "country": player.country, "captures": gs.getCapturesSite(self_is_alabaster) },
            "playerOpponent": {"id": opponent.id, "name": opponent.name, "elo": opponent.elo, "country": opponent.country, "captures": gs.getCapturesSite(not self_is_alabaster) },
            "board": boardstringToJson(game.positionString),
            "gameEnded": gs.gameEnded,
            "doubleMove": True if gs.doubleMove else False,
            "moves": moves,
            "reserves": gs.getReserves(self_is_alabaster),
            "self_alabaster": self_is_alabaster    
                
                    }
        return gameData
    else:
        return {"msg": "Game does not exist"}, 403
