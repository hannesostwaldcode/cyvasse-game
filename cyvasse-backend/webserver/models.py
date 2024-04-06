from typing import List
from sqlalchemy.orm import relationship
from sqlalchemy.orm import  Mapped, mapped_column
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import ForeignKey, func, Column, Table, Integer, UniqueConstraint, or_
from marshmallow import fields
from marshmallow.validate import Length, Range
from datetime import datetime
from engine import util
from . import db, ma


class Board(db.Model):
    __tablename__ = "board_table"
    id: Mapped[int] = mapped_column(primary_key=True)
    positionString: Mapped[str]
    unready: Mapped[bool] = mapped_column(default=False)
    archived: Mapped[bool] = mapped_column(default=False)
    ai_game: Mapped[bool] = mapped_column(default=False)    
    created_at: Mapped[datetime] =mapped_column(insert_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(insert_default=func.now(), onupdate=func.current_timestamp())

    player_onyx_id: Mapped[int] = mapped_column(ForeignKey("user_table.id"), nullable=True)
    player_alabaster_id: Mapped[int] = mapped_column(ForeignKey("user_table.id"), nullable=True)
    
    player_onyx: Mapped["User"] = relationship(back_populates="onyx_games", foreign_keys=[player_onyx_id])
    player_alabaster: Mapped["User"] = relationship(back_populates="alabaster_games", foreign_keys=[player_alabaster_id])
    
     
    def serialized_with_id(self, id):
        return {
            "player_alabaster": self.player_alabaster.name,
            "player_onyx":      self.player_onyx.name,
            "self_alabaster":   True if self.player_alabaster_id == id else False,
            "board":            util.boardstringToJson(self.positionString),
            #ToDo Change to actually show last interaction
            "last_interaction": self.updated_at.strftime(format="%d/%m/%Y"),
            "id":               self.id
        }
    def challenges(self):
        return {
               "challenger": self.player_alabaster.name,
                "game_id":  self.id
        }
    @property
    def serialized(self):
        return {
            "player_alabaster": self.player_alabaster.name,
            "player_onyx":      self.player_onyx.name,
            "board":            util.boardstringToJson(self.positionString),
            #ToDo Change to actually show last interaction
            "last_interaction": self.created_at.strftime(format="%d/%m/%Y"),
            "id":               self.id
        }
    


class User(db.Model):
    __tablename__ = "user_table"
    id: Mapped[int] = mapped_column(primary_key=True) # primary keys are required by SQLAlchemy
    email: Mapped[str]
    password: Mapped[str]
    country: Mapped[str]
    elo: Mapped[int]
    name: Mapped[str]

    receiving_users = association_proxy('receiving_friends', 'receiving_user')
    requesting_users =  association_proxy('requesting_friends', 'requesting_user')

    onyx_games: Mapped[List["Board"]] = relationship(back_populates="player_onyx", foreign_keys=[Board.player_onyx_id])
    alabaster_games: Mapped[List["Board"]] = relationship(back_populates="player_alabaster", foreign_keys=[Board.player_alabaster_id]) 

    def findIfFriend(self, id):
        existing_friendship = Friendship.query.filter(((Friendship.requesting_user_id==self.id) & (Friendship.receiving_user_id==id)) | ((Friendship.requesting_user_id==id) & (Friendship.receiving_user_id==self.id))).first()
        if existing_friendship:
            return {"req": True , "acc": existing_friendship.accepted}
        else:
            return {"req": False , "acc": False}
    
    def get_connected_users(self):
    # Query for friendships where the user is either the requesting or receiving user
        friendships = Friendship.query.filter(or_(Friendship.requesting_user_id == self.id, Friendship.receiving_user_id == self.id)).filter(Friendship.accepted == True).all()

        connected_users = []
        for friendship in friendships:
            # Add the connected user to the list based on their role in the friendship
            connected_user_id = friendship.requesting_user_id if friendship.receiving_user_id == self.id else friendship.receiving_user_id
            connected_user = User.query.get(connected_user_id)
            connected_users.append(connected_user)

        return connected_users
    def add_user(self, user, role):
    # Check if the friendship already exists
        existing_friendship = Friendship.query.filter(((Friendship.requesting_user_id==self.id) & (Friendship.receiving_user_id==user.id)) | ((Friendship.requesting_user_id==user.id) & (Friendship.receiving_user_id==self.id))).first()
        if existing_friendship:
            if existing_friendship.receiving_user_id == self.id and not existing_friendship.accepted:
                 existing_friendship.accepted = True
            print("hi")
            # Friendship already exists, you can update the role here if needed
        else:
            # Friendship doesn't exist, create a new one
            new_friendship = Friendship(requesting_user_id=self.id, receiving_user_id=user.id, accepted=role)
            db.session.add(new_friendship)
        db.session.commit()  
    @property
    def serialized(self):
        return {
            "name": self.name,
            "id":    self.id,
            "elo":      self.elo,
            "country":            self.country,
            "gamePlayed":               len(self.alabaster_games) + len(self.onyx_games),
        }
    def serialized_with_friend(self, id):
         return {
            "name": self.name,
            "id":    self.id,
            "elo":      self.elo,
            "country":            self.country,
            "gamePlayed":               len(self.alabaster_games) + len(self.onyx_games),
            "friend":           self.findIfFriend(id)
        }

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
    email = fields.Email(required=True, validate=Length(max=60))
    password = fields.String(required=True)
    country = fields.String(required=True)
    name = fields.String(required=True)

class LogInSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
    email = fields.Email(required=True)
    password = fields.String(required=True)

class SubmittedMoveSchema(ma.Schema):
    gameId = fields.Int()
    startSquare = fields.Int(allow_none=True, validate=Range(min=0, max=100))
    endSquare = fields.Int(validate=Range(min=0, max=100))
    unit = fields.String(validate=Length(max=2), allow_none=True)

class positionData(ma.Schema):
    unit = fields.String(validate=Length(max=2))
    square  = fields.Int(validate=Range(min=0, max=100))

class CreateGameSchema(ma.Schema):
    reserves = fields.List(fields.String(validate=Length(equal=1)))
    board = fields.List(fields.Nested(positionData))
 


class Friendship(db.Model):
    __tablename__ = "friendship_assoc"

    requesting_user_id = Column(Integer, ForeignKey('user_table.id'), primary_key=True)
    receiving_user_id = Column(Integer, ForeignKey('user_table.id'), primary_key=True)
    accepted: Mapped[bool]

    requesting_user = relationship(User, 
                                    primaryjoin=(requesting_user_id == User.id),
                                    backref='receiving_friends')
    receiving_user = relationship(User,
                                  primaryjoin=(receiving_user_id == User.id),
                                  backref='requesting_friends')
