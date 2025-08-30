from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Promotor(Base):
    __tablename__ = "promotores"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    nombre = Column(String, nullable=False)
    telefono = Column(String)
    whatsapp = Column(String)
    perfilUrl = Column(String)
    habilitado = Column(Boolean, default=True)

    user = relationship("User", back_populates="promotor")
    events = relationship("Event", secondary="event_promotores", back_populates="promotores")
    descuentos = relationship("Descuento", back_populates="promotor")
