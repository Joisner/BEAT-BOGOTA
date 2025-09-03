from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.descuento import DiscountType

class DiscountBase(BaseModel):
    code: str
    description: Optional[str] = None
    type: DiscountType
    value: float
    active: bool = True
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    promoter_id: Optional[str] = None
    ticket_stage_id: Optional[int] = None

class DiscountCreate(DiscountBase):
    pass

class DiscountUpdate(BaseModel):
    code: Optional[str] = None
    description: Optional[str] = None
    type: Optional[DiscountType] = None
    value: Optional[float] = None
    active: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    promoter_id: Optional[str] = None
    ticket_stage_id: Optional[int] = None

class Discount(DiscountBase):
    id: int

    class Config:
        from_attributes = True
