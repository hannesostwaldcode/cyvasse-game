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
    return res, alabasterToMove, alabaster_reserves, onyx_reserves


def JsonToBoardString(json, aToMove: bool):
    string_val = "/" * 200
    for e in json:
        index = (e['square']-1)*2
        string_val = string_val[:index] + e['unit'] + string_val[index + 2:]
    boardString = string_val + (' a' if aToMove else ' o')
    return boardString