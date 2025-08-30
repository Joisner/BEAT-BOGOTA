from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.descuento import DescuentoTipo

class DescuentoBase(BaseModel):
    codigo: str
    descripcion: Optional[str] = None
    tipo: DescuentoTipo
    valor: float
    activo: bool = True
    fechaInicio: Optional[datetime] = None
    fechaFin: Optional[datetime] = None
    promotor_id: Optional[str] = None
    etapa_id: Optional[int] = None

class DescuentoCreate(DescuentoBase):
    pass

class DescuentoUpdate(BaseModel):
    codigo: Optional[str] = None
    descripcion: Optional[str] = None
    tipo: Optional[DescuentoTipo] = None
    valor: Optional[float] = None
    activo: Optional[bool] = None
    fechaInicio: Optional[datetime] = None
    fechaFin: Optional[datetime] = None
    promotor_id: Optional[str] = None
    etapa_id: Optional[int] = None

class Descuento(DescuentoBase):
    id: int

    class Config:
        from_attributes = True
