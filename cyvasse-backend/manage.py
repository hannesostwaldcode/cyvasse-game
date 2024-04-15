from flask.cli import FlaskGroup
from werkzeug.security import generate_password_hash
from webserver import create_app, db, models

app = create_app()
cli = FlaskGroup(app)
@cli.command("create_db")
def create_db():
    db.drop_all()
    db.create_all()
    bot_user = models.User(email="bot@fantasy.com", name="Dice Bot",country="US",is_ai=True, elo=200, password=generate_password_hash("1234", method='pbkdf2'))
    db.session.add(bot_user)
    db.session.commit()

@cli.command("create_db_withdev")
def create_db_withdev():
    boardString = "am//////////////////////////aS//////am////////aFafaE////////////aBafafaT//////////am//aLaE//////////om//oRoSom//////////oHofofoL//////////////ofoFoE////////////////////om////////////////////////////// a aRaRaRaSaSaBaBaLaLaHaHaCaDaKoRoRoSoSoBoBoBoLoLoHoEoCoToDoK "
    db.drop_all()
    db.create_all()

    #Add Users for Dev
    one_user = models.User(email="test@fantasy.com", name="Hannes",country="DE", elo=1000, password=generate_password_hash("1234", method='pbkdf2'))
    two_user = models.User(email="magnus@fantasy.com", name="Magnus Carlsen",country="NO", elo=1000, password=generate_password_hash("1234", method='pbkdf2'))
    three_user = models.User(email="jan@fantasy.com", name="Jan Gustafsson",country="DE", elo=1000, password=generate_password_hash("1234", method='pbkdf2'))
    four_user = models.User(email="bot@fantasy.com", name="Dice Bot",country="US",is_ai=True, elo=200, password=generate_password_hash("1234", method='pbkdf2'))
    
    db.session.add(one_user)
    db.session.add(two_user)
    db.session.add(three_user)
    db.session.add(four_user)

    #Add Games for Dev
    game_one = models.Board(positionString=boardString, player_alabaster_id=one_user.id, player_onyx_id=two_user.id)
    game_two = models.Board(positionString=boardString, player_alabaster_id=three_user.id, player_onyx_id=two_user.id)
    db.session.add(game_one)
    db.session.add(game_two)
    db.session.commit()
if __name__ == "__main__":
    cli()