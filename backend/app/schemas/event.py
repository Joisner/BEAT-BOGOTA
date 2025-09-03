from pydantic import BaseModel, Field, validator
from typing import Optional, List, Union, Any
from datetime import datetime

class ContactSchema(BaseModel):
    type: str = Field(..., pattern="^(whatsapp|link)$")
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
    contact: ContactSchema
    imageUrl: Optional[str] = None
    genre: Optional[str] = None
    price: Optional[PriceSchema] = None
    tags: Optional[List[str]] = None
    capacity: Optional[int] = None
    featured: Optional[bool] = False

class EventCreate(EventBase):
    promotores: List[str] = []  # Array of promoter IDs

class EventUpdate(BaseModel):
    name: Optional[str] = None
    date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    contact: Optional[ContactSchema] = None
    imageUrl: Optional[str] = None
    genre: Optional[str] = None
    price: Optional[PriceSchema] = None
    tags: Optional[List[str]] = None
    capacity: Optional[int] = None
    featured: Optional[bool] = None
    promotores: Optional[List[str]] = None

class Event(EventBase):
    id: int
    promotores: List[str] = []  # Array of promoter IDs
    promotor: Optional[Any] = None

    class Config:
        from_attributes = True

    @validator('promotores', pre=True, always=True)
    def extract_promoter_ids(cls, v, values):
        """Extract promoter IDs from the relationship"""
        if hasattr(v, '__iter__') and not isinstance(v, str):
            # If it's a list of Promoter objects, extract IDs
            return [promoter.id if hasattr(promoter, 'id') else str(promoter) for promoter in v]
        return v or []

    @validator('promotor', pre=True, always=True)
    def set_first_promotor(cls, v, values):
        """Set the first promoter as the main promotor"""
        promotores = values.get('promotores', [])
        if promotores and len(promotores) > 0:
            # You might want to fetch the actual promoter object here
            # For now, returning the first promoter ID
            return {"id": promotores[0]}
        return None
