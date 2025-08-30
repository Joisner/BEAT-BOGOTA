from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, Table, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

# Association Table for Event and Promotor (Many-to-Many)
event_promotores = Table('event_promotores', Base.metadata,
    Column('event_id', Integer, ForeignKey('events.id'), primary_key=True),
    Column('promotor_id', String, ForeignKey('promotores.id'), primary_key=True)
)

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text)
    contact_type = Column(String) # 'whatsapp' or 'link'
    contact_value = Column(String)
    imageUrl = Column(String)
    genre = Column(String)
    price_min = Column(Float)
    price_max = Column(Float)
    price_currency = Column(String, default='COP')
    tags = Column(String) # Storing as comma-separated string
    capacity = Column(Integer)
    featured = Column(Boolean, default=False)

    promotores = relationship("Promotor", secondary=event_promotores, back_populates="events")
    etapas = relationship("EtapaBoleta", back_populates="event")
    # Add other relationships as needed, e.g., transactions
