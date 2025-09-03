from pydantic import BaseModel, EmailStr
from typing import Optional

class PromoterBase(BaseModel):
    name: str
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    profile_url: Optional[str] = None
    enabled: bool = True

class PromoterCreate(PromoterBase):
    user_email: EmailStr

class PromoterUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    profile_url: Optional[str] = None
    enabled: Optional[bool] = None

class Promoter(PromoterBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True
