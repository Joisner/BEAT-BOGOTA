from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.event import Event
from ..models.promotor import Promoter
from ..schemas.event import Event as EventSchema, EventCreate, EventUpdate
from .. import auth

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/", response_model=EventSchema)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    db_event = Event(
        name=event.name,
        date=event.date,
        location=event.location,
        description=event.description,
        contact=event.contact.dict(),  # Convert Pydantic model to dict for JSON storage
        imageUrl=event.imageUrl,
        genre=event.genre,
        price=event.price.dict() if event.price else None,
        tags=event.tags,
        capacity=event.capacity,
        featured=event.featured
    )
    
    db.add(db_event)
    db.flush()  # Get the ID without committing
    
    if event.promotores:
        promoters = db.query(Promoter).filter(Promoter.id.in_(event.promotores)).all()
        if len(promoters) != len(event.promotores):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more promoter IDs not found"
            )
        db_event.promoters = promoters
    
    db.commit()
    db.refresh(db_event)
    
    return db_event

@router.get("/", response_model=List[EventSchema])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = db.query(Event).order_by(Event.id).offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=EventSchema)
def read_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=EventSchema)
def update_event(
    event_id: int,
    event: EventUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event.dict(exclude_unset=True)
    
    # Handle nested objects
    if 'contact' in update_data and update_data['contact']:
        update_data['contact'] = update_data['contact'].dict()
    if 'price' in update_data and update_data['price']:
        update_data['price'] = update_data['price'].dict()
    
    if 'promotores' in update_data:
        promoter_ids = update_data.pop('promotores')
        if promoter_ids is not None:
            promoters = db.query(Promoter).filter(Promoter.id.in_(promoter_ids)).all()
            if len(promoters) != len(promoter_ids):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="One or more promoter IDs not found"
                )
            db_event.promoters = promoters
    
    for field, value in update_data.items():
        setattr(db_event, field, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}
