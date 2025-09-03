from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Promoter(Base):
    __tablename__ = "promoters"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String)
    whatsapp = Column(String)
    profile_url = Column(String)
    enabled = Column(Boolean, default=True)

    user = relationship("User", back_populates="promoter")
    events = relationship("Event", secondary="event_promoters", back_populates="promoters")
    discounts = relationship("Discount", back_populates="promoter")
