from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, Table, ForeignKey
from sqlalchemy.orm import relationship, joinedload
from ..database import Base
from sqlalchemy.dialects.mssql import JSON

# Association Table for Event and Promoter (Many-to-Many)
event_promoters = Table('event_promoters', Base.metadata,
    Column('event_id', Integer, ForeignKey('events.id'), primary_key=True),
    Column('promoter_id', String, ForeignKey('promoters.id'), primary_key=True)
)

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text)
    contact = Column(JSON)  # Stores {"type": "whatsapp|link", "value": "string"}
    imageUrl = Column(String)
    genre = Column(String)
    price = Column(JSON)  # Stores {"min": number, "max": number, "currency": "string"}
    tags = Column(JSON)  # Stores array of strings
    capacity = Column(Integer)
    featured = Column(Boolean, default=False)

    promoters = relationship("Promoter", secondary=event_promoters, back_populates="events")
    ticket_stages = relationship("TicketStage", back_populates="event")
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'date': self.date.isoformat() if self.date else None,
            'location': self.location,
            'description': self.description,
            'contact': self.contact,
            'imageUrl': self.imageUrl,
            'genre': self.genre,
            'price': self.price,
            'tags': self.tags,
            'capacity': self.capacity,
            'featured': self.featured,
            'promotores': [p.id for p in self.promoters] if hasattr(self, 'promoters') else []
        }
