from flask.cli import FlaskGroup
from werkzeug.security import generate_password_hash
from webserver import create_app, db, models
from faker import Faker
from faker.providers import DynamicProvider
from dbScript import COUNTRY_KEYS

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
    one_user = models.User(email="test@fantasy.com", name="Test User",country="DE", elo=4000, password=generate_password_hash("1234", method='pbkdf2'))
    two_user = models.User(email="magnus@fantasy.com", name="Magnus Carlsen",country="NO", elo=1000, password=generate_password_hash("1234", method='pbkdf2'))
    three_user = models.User(email="jan@fantasy.com", name="Jan Gustafsson",country="DE", elo=1000, password=generate_password_hash("1234", method='pbkdf2'))
    four_user = models.User(email="bot@fantasy.com", name="Dice Bot",country="US",is_ai=True, elo=200, password=generate_password_hash("1234", method='pbkdf2'))
    
    db.session.add(one_user)
    db.session.add(two_user)
    db.session.add(three_user)
    db.session.add(four_user)

    fake = Faker()
    fake.add_provider(country_codes_provider)
    for x in range(0, 30):
        user = models.User(email=fake.email(), name=fake.name(),country=fake.country_codes(), elo=1000, password=generate_password_hash("1234", method='pbkdf2'))
        db.session.add(user)

    #Add Games for Dev
    game_one = models.Board(positionString=boardString, player_alabaster_id=1, player_onyx_id=2)
    game_two = models.Board(positionString=boardString, player_alabaster_id=3, player_onyx_id=1)
    game_three = models.Board(positionString=boardString, player_alabaster_id=1, player_onyx_id=4, ai_game=True)
    game_four = models.Board(positionString=boardString, player_alabaster_id=3, player_onyx_id=1, archived=True)
    game_five = models.Board(positionString=boardString, player_alabaster_id=1, player_onyx_id=2, archived=True)
    db.session.add(game_one)
    db.session.add(game_two)
    db.session.add(game_three)
    db.session.add(game_four)
    db.session.add(game_five)

    db.session.commit()
    models.Board.archived

country_codes_provider = DynamicProvider(
     provider_name="country_codes",
     elements=COUNTRY_KEYS,
)


@cli.command("mock_data")
def mock_data():
   
    
    db.session.commit()
if __name__ == "__main__":
    cli()

