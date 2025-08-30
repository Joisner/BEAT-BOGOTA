from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class EtapaBoleta(Base):
    __tablename__ = "etapas_boletas"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    nombre = Column(String, nullable=False)
    fechaInicio = Column(DateTime, nullable=False)
    fechaFin = Column(DateTime, nullable=False)
    precio = Column(Float, nullable=False)
    disponibilidad = Column(Integer, nullable=False)
    activa = Column(Boolean, default=True)

    event = relationship("Event", back_populates="etapas")
