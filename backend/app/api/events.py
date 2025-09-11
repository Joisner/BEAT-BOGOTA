import logging
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..models.event import Event
from ..models.promotor import Promoter
from ..schemas.event import Event as EventSchema, EventCreate, EventUpdate
from .. import auth

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/", response_model=EventSchema)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user = Depends(auth.get_current_user)
):
    logger.info(f"Received event creation request with data: {event.dict()}")
    
    # Start a transaction
    try:
        # Convert Pydantic models to dict for JSON storage
        contact_dict = event.contact.dict() if event.contact else None
        price_dict = event.price.dict() if event.price else None
        
        # Create the event
        db_event = Event(
            name=event.name,
            date=event.date,
            location=event.location,
            description=event.description,
            contact=contact_dict,
            imageUrl=event.imageUrl,
            genre=event.genre,
            price=price_dict,
            tags=event.tags,
            capacity=event.capacity,
            featured=event.featured,
            promoters=[]  # Initialize with empty list
        )
        
        db.add(db_event)
        db.flush()  # Get the ID without committing
        logger.info(f"Created event with ID: {db_event.id}")
        
        # Handle promoters if provided
        if event.promotores and len(event.promotores) > 0:
            logger.info(f"Processing promoters: {event.promotores}")
            
            # Get all promoters in a single query
            promoters = db.query(Promoter).filter(Promoter.id.in_(event.promotores)).all()
            logger.info(f"Found promoters in DB: {[p.id for p in promoters]}")
            
            # Verify all promoters were found
            promoter_ids = {p.id for p in promoters}
            missing_promoters = set(event.promotores) - promoter_ids
            
            if missing_promoters:
                db.rollback()
                logger.error(f"Promoters not found: {missing_promoters}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"The following promoter IDs were not found: {', '.join(missing_promoters)}"
                )
            
            # Add promoters to the event
            db_event.promoters = promoters
            logger.info(f"Added {len(promoters)} promoters to event {db_event.id}")
        
        # Commit the transaction
        db.commit()
        
        # Refresh the event to get all relationships
        db.refresh(db_event)
        
        # Query the event again with joinedload to ensure we have all relationships
        db_event = db.query(Event).options(
            joinedload(Event.promoters)
        ).filter(Event.id == db_event.id).first()
        
        # Convert to dict to ensure proper serialization
        result = db_event.to_dict()
        logger.info(f"Final event data: {result}")
        
        return result
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating event: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the event: {str(e)}"
        )

@router.get("/", response_model=List[EventSchema])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Use joinedload to ensure promoters are loaded in a single query
    events = db.query(Event).options(
        joinedload(Event.promoters)
    ).order_by(Event.id).offset(skip).limit(limit).all()
    
    # Convert each event to dict to ensure proper serialization
    return [event.to_dict() for event in events]

@router.get("/{event_id}", response_model=EventSchema)
def read_event(event_id: int, db: Session = Depends(get_db)):
    # Use joinedload to ensure promoters are loaded in a single query
    event = db.query(Event).options(
        joinedload(Event.promoters)
    ).filter(Event.id == event_id).first()
    
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
        
    # Convert to dict to ensure proper serialization
    return event.to_dict()

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
