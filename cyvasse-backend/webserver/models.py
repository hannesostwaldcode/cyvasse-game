from typing import List
from sqlalchemy.orm import relationship
from sqlalchemy.orm import  Mapped, mapped_column
from sqlalchemy import ForeignKey, func
from datetime import datetime
from engine import util
from . import db


class Board(db.Model):
    __tablename__ = "board_table"
    id: Mapped[int] = mapped_column(primary_key=True)
    positionString: Mapped[str]
    archived: Mapped[bool] = mapped_column(default=False)    
    created_at: Mapped[datetime] =mapped_column(insert_default=func.now())

    player_onyx_id: Mapped[int] = mapped_column(ForeignKey("user_table.id"), nullable=True)
    player_alabaster_id: Mapped[int] = mapped_column(ForeignKey("user_table.id"), nullable=True)
    
    player_onyx: Mapped["User"] = relationship(back_populates="onyx_games", foreign_keys=[player_onyx_id])
    player_alabaster: Mapped["User"] = relationship(back_populates="alabaster_games", foreign_keys=[player_alabaster_id])
   
    @property
    def serialized(self):
        return {
            "player_alabaster": self.player_alabaster.name,
            "player_onyx":      self.player_onyx.name,
            "board":            util.boardstringToJson(self.positionString),
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
    onyx_games: Mapped[List["Board"]] = relationship(back_populates="player_onyx", foreign_keys=[Board.player_onyx_id])
    alabaster_games: Mapped[List["Board"]] = relationship(back_populates="player_alabaster", foreign_keys=[Board.player_alabaster_id]) 
