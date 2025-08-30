import enum
from sqlalchemy import Column, String, Enum
from sqlalchemy.orm import relationship
from ..database import Base

class UserRole(enum.Enum):
    ADMIN = "admin"
    PROMOTOR = "promotor"
    ASSISTANT = "assistant"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # This will be the Firebase UID
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    promotor = relationship("Promotor", back_populates="user", uselist=False)
