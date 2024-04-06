def boardstringToJson(gameString: str):
    splitted = gameString.split(" ")
    positions = []
    board = splitted[0]
    for idx in range(0, len(board), 2): 
        if board[idx : idx + 2] == '//':
           board[:2]
        else:
            positions.append({"square": (idx//2)+1,"unit": board[idx : idx + 2]})
            board[:2]    
    return positions


def boardstringToArray(gameString: str):
    splitted = gameString.split(" ")
    board = splitted[0]
    alabasterToMove = splitted[1] == 'a'
    w, h = 10, 10
    res = [["//" for x in range(w)] for y in range(h)] 
    for idx in range(0, len(board), 2): 
    # appending sliced string
        r = idx//2 // 10
        c = idx//2 % 10
        res[r][c] = board[idx : idx + 2]

    reserveSting =  splitted[2]
    alabaster_reserves = []
    onyx_reserves = []
    for index in range(0, len(reserveSting),2):
        unit = reserveSting[index : index + 2]
        if(unit[0] == 'a'):
            alabaster_reserves.append(unit)
        if(unit[0] == 'o'):
            onyx_reserves.append(unit)
    doubleMoveString = splitted[3]
    doubleMove = None
    if len(doubleMoveString) == 2:
        doubleMove = (doubleMoveString[0], doubleMoveString[1])
    return res, alabasterToMove, alabaster_reserves, onyx_reserves, doubleMove


def JsonToBoardString(json, aToMove: bool, reserves, board = None):
    string_val = "/" * 200
    board_reserve = ""
    site = 'a'
    if board:
        site = 'o'
        print(board)
        splitted = board.split(" ") 
        string_val = splitted[0]
        board_reserve += splitted[2]
    for e in json:
        print(string_val)
        unit = e['unit']
        square = e['square']
        if unit == 'f':
            continue
        elif unit == 'F':
            pattern = [10,1,11] if site == 'a' else [0, -10, -1]
            pos = (0) if site == 'a' else (-11)
            string_val = string_val[:squareHelper(site, square, pos)] + site + e['unit'] + string_val[squareHelper(site, square, pos) + 2:]
            for placeholder_f in pattern:
                new_pos = squareHelper(site, square, placeholder_f)
                string_val = string_val[:new_pos] + site + 'f' + string_val[new_pos + 2:]
            continue
        elif board:
            index = (101-e['square']-1)*2
        else:
            index = (e['square']-1)*2
        string_val = string_val[:index] + site + e['unit'] + string_val[index + 2:]
    for u in reserves:
        board_reserve += site + u
    boardString = string_val + (' a ' if aToMove else ' o ') + board_reserve + " "

    return boardString

def squareHelper(site: str, sqaure, mod):
    if site == 'a':
        return (sqaure-1 + mod)*2
    elif site == 'o':  
        return (101-sqaure-1 + mod)*2

