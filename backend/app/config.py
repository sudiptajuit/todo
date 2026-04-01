from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg2://postgres:password@db:5432/todos"
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    API_V1_STR: str = "/api/v1"

    class Config:
        env_file = ".env"

settings = Settings()
