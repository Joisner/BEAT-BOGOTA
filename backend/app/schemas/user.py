from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserBase(BaseModel):
    name: str
    lastname: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class User(UserBase):
    id: str

    class Config:
        from_attributes = True
