from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"  # Default to SQLite for easy testing
    FIREBASE_CREDENTIALS_PATH: str = "path/to/your/firebase/credentials.json"
    MERCADOPAGO_ACCESS_TOKEN: str = "YOUR_MERCADOPAGO_ACCESS_TOKEN"

    class Config:
        env_file = ".env"

settings = Settings()
