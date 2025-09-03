from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketStageBase(BaseModel):
    name: str
    start_date: datetime
    end_date: datetime
    price: float
    availability: int
    active: bool = True

class TicketStageCreate(TicketStageBase):
    event_id: int

class TicketStageUpdate(BaseModel):
    name: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    price: Optional[float] = None
    availability: Optional[int] = None
    active: Optional[bool] = None

class TicketStage(TicketStageBase):
    id: int
    event_id: int

    class Config:
        from_attributes = True
