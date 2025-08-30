import enum
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from ..database import Base

class DescuentoTipo(enum.Enum):
    GENERAL = "general"
    PROMOTOR = "promotor"
    ENTRADA = "entrada"

class Descuento(Base):
    __tablename__ = "descuentos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, nullable=False, index=True)
    descripcion = Column(String)
    tipo = Column(Enum(DescuentoTipo), nullable=False)
    valor = Column(Float, nullable=False) # Percentage or fixed value
    activo = Column(Boolean, default=True)
    fechaInicio = Column(DateTime)
    fechaFin = Column(DateTime)

    promotor_id = Column(String, ForeignKey("promotores.id"))
    # Assuming 'entradaTipo' from the frontend model refers to a specific ticket stage
    etapa_id = Column(Integer, ForeignKey("etapas_boletas.id"))

    promotor = relationship("Promotor", back_populates="descuentos")
