from util import boardstringToArray
WATERFIELDS = [(1,1),(3,3),(6,6),(8,8),(1,8),(3,6),(6,3),(8,1)]
class GameState():
    def __init__(self, boardString):
        interpretedStrings = boardstringToArray(boardString)
        self.board = interpretedStrings[0]
        self.moveFunctions = {'B': self.getCrossbowMoves, 'H': self.getHeavyHorseMoves, 'L': self.getLightHorseMoves, 'F': self.getReserveMoves, 'T': self.getTrebuchetMoves}
        self.gameEnded = False
        #Safe Captures in GameString? Keep existence in Gamestring? King Capture 
        self.alabaster_fortress = True
        self.onyx_fortress = True
        self.alabasterToMove = interpretedStrings[1]
        self.alabaster_reserves = interpretedStrings[2]
        self.onyx_reserves = interpretedStrings[3]
        
    def makeMove(self, move):
        if isinstance(move, Move):
            self.board[move.startRow][move.startCol] = "//"
        elif isinstance(move, Deploy):
            print(move.unit, self.alabaster_reserves, self.onyx_reserves)
            print(self.alabasterToMove)
            if self.alabasterToMove:
                self.alabaster_reserves.remove(move.unit)
            else:
                self.onyx_reserves.remove(move.unit)
        self.board[move.endRow][move.endCol] = move.pieceMoved

        self.alabasterToMove = not self.alabasterToMove


    def validateAndMakeMove(self,  endSq, startSq = None, unit = None):
        print(endSq, startSq, unit)
        if startSq:
            move = Move((startSq//10, startSq % 10 - 1),(endSq//10, endSq % 10 - 1), self.board)
        elif unit:
            move = Deploy(unit, (endSq//10, endSq % 10 - 1), self.board)
        validMoves = self.getValidMoves()
        for i in range(len(validMoves)):
            if move == validMoves[i]:
                self.makeMove(validMoves[i])
                break

    def getReserves(self):
        return self.alabaster_reserves if self.alabasterToMove else self.onyx_reserves      

    def getValidMoves(self):
        moves = self.getAllPossibleMoves()
        return moves
    
    def getAllPossibleMoves(self):
        moves = []
        for r in range(len(self.board)):
            for c in range(len(self.board[r])):
                turn = self.board[r][c][0]
                if (turn == 'a' and self.alabasterToMove) or (turn == 'o' and not self.alabasterToMove):
                    piece = self.board[r][c][1]
                    if(piece == 'B' or piece == 'H' or  piece == 'L' or piece == 'F' or piece == 'T'):
                        self.moveFunctions[piece](r,c,moves)
        return moves

    def getValidMovesJson(self):
        
        moves = self.getValidMoves()
        jsonMoves = []
        
        for move in moves:
            jsonMoves.append(move.returnInfoObject())
        return jsonMoves            
        #    if(jsonMoves.index(['startSquare']""))
        #    jsonMoves.append({{"startSquare": 36, "captureSquares": [56], "moveSquares":[34,35,37,38,39,40,46]}})

    def getCrossbowMoves(self, r, c, moves):
        enemyColor = 'o' if self.alabasterToMove else 'a'
        for x in range(-1,2,2):
            for y in range(-1,2,2):
                endRow = r + x
                endCol = c + y
                if 0 <= endRow <10 and 0 <= endCol <10 and not(r == 0 and c == 0):
                    endPiece = self.board[endRow][endCol]
                    if endPiece == "//":
                        moves.append(Move((r,c), (endRow, endCol), self.board))
                    elif endPiece[0] == enemyColor:
                        if endPiece[1] == 'f' or endPiece[1] == 'm' or endPiece[1] == 'F':
                            break
                        moves.append(Move((r,c), (endRow, endCol), self.board))
        for x in range(0,10):
            for y in range(0 if x % 2 == 0 else 1,10,2):
                if self.board[x][y] == "//" and (x, y) not in WATERFIELDS:
                    move = Move((r,c), (x,y), self.board)
                    if move not in moves:
                        moves.append(move)

    def getHeavyHorseMoves(self, r, c, moves):
       # directions = ((1,1),(-1,-1),(1,-1),(-1,1))
        directions = ((0,1),(0,-1),(1,0),(-1,0))
        enemyColor = 'o' if self.alabasterToMove else 'a'
        for d in directions:
            for x in range(1,10):
                endRow = r + d[0]*x
                endCol = c + d[1]*x
                if 0 <= endRow < 10 and 0 <= endCol < 10:
                    endPiece = self.board[endRow][endCol]
                    if endPiece == "//":
                        if (endRow, endCol) in WATERFIELDS:
                            moves.append(Move((r,c), (endRow, endCol), self.board))
                            break
                        moves.append(Move((r,c), (endRow, endCol), self.board))
                    elif endPiece[1] == 'f' or endPiece[1] == 'm' or endPiece[1] == 'F':
                        break
                    elif endPiece[0] == enemyColor:
                        moves.append(Move((r,c), (endRow, endCol), self.board))
                        break
            
                else:
                    break
    def getTrebuchetMoves(self, r, c, moves):
        directions = ((1,1),(-1,-1),(1,-1),(-1,1))
        #directions = ((0,1),(0,-1),(1,0),(-1,0))
        enemyColor = 'o' if self.alabasterToMove else 'a'
        for d in directions:
            hitObstacle = False
            for x in range(1,10):
                endRow = r + d[0]*x
                endCol = c + d[1]*x
                if 0 <= endRow < 10 and 0 <= endCol < 10:
                    endPiece = self.board[endRow][endCol]
                    if endPiece == "//":
                        if (endRow, endCol) in WATERFIELDS:
                            if not hitObstacle:
                                moves.append(Move((r,c), (endRow, endCol), self.board))
                            break
                        elif not hitObstacle:
                            moves.append(Move((r,c), (endRow, endCol), self.board))
                    elif endPiece[1] == 'f' or endPiece[1] == 'm' or endPiece[1] == 'F':
                        break
                    elif endPiece[0] == enemyColor:
                        moves.append(Move((r,c), (endRow, endCol), self.board))
                        hitObstacle = True
                    else:
                        hitObstacle = True    
                else:
                    break
    def getLightHorseMoves(self, r, c, moves):
        directions = ((0,1),(0,-1),(1,0),(-1,0))
        enemyColor = 'o' if self.alabasterToMove else 'a'
        for d in directions:
            for x in range(1,10):
                endRow = r + d[0]*x
                endCol = c + d[1]*x
                if 0 > endRow or endRow >= 10:
                    endRow = abs(10-endRow)
                if 0 > endCol or endCol >= 10:
                    endCol = abs(10-endCol)
                if 0 <= endRow < 10 and 0 <= endCol < 10:
                    endPiece = self.board[endRow][endCol]
                    if endPiece == "//":
                        if (endRow, endCol) in WATERFIELDS:
                            moves.append(Move((r,c), (endRow, endCol), self.board))
                            break
                        moves.append(Move((r,c), (endRow, endCol), self.board))
                    elif endPiece[1] == 'f' or endPiece[1] == 'm' or endPiece[1] == 'F':
                        break
                    elif endPiece[0] == enemyColor:
                        moves.append(Move((r,c), (endRow, endCol), self.board))
                        break
                    else:
                        break
                else:
                    break
                    
    def getBoardString(self):
        string = ""
        for x in self.board:
            for y in x:
                string += y
        string += (' a' if self.alabasterToMove else ' o')
        reservesString = " "
        for y in self.alabaster_reserves:
            reservesString += y
        for x in self.onyx_reserves:
            reservesString += x
        string += reservesString
        print(f"alabasterToMove: {self.alabasterToMove} String: {string}")
        return string

    def getReserveMoves(self, r, c, moves):
        homeSquares = ((-1,0),(-1,1),(-1,2),(0,2),(1,2),(2,2),(2,1),(2,0),(2,-1),(1,-1),(0,-1),(-1,-1))
        for d in homeSquares:
            endRow = r + d[0]
            endCol = c + d[1]
            if 0 <= endRow < 10 and 0 <= endCol < 10:
                endPiece = self.board[endRow][endCol]
                if endPiece == "//":
                    reserves = self.alabaster_reserves if self.alabasterToMove else self.onyx_reserves
                    for piece in reserves:
                        moves.append(Deploy(piece, (endRow, endCol), self.board))
                    # Find a solution for "moveId beaing unique" extra class and or field for these moves?
class Move():

    def __init__(self, startSq, endSq, board):
        self.startSq = startSq[0]*10 + startSq[1]+1
        self.endSq = endSq[0]*10 + endSq[1]+1
        self.startRow = startSq[0]
        self.startCol = startSq[1]
        self.endRow = endSq[0]
        self.endCol = endSq[1]
        self.pieceMoved = board[self.startRow][self.startCol]
        self.pieceCaptured = board[self.endRow][self.endCol]
        self.isCapture = self.pieceCaptured != "//"
        self.moveID = self.startRow * 1000 + self.startCol * 100 + self.endRow * 10 + self.endCol 

    def __eq__(self, other):
        if isinstance(other, Move):
            return self.moveID == other.moveID
        return False
    def returnInfoObject(self):
        return {"startSquare": self.startSq, "endSquare": self.endSq, "isCapture": self.isCapture}

class Deploy():

    def __init__(self, unit, endSq, board):
        self.endSq = endSq[0]*10 + endSq[1]+1
        self.endRow = endSq[0]
        self.endCol = endSq[1]
        self.pieceMoved = unit
        self.unit = unit  
        self.moveID = ord(self.unit[1])*10000 + self.endRow * 10 + self.endCol 
    def __eq__(self, other):
        if isinstance(other, Deploy):
            return self.moveID == other.moveID
        return False
    def returnInfoObject(self):
        return {"unit": self.pieceMoved, "endSquare": self.endSq, "startSquare": -1, "isCapture": False}