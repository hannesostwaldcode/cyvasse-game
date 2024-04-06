from engine.engine import GameState
BOARD_STRING = "aK//////////////am////////////aBaR////oD//////aLaFaf////aCam//////aKafafamaE////////////aBaD////////////////oL////aR////oT////oR////oB////om//////oKoFof//om////////////ofofoH//////////////////oS////oC o aRaSaSaToBoLoHoRoRoLoB "

def test_getCaptures():
    gs = GameState(BOARD_STRING)
    assert gs.alabaster_captures == ['oS', 'oS', 'oE', 'oE']
def test_gamestateLoading():
    gs = GameState(BOARD_STRING)
    assert gs.board[0][0] == 'aK'