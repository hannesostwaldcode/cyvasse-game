from webserver import create_app, db, models
from webserver.models import User, Board
app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()