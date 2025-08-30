from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import auth
from app.database import get_db
from app.models.event import Event as EventModel
from app.schemas.event import Event, EventCreate, EventUpdate

router = APIRouter(
    prefix="/events",
    tags=["Events"],
)

@router.post("/", response_model=Event, status_code=status.HTTP_201_CREATED)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Create a new event. Only accessible to users with the 'admin' role.
    """
    db_event = EventModel(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/", response_model=List[Event])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all events with pagination.
    """
    events = db.query(EventModel).offset(skip).limit(limit).all()
    return events

@router.get("/featured", response_model=List[Event])
def read_featured_events(db: Session = Depends(get_db)):
    """
    Retrieve all featured events.
    """
    events = db.query(EventModel).filter(EventModel.featured == True).all()
    return events

@router.get("/genre/{genre_name}", response_model=List[Event])
def read_events_by_genre(genre_name: str, db: Session = Depends(get_db)):
    """
    Retrieve all events matching a specific genre.
    """
    events = db.query(EventModel).filter(EventModel.genre.ilike(f"%{genre_name}%")).all()
    return events

@router.get("/{event_id}", response_model=Event)
def read_event(event_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single event by its ID.
    """
    db_event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.put("/{event_id}", response_model=Event)
def update_event(
    event_id: int,
    event: EventUpdate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Update an existing event. Only accessible to users with the 'admin' role.
    """
    db_event = read_event(event_id, db)
    update_data = event.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_event, key, value)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Delete an event. Only accessible to users with the 'admin' role.
    """
    db_event = read_event(event_id, db)
    db.delete(db_event)
    db.commit()
    return None
