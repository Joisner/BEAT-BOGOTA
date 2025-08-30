from pydantic import BaseModel
from typing import Optional

class PromotorBase(BaseModel):
    nombre: str
    telefono: Optional[str] = None
    whatsapp: Optional[str] = None
    perfilUrl: Optional[str] = None
    habilitado: bool = True

class PromotorCreate(PromotorBase):
    user_id: str # The Firebase UID of the user to be a promoter

class PromotorUpdate(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    whatsapp: Optional[str] = None
    perfilUrl: Optional[str] = None
    habilitado: Optional[bool] = None

class Promotor(PromotorBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True
