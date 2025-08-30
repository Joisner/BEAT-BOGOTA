from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import auth
from app.database import get_db
from app.models.descuento import Descuento as DescuentoModel
from app.schemas.descuento import Descuento, DescuentoCreate, DescuentoUpdate

router = APIRouter(
    prefix="/descuentos",
    tags=["Descuentos"],
    dependencies=[Depends(auth.require_admin)], # Secure all endpoints in this router
)

@router.post("/", response_model=Descuento, status_code=status.HTTP_201_CREATED)
def create_descuento(descuento: DescuentoCreate, db: Session = Depends(get_db)):
    """
    Create a new descuento. Admin only.
    """
    db_descuento = DescuentoModel(**descuento.model_dump())
    db.add(db_descuento)
    db.commit()
    db.refresh(db_descuento)
    return db_descuento

@router.get("/", response_model=List[Descuento])
def read_descuentos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all descuentos. Admin only.
    """
    descuentos = db.query(DescuentoModel).offset(skip).limit(limit).all()
    return descuentos

@router.get("/{descuento_id}", response_model=Descuento)
def read_descuento(descuento_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single descuento by its ID. Admin only.
    """
    db_descuento = db.query(DescuentoModel).filter(DescuentoModel.id == descuento_id).first()
    if db_descuento is None:
        raise HTTPException(status_code=404, detail="Descuento not found")
    return db_descuento

@router.put("/{descuento_id}", response_model=Descuento)
def update_descuento(descuento_id: int, descuento: DescuentoUpdate, db: Session = Depends(get_db)):
    """
    Update an existing descuento. Admin only.
    """
    db_descuento = read_descuento(descuento_id, db)
    update_data = descuento.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_descuento, key, value)
    db.add(db_descuento)
    db.commit()
    db.refresh(db_descuento)
    return db_descuento

@router.delete("/{descuento_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_descuento(descuento_id: int, db: Session = Depends(get_db)):
    """
    Delete a descuento. Admin only.
    """
    db_descuento = read_descuento(descuento_id, db)
    db.delete(db_descuento)
    db.commit()
    return None
