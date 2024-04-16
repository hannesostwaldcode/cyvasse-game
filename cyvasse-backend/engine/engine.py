from .util import boardstringToArray
import random
WATERFIELDS = [(1,1),(3,3),(6,6),(8,8),(1,8),(3,6),(6,3),(8,1)]
ALABASTER_START_UNITS = ["aR","aR","aR", "aS", "aS", "aS", "aB", "aB", "aB",
"aL", "aL", "aL", "aH", "aH", "aE", "aE", "aC", "aT", "aD", "aK"]
ONYX_START_UNITS = ["oR","oR","oR", "oS", "oS", "oS", "oB", "oB", "oB",
"oL", "oL", "oL", "oH", "oH", "oE", "oE", "oC", "oT", "oD", "oK"]
class GameState():
    def __init__(self, boardString):
        self.interpretedStrings = boardstringToArray(boardString)
        self.board = self.interpretedStrings[0]
        self.moveFunctions = {'B': self.getCrossbowMoves, 'H': self.getHeavyHorseMoves, 
                              'L': self.getLightHorseMoves, 'F': self.getReserveMoves, 
                              'T': self.getTrebuchetMoves, 'C': self.getCatapultMoves,
                              'R': self.getRabbleMoves, 'S': self.getSpearmanMoves,
                              'K': self.getKingMoves, 'E': self.getElephantMoves,
                              'D': self.getDragonMoves, 'f': self.noMoves, 'm': self.noMoves,  'x': self.noMoves}
        self.alabasterToMove = self.interpretedStrings[1]
        self.alabaster_reserves = self.interpretedStrings[2]
        self.onyx_reserves = self.interpretedStrings[3]
        self.onyx_captures = self.get_captures('o')
        self.alabaster_captures = self.get_captures('a')
        self.gameEnded = 'oK' in self.alabaster_captures or 'aK' in self.onyx_captures
        self.doubleMove = self.interpretedStrings[4]
        self.doubleMovePossible = self.checkDoubleMovePossible()
        self.playFor = True

    #Helper for Rable double move ability
    def checkDoubleMovePossible(self):
        friendlyRabble = 'aR' if self.alabasterToMove else 'oR'
        rabbleCount = 0
        for r in range(len(self.board)):
            for c in range(len(self.board[r])):
                if self.board[r][c] == friendlyRabble:
                    rabbleCount += 1
                if rabbleCount > 1:
                    return True

        return False
        
    #Makes a Move and cleans up the state
    def makeMove(self, move):
        if isinstance(move, Move):
            self.board[move.startRow][move.startCol] = "//"
        elif isinstance(move, Deploy):
            if self.alabasterToMove:
                self.alabaster_reserves.remove(move.unit)
            else:
                self.onyx_reserves.remove(move.unit)
        if move.doubleCapture:
            self.board[move.doubleCapture[0]][move.doubleCapture[1]] = "//"
        if move.positionChange:
            self.board[move.startRow][move.startCol] = move.positionChange
        self.board[move.endRow][move.endCol] = move.pieceMoved
        print(move.endSq)
        self.doubleMove = move.doubleMove
        if not move.doubleMove:
            self.alabasterToMove = not self.alabasterToMove

    #validates if a move exists acording to game state
    def validateAndMakeMove(self,  endSq, startSq = None, unit = None):
        if not startSq and not unit:
            self.alabasterToMove = not self.alabasterToMove
            self.doubleMove = None
            return Move((endSq//10, endSq % 10 - 1),(endSq//10, endSq % 10 - 1), self.board)
        elif startSq:
            move = Move((startSq//10, startSq % 10 - 1),(endSq//10, endSq % 10 - 1), self.board)
        elif unit:
            move = Deploy(unit, (endSq//10, endSq % 10 - 1), self.board)
        validMoves = self.getValidMoves()
        for i in range(len(validMoves)):
            if move == validMoves[i]:
                self.makeMove(validMoves[i])
                return validMoves[i]

    # Helper for Reserves
    def getReserves(self, alabaster):
        return self.alabaster_reserves if alabaster else self.onyx_reserves      
   
   #Helper for Captures
    def getCapturesSite(self, alabaster):
        captures = None
        if alabaster:
            captures = self.get_captures('a')
        else:
            captures = self.get_captures('o')
        return captures      

    # Gets all valid moves / Exists if "check" or similar mechanic gets introduced
    def getValidMoves(self):
        moves = self.getAllPossibleMoves()
        return moves
        
    # gets all moves possible acording to pieces move logic
    def getAllPossibleMoves(self):
        moves = []
        for r in range(len(self.board)):
            for c in range(len(self.board[r])):
                turn = self.board[r][c][0]
                if (turn == 'a' and self.alabasterToMove) or (turn == 'o' and not self.alabasterToMove):
                    piece = self.board[r][c][1]
                    if self.doubleMove:
                        if piece == 'R' and (r != self.doubleMove[0] or c != self.doubleMove[1]):
                            self.moveFunctions[piece](r,c,moves)
                    elif(piece != 'm' or piece != 'f'):
                        self.moveFunctions[piece](r,c,moves)
        return moves
    # returns a Json like structure for Moves
    def getValidMovesJson(self):
        
        moves = self.getValidMoves()
        jsonMoves = []
        
        for move in moves:
            jsonMoves.append(move.returnInfoObject())
        return jsonMoves            
        #    if(jsonMoves.index(['startSquare']""))
        #    jsonMoves.append({{"startSquare": 36, "captureSquares": [56], "moveSquares":[34,35,37,38,39,40,46]}})
    
    #Helper for checking if capture is possible
    def captureOpponent(self, r,c ,endPiece, endRow, endCol, moves, doubleMove = None):
        friendlyColor = 'a' if self.alabasterToMove else 'o'
        if endPiece[1] == 'E':
            for x in range(-1,2):
                for y in range(-1,2):
                    
                    adjRow = endRow + x
                    adjCol = endCol + y
                    if adjRow == r and adjCol == c:
                        continue
                    elif self.board[adjRow][adjCol][0] == friendlyColor:
                        moves.append(Move((r,c), (endRow, endCol), self.board, doubleMove=doubleMove))
                        break
        elif not (endPiece[1] == 'f' or endPiece[1] == 'm' or endPiece[1] == 'F'):
            moves.append(Move((r,c), (endRow, endCol), self.board))
   
   #Helper for Non Moving Board entities
    def noMoves(self, r, c, moves):
        pass
    
    # Move Functions by Unit
    def getCatapultMoves(self, r, c, moves):
        directions = ((1,1),(-1,-1),(1,-1),(-1,1))
        #directions = ((0,1),(0,-1),(1,0),(-1,0))
        enemyColor = 'o' if self.alabasterToMove else 'a'
        for d in directions:
            hitOponent = None
            for x in range(1,10):
                endRow = r + d[0]*x
                endCol = c + d[1]*x
                if 0 <= endRow < 10 and 0 <= endCol < 10:
                    endPiece = self.board[endRow][endCol]
                    if endPiece == "//":
                        if (endRow, endCol) in WATERFIELDS:
                            if not hitOponent:
                                moves.append(Move((r,c), (endRow, endCol), self.board))
                            break
                        elif not hitOponent:
                            moves.append(Move((r,c), (endRow, endCol), self.board))
                    elif endPiece[1] == 'f' or endPiece[1] == 'm' or endPiece[1] == 'F':
                        break
                    elif endPiece[0] == enemyColor:
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves)
                        if hitOponent:
                            break
                        hitOponent = (endRow, endCol)
                    elif not hitOponent:
                        break    
                else:
                    break
    def getSpearmanMoves(self, r, c, moves):
        enemyColor = 'o' if self.alabasterToMove else 'a'
        for x in range(-1,2):
            for y in range(-1,2):
                if abs(x) == abs(y):
                    continue
                endRow = r + x
                endCol = c + y
                if 0 <= endRow <10 and 0 <= endCol <10:
                    endPiece = self.board[endRow][endCol]
                    if endPiece == "//":
                        moves.append(Move((r,c), (endRow, endCol), self.board))
                    elif endPiece[0] == enemyColor:
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves)
                    elif endPiece[0] != enemyColor and not(endPiece[1] == 'f' or endPiece[1] == 'm' or endPiece[1] == 'F'):
                        moves.append(Move((r,c), (endRow, endCol), self.board, positionChange=endPiece))
    def getRabbleMoves(self, r, c, moves):
        enemyColor = 'o' if self.alabasterToMove else 'a'
        for x in range(-1,2):
            for y in range(-1,2):
                if abs(x) == abs(y):
                    continue
                endRow = r + x
                endCol = c + y
                doubleMove = None if self.doubleMove or not self.doubleMovePossible else (r,c)
                if 0 <= endRow <10 and 0 <= endCol <10:
                    endPiece = self.board[endRow][endCol]
                    if endPiece == "//":
                        moves.append(Move((r,c), (endRow, endCol), self.board, doubleMove=doubleMove))
                    elif endPiece[0] == enemyColor:
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves, doubleMove)

    def getElephantMoves(self, r, c, moves):
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
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves)
                        break
                    else:
                        break
            
                else:
                    break
    def getDragonMoves(self, r, c, moves):
        directions = ((1, 0), (-1, 0), (0, -1), (0, 1), (1, 1), (-1, -1), (1, -1), (-1, 1))
        enemyColor = 'o' if self.alabasterToMove else 'a'
        
        for d in directions:
            for x in range(1,10):
                endRow = r + d[0]*x
                endCol = c + d[1]*x
                if 0 <= endRow < 10 and 0 <= endCol < 10:
                    
                    endPiece = self.board[endRow][endCol]
                    if endPiece == "//":
                        moves.append(Move((r, c), (endRow, endCol), self.board))
                    elif endPiece[1] == 'm':
                        continue
                    elif endPiece[1] == 'f' or endPiece[1] == 'F':
                        break
                    elif endPiece[0] == enemyColor:
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves)
                        break
                    else:
                        break
                else:
                    break
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
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves)
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
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves)
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
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves)
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
                    endRow = abs(10-abs(endRow))
                if 0 > endCol or endCol >= 10:
                    endCol = abs(10-abs(endCol))
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
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves)
                        break
                    else:
                        break
                else:
                    break

    def getKingMoves(self, r, c, moves):
        enemyColor = 'o' if self.alabasterToMove else 'a'
        #8 Squares surounding it 
        #(1 0, -1 0, 1 0, -1 0, 0 1, 1- 1, 1 -1, 1 1, -1 -1)
        for x in range(-1,2):
            for y in range(-1,2):
                
                endRow = r + x
                endCol = c + y
                if 0 <= endRow < 10 and 0 <= endCol < 10:
                    endPiece = self.board[endRow][endCol]
                    if endPiece == "//":
                        moves.append(Move((r, c), (endRow, endCol), self.board))
                        
                    elif endPiece[0] == enemyColor:
                        self.captureOpponent(r,c ,endPiece, endRow, endCol, moves)

    # Returns current one dimensional String of the Boardstate                 
    def getBoardString(self):
        string = ""

        #board positions
        for x in self.board:
            for y in x:
                string += y
        
        # Next To Move
        string += (' a' if self.alabasterToMove else ' o')

        #Reserves
        reservesString = " "
        for y in self.alabaster_reserves:
            reservesString += y
        for x in self.onyx_reserves:
            reservesString += x
        string += reservesString

        # Rabble Double Move
        rabblestring = " "
        if self.doubleMove:
            rabblestring += str(self.doubleMove[0])
            rabblestring += str(self.doubleMove[1])
        string += rabblestring
        return string
    
    #Calcs which units have been captured
    def get_captures(self, c):
        captures = ALABASTER_START_UNITS.copy() if c == 'o' else ONYX_START_UNITS.copy()
        availabel_units = self.alabaster_reserves.copy() if c == 'o' else self.onyx_reserves.copy()
        for x in self.board:
            for y in x:
                if y != "//" and y[0] != c and y[1].isupper():
                    availabel_units.append(y)
        counter = 0
        for x in range(0, len(availabel_units)):   
            counter += 1
            item = availabel_units.pop()
            if item in captures:
                captures.remove(item)
        return captures
    
    #Adds all Delploy moves and checks if the fort has been captured
    def getReserveMoves(self, r, c, moves):
        homeSquares = ((-1,0),(-1,1),(-1,2),(0,2),(1,2),(2,2),(2,1),(2,0),(2,-1),(1,-1),(0,-1),(-1,-1))
        enemyColor = 'o' if self.alabasterToMove else 'a'
        fortressCapture = 0
        for d in homeSquares:
            endRow = r + d[0]
            endCol = c + d[1]
            if 0 <= endRow < 10 and 0 <= endCol < 10:
                endPiece = self.board[endRow][endCol]
                if endPiece[0] == enemyColor:
                    fortressCapture += 1
                    if fortressCapture >= 2:
                        if self.alabasterToMove:
                            self.board[r][c] = "ax"
                            self.alabaster_reserves = []
                            self.onyx_captures = self.get_captures('o')
                        else:
                            self.board[r][c] = "ox"
                            self.onyx_reserves = []
                            self.alabaster_captures = self.get_captures('a')
                if endPiece == "//":
                    reserves = self.alabaster_reserves if self.alabasterToMove else self.onyx_reserves
                    for piece in reserves:
                        moves.append(Deploy(piece, (endRow, endCol), self.board))
                    # Find a solution for "moveId beaing unique" extra class and or field for these moves?

# Move Helper Class to Store some state and func
class Move():

    def __init__(self, startSq, endSq, board, doubleCapture = None, positionChange = None, doubleMove = None):
        self.startSq = startSq[0]*10 + startSq[1]+1
        self.endSq = endSq[0]*10 + endSq[1]+1
        self.startRow = startSq[0]
        self.startCol = startSq[1]
        self.endRow = endSq[0]
        self.endCol = endSq[1]
        self.pieceMoved = board[self.startRow][self.startCol]
        self.pieceCaptured = board[self.endRow][self.endCol]
        self.isCapture = self.pieceCaptured != "//"
        self.doubleCapture = doubleCapture
        self.positionChange = positionChange
        self.doubleMove = doubleMove
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
        self.doubleCapture = None
        self.positionChange = None
        self.doubleMove = None
        self.unit = unit  
        self.moveID = ord(self.unit[1])*10000 + self.endRow * 10 + self.endCol 
    def __eq__(self, other):
        if isinstance(other, Deploy):
            return self.moveID == other.moveID
        return False
    def returnInfoObject(self):
        return {"unit": self.pieceMoved, "endSquare": self.endSq, "startSquare": -1, "isCapture": False}