from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class TicketStage(Base):
    __tablename__ = "ticket_stages"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    name = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)
    availability = Column(Integer, nullable=False)
    active = Column(Boolean, default=True)

    event = relationship("Event", back_populates="ticket_stages")
