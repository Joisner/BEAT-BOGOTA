from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from ..database import Base
from sqlalchemy.orm import relationship

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    mercado_pago_id = Column(String, unique=True, index=True) # ID from Mercado Pago
    status = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="COP")
    description = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Store details of the purchase, like event_id, ticket_ids, quantity
    purchase_details = Column(JSON)

    user = relationship("User")
