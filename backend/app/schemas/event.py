from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# To match the frontend model structure
class ContactSchema(BaseModel):
    type: str
    value: str

class PriceSchema(BaseModel):
    min: float
    max: Optional[float] = None
    currency: str = "COP"

class EventBase(BaseModel):
    name: str
    date: datetime
    location: str
    description: Optional[str] = None
    contact_type: str
    contact_value: str
    imageUrl: Optional[str] = None
    genre: Optional[str] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    price_currency: Optional[str] = "COP"
    tags: Optional[str] = None # Storing as comma-separated string, matching the DB model
    capacity: Optional[int] = None
    featured: Optional[bool] = False

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    name: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    contact_type: Optional[str] = None
    contact_value: Optional[str] = None
    imageUrl: Optional[str] = None
    genre: Optional[str] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    price_currency: Optional[str] = None
    tags: Optional[str] = None
    capacity: Optional[int] = None
    featured: Optional[bool] = None

class Event(EventBase):
    id: int

    class Config:
        from_attributes = True
