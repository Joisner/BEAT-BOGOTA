from pydantic_settings import BaseSettings
from typing import ClassVar
from urllib.parse import quote_plus

class Settings(BaseSettings):
    driver: ClassVar[str] = quote_plus("ODBC Driver 17 for SQL Server")  # No será un campo de Pydantic
    DATABASE_URL: str = f"mssql+pyodbc://DESKTOP-FD54TUR\\SQLEXPRESS/BEAT-BOGOTA?driver={driver}&trusted_connection=yes"
    FIREBASE_CREDENTIALS_PATH: str = "firebase-credentials.json"
    MERCADOPAGO_ACCESS_TOKEN: str = "YOUR_MERCADOPAGO_ACCESS_TOKEN"

    class Config:
        env_file = ".env"

settings = Settings()
