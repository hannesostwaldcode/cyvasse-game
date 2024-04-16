import random

# Simple "AI", just playes any random move 
#ToDo edit so deploy moves arent played as frequently, balance over rep of certain units 
def findRandomMove(validMoves):
    return validMoves[random.randint(0, len(validMoves)-1)]