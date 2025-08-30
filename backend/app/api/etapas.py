from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import auth
from app.database import get_db
from app.models.etapa_boleta import EtapaBoleta as EtapaBoletaModel
from app.schemas.etapa_boleta import EtapaBoleta, EtapaBoletaCreate, EtapaBoletaUpdate

router = APIRouter(
    tags=["Etapas de Boletería"],
)

# This endpoint is more RESTful if it's nested under the event
@router.post("/events/{event_id}/etapas", response_model=EtapaBoleta, status_code=status.HTTP_201_CREATED)
def create_etapa_for_event(
    event_id: int,
    etapa: EtapaBoletaCreate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Create a new ticket stage (etapa) for a specific event.
    """
    if etapa.event_id != event_id:
        raise HTTPException(status_code=400, detail="Event ID in path does not match event ID in body.")
    # Here you might want to check if the event actually exists
    db_etapa = EtapaBoletaModel(**etapa.model_dump())
    db.add(db_etapa)
    db.commit()
    db.refresh(db_etapa)
    return db_etapa

@router.get("/events/{event_id}/etapas", response_model=List[EtapaBoleta])
def read_etapas_for_event(event_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all ticket stages for a specific event.
    """
    etapas = db.query(EtapaBoletaModel).filter(EtapaBoletaModel.event_id == event_id).all()
    return etapas

@router.get("/etapas/{etapa_id}", response_model=EtapaBoleta)
def read_etapa(etapa_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single ticket stage by its ID.
    """
    db_etapa = db.query(EtapaBoletaModel).filter(EtapaBoletaModel.id == etapa_id).first()
    if db_etapa is None:
        raise HTTPException(status_code=404, detail="Etapa de boleta not found")
    return db_etapa

@router.put("/etapas/{etapa_id}", response_model=EtapaBoleta)
def update_etapa(
    etapa_id: int,
    etapa: EtapaBoletaUpdate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Update an existing ticket stage.
    """
    db_etapa = read_etapa(etapa_id, db)
    update_data = etapa.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_etapa, key, value)
    db.add(db_etapa)
    db.commit()
    db.refresh(db_etapa)
    return db_etapa

@router.delete("/etapas/{etapa_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_etapa(
    etapa_id: int,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Delete a ticket stage.
    """
    db_etapa = read_etapa(etapa_id, db)
    db.delete(db_etapa)
    db.commit()
    return None
