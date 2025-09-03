from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import auth
from app.database import get_db
from app.models.etapa_boleta import TicketStage as TicketStageModel
from app.schemas.etapa_boleta import TicketStage, TicketStageCreate, TicketStageUpdate

router = APIRouter(
    tags=["Ticket Stages"],
)

# This endpoint is more RESTful if it's nested under the event
@router.post("/events/{event_id}/ticket-stages", response_model=TicketStage, status_code=status.HTTP_201_CREATED)
def create_ticket_stage_for_event(
    event_id: int,
    ticket_stage: TicketStageCreate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Create a new ticket stage for a specific event.
    """
    if ticket_stage.event_id != event_id:
        raise HTTPException(status_code=400, detail="Event ID in path does not match event ID in body.")
    # Here you might want to check if the event actually exists
    db_ticket_stage = TicketStageModel(**ticket_stage.model_dump())
    db.add(db_ticket_stage)
    db.commit()
    db.refresh(db_ticket_stage)
    return db_ticket_stage

@router.get("/events/{event_id}/ticket-stages", response_model=List[TicketStage])
def read_ticket_stages_for_event(event_id: int, db: Session = Depends(get_db)):
    """
    Retrieve all ticket stages for a specific event.
    """
    ticket_stages = db.query(TicketStageModel).filter(TicketStageModel.event_id == event_id).all()
    return ticket_stages

@router.get("/ticket-stages/{ticket_stage_id}", response_model=TicketStage)
def read_ticket_stage(ticket_stage_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single ticket stage by its ID.
    """
    db_ticket_stage = db.query(TicketStageModel).filter(TicketStageModel.id == ticket_stage_id).first()
    if db_ticket_stage is None:
        raise HTTPException(status_code=404, detail="Ticket stage not found")
    return db_ticket_stage

@router.put("/ticket-stages/{ticket_stage_id}", response_model=TicketStage)
def update_ticket_stage(
    ticket_stage_id: int,
    ticket_stage: TicketStageUpdate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Update an existing ticket stage.
    """
    db_ticket_stage = read_ticket_stage(ticket_stage_id, db)
    update_data = ticket_stage.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_ticket_stage, key, value)
    db.add(db_ticket_stage)
    db.commit()
    db.refresh(db_ticket_stage)
    return db_ticket_stage

@router.delete("/ticket-stages/{ticket_stage_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket_stage(
    ticket_stage_id: int,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Delete a ticket stage.
    """
    db_ticket_stage = read_ticket_stage(ticket_stage_id, db)
    db.delete(db_ticket_stage)
    db.commit()
    return None
