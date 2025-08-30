from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
import pytest

# --- Test Database Setup ---
# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_db.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create the test database and tables
Base.metadata.create_all(bind=engine)

def override_get_db():
    """
    Dependency override to use the test database instead of the production one.
    """
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Apply the override to the app
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# --- Tests ---

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Beat Bogotá API"}

def test_create_event():
    # Mock admin authentication header
    admin_headers = {"Authorization": "Bearer testadmin:admin"}

    event_data = {
        "name": "Test Event",
        "date": "2025-10-10T20:00:00",
        "location": "Test Location",
        "description": "A great test event",
        "contact_type": "whatsapp",
        "contact_value": "1234567890",
        "featured": True
    }

    response = client.post("/events/", headers=admin_headers, json=event_data)

    # Assertions
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["name"] == event_data["name"]
    assert data["location"] == event_data["location"]
    assert "id" in data

def test_create_event_unauthorized():
    # Use a non-admin token
    promoter_headers = {"Authorization": "Bearer testpromoter:promotor"}

    event_data = {
        "name": "Unauthorized Event",
        "date": "2025-10-11T20:00:00",
        "location": "Unauthorized Location",
        "contact_type": "link",
        "contact_value": "http://example.com"
    }

    response = client.post("/events/", headers=promoter_headers, json=event_data)

    # Assert that the request is forbidden
    assert response.status_code == 403, response.text
    assert "Access denied" in response.json()["detail"]
