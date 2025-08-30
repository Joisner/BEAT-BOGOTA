from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EtapaBoletaBase(BaseModel):
    nombre: str
    fechaInicio: datetime
    fechaFin: datetime
    precio: float
    disponibilidad: int
    activa: bool = True

class EtapaBoletaCreate(EtapaBoletaBase):
    event_id: int

class EtapaBoletaUpdate(BaseModel):
    nombre: Optional[str] = None
    fechaInicio: Optional[datetime] = None
    fechaFin: Optional[datetime] = None
    precio: Optional[float] = None
    disponibilidad: Optional[int] = None
    activa: Optional[bool] = None

class EtapaBoleta(EtapaBoletaBase):
    id: int
    event_id: int

    class Config:
        from_attributes = True
