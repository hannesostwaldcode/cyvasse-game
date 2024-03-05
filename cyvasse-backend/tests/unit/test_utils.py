from engine.util import boardstringToArray

def test_bToA():
    BOARD_STRING = "aK//////////////am////////////aBaR////oD//////aLaFaf////aCam//////aKafafamaE////////////aBaD////////////////oL////aR////oT////oR////oB////om//////oKoFof//om////////////ofofoH//////////////////oS////oC o aRaSaSaToBoLoH "
    interpretedStrings = boardstringToArray(BOARD_STRING)
    assert interpretedStrings[0][0][8] == "am"
    assert interpretedStrings[0][0][0] == "aK"
    assert interpretedStrings[0][9][9] == "oC"
    assert interpretedStrings[1] == False
    assert interpretedStrings[2] == ["aR","aS","aS","aT"]
    assert interpretedStrings[3] == ["oB","oL","oH"]
    assert interpretedStrings[4] == None