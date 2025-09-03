import enum
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from ..database import Base

class DiscountType(enum.Enum):
    GENERAL = "general"
    PROMOTER = "promoter"
    TICKET = "ticket"

class Discount(Base):
    __tablename__ = "discounts"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)
    description = Column(String)
    type = Column(Enum(DiscountType), nullable=False)
    value = Column(Float, nullable=False) # Percentage or fixed value
    active = Column(Boolean, default=True)
    start_date = Column(DateTime)
    end_date = Column(DateTime)

    promoter_id = Column(String, ForeignKey("promoters.id"))
    ticket_stage_id = Column(Integer, ForeignKey("ticket_stages.id"))

    promoter = relationship("Promoter", back_populates="discounts")
