from dataclasses import dataclass
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func, or_, and_ 
from datetime import datetime
import engine
from util import boardstringToJson, JsonToBoardString
app = Flask(__name__)
#cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


BOARD_STRING = "aC//aR//////////aE////////////aC//////aT////aB////////aD////////aL////aH//////////am//aKaB////aS//////////oB//oC////oR//////oDoH//oK//////oL////om////oC//oE//oS//////////////////////////////////////oT a asavabac/ocovoboc"
class Board(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    positionString = db.Column(db.String(200), nullable=False)
    player_alabaster = db.Column(db.Integer, nullable=True)
    player_onyx = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)

    def __init__(self, positionString, player_alabaster = None, player_onyx = None):
        self.positionString = positionString
        self.player_alabaster = player_alabaster
        self.player_onyx = player_onyx
    @property
    def serialized(self):
        return {
            "player_alabaster": self.player_alabaster,
            "player_onyx":      self.player_onyx,
            "id":               self.id
        }

@app.route("/submitMove",methods=['POST'])
def submit_move():
    if request.method == 'POST':
        data = request.json
        gameId = data.get('gameId')
        playerId = data.get('playerId')
        game = Board.query.filter(and_(or_(Board.player_onyx==playerId, Board.player_alabaster==playerId),Board.id==gameId)).first()
        if game:
            gs = engine.GameState(game.positionString)
            if (game.player_alabaster == playerId) == gs.alabasterToMove:
            
                startSquare = data.get('startSquare')
                endSquare = data.get('endSquare')
                unit = data.get('unit')
                gs.validateAndMakeMove(endSquare, startSquare, unit)
                newboardString = gs.getBoardString()
                game.positionString = newboardString
                db.session.add(game)
                db.session.commit()
                return {"board": boardstringToJson(newboardString),
                    "moves": [],
                    "reserves": gs.getReserves(),
                    "captures": ["oB"] }
        return {"status": 401}

@app.route("/createGame", methods=['GET', 'POST'])
def createGame():
    if request.method == 'GET':
        game = Board.query.filter(Board.player_onyx == None).first()
        if game:
            return {"gameId": game.id}
        else:
            return "OK"
    if request.method == 'POST':
        data = request.json
        board = data.get('board')
        player = data.get('playerId')
        boardId = data.get('boardId')
        if boardId:
            game = Board.query.filter(Board.id==boardId).first()
            boardString = JsonToBoardString(board, True)
            newBoard = game.positionString[:100] + boardString[100:] 
            game.positionString = newBoard
            game.player_onyx = player
            db.session.add(game)
            db.session.commit()
            return "OK"
        else:
            boardString = JsonToBoardString(board, True)
            board = Board(boardString, player_alabaster=player)
            db.session.add(board)
            db.session.commit()
            return "OK"

@app.route("/games")
def get_games():
    games = Board.query.all()
    return jsonify({"data": [game.serialized for game in games]})

@app.route("/boardData/<int:gameId>/<int:playerId>")
def get_board(gameId, playerId):
    if request.method == 'POST':
        db.Query()
        newBoard = Board(

        )
    game = Board.query.filter(and_(or_(Board.player_onyx==playerId, Board.player_alabaster==playerId),Board.id==gameId)).first()
    if game:
        gs = engine.GameState(game.positionString)
        moves = []
        if (game.player_alabaster == playerId) == gs.alabasterToMove:
            print("players Turn", playerId)
            moves = gs.getValidMovesJson()
        gameData = {
            "id": game.id,
            "playerOne": game.player_alabaster,
            "playerTwo": game.player_onyx,
            "board": boardstringToJson(game.positionString),
            "moves": moves,
            "reserves": gs.getReserves(),
            "captures": ["oB"]    
                
                    }
        return gameData
    else:
        return "not found"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')