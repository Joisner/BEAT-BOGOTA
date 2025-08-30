# backend/create_db.py
from app.database import Base, engine
from app.models.user import User
from app.models.promotor import Promotor
from app.models.event import Event
from app.models.etapa_boleta import EtapaBoleta
from app.models.descuento import Descuento
from app.models.transaction import Transaction

print("Creating database and tables...")
Base.metadata.create_all(bind=engine)
print("Database and tables created successfully.")
