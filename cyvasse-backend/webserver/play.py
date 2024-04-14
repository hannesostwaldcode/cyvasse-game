from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from . import db
from sqlalchemy.sql import or_, and_
from engine.engine import GameState
import engine.move_ai as move_ai
from marshmallow import ValidationError
from .models import User, Board, SubmittedMoveSchema, CreateGameSchema
from engine.util import boardstringToJson, JsonToBoardString

play = Blueprint('play', __name__)

@play.route("/createGame/bot",  methods=['GET', 'POST'])
@jwt_required()
def createBotGame():
    if request.method == 'POST':
        data = request.json
        schema = CreateGameSchema()
        try: 
            val_data = schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 422
        
        board = val_data.get('board')
        reserves = val_data.get('reserves')
        boardString_temp = JsonToBoardString(board, True, reserves)
        boardString = JsonToBoardString(AI_POSITION["board"], True, AI_POSITION["reserves"], boardString_temp)
        board = Board(positionString=boardString, player_alabaster_id=current_user.id, player_onyx_id=4, ai_game=True)
        db.session.add(board)
        db.session.commit()
        return {"msg": "Created AI Game"}, 200
    return  {"msg": "Creaton Failed"}, 500

@play.route("/createGame/friend",  methods=['GET', 'POST'])
@jwt_required()
def createFriendGame():
    if request.method == 'GET':
        friendgames = Board.query.filter(Board.player_onyx_id == current_user.id, Board.unready == True).all()
        return jsonify([game.challenges() for game in friendgames]), 200
    if request.method == 'POST':
        friend_id = request.args.get('friend')
        game_id = request.args.get('game')
        if not friend_id and not game_id:
            return "Missing Required Params", 403
        data = request.json
        board = data.get('board')
        reserves = data.get('reserves')
        player = current_user.id
        if game_id:
            game = Board.query.filter(Board.id == game_id).first()
            if (game.player_alabaster_id == current_user.id or game.player_onyx_id == current_user.id) and game.unready:
                boardString = JsonToBoardString(board, True, reserves, game.positionString)
                game.positionString = boardString
                game.unready = False
                db.session.add(game)
                db.session.commit()
                return "OK"
        else:
            boardString = JsonToBoardString(board, True, reserves)
            friend = User.query.filter(User.id == friend_id).one()
            board = Board(positionString=boardString, player_alabaster_id=player, player_onyx_id=friend.id, unready=True)
            db.session.add(board)
            db.session.commit()
            return "OK"
        
@play.route("/createGame", methods=['GET', 'POST'])
@jwt_required() #new line
def createGame():
    if request.method == 'GET':
        game = Board.query.filter(Board.player_onyx == None, Board.ai_game == False).first()
        if game:
            print(game)
            return {"gameId": game.id}
        else:
            return "OK"
    if request.method == 'POST':
        game = Board.query.filter(Board.player_onyx == None, Board.ai_game == False).filter(Board.player_alabaster_id != current_user.id).first()
        data = request.json
        schema = CreateGameSchema()
        try: 
            val_data = schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 422
        
        board = val_data.get('board')
        reserves = val_data.get('reserves')
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

@play.route("/boardData/<int:gameId>")
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
        if gs.gameEnded:
            if not game.archived:
                game.archived = True
                db.session.commit()
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

@play.route("/submitMove",methods=['POST'])
@jwt_required() #new line
def submit_move():
    if request.method == 'POST':
        data = request.json
        schema = SubmittedMoveSchema()
        try: 
            val_data = schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 422
        
        gameId = val_data.get('gameId')
        playerId = current_user.id
        game = Board.query.filter(and_(or_(Board.player_onyx_id==playerId, Board.player_alabaster_id==playerId),Board.id==gameId)).filter(Board.unready != True).first()
        if game:
            gs = GameState(game.positionString)
            self_is_alabaster = game.player_alabaster_id == playerId
            if self_is_alabaster == gs.alabasterToMove:

                startSquare = val_data.get('startSquare')
                endSquare = val_data.get('endSquare')
                unit = val_data.get('unit')

                madeMove = gs.validateAndMakeMove(endSquare, startSquare, unit)
                current_moves =gs.getValidMoves()
                if game.ai_game:
                    madeMove = move_ai.findRandomMove(current_moves)
                    gs.makeMove(madeMove)
                    gs.getValidMoves()
                newboardString = gs.getBoardString()
                game.positionString = newboardString
                game.archived = gs.gameEnded
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

       

AI_POSITION = {
"board":[
    {"square":27,"unit":"F"},
    {"square":28,"unit":"f"},
    {"square":37,"unit":"f"},
    {"square":38,"unit":"f"},
    {"square":43,"unit":"m"},
    {"square":2,"unit":"m"},
    {"square":8,"unit":"m"},
    {"square":48,"unit":"R"},
    {"square":46,"unit":"S"},
    {"square":47,"unit":"B"},
    {"square":36,"unit":"L"},
    {"square":26,"unit":"L"},
    {"square":49,"unit":"B"},
    {"square":29,"unit":"C"},
    {"square":39,"unit":"H"},
    {"square":17,"unit":"B"},
    {"square":18,"unit":"E"},
    {"square":16,"unit":"L"},
    {"square":19,"unit":"H"}
    ],
"reserves":[
    "R",
    "R",
    "S",
    "S",
    "E",
    "T",
    "D",
    "K"]
    }


