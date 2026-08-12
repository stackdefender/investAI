import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "InvestAI"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "investai_super_secret_jwt_key_change_in_production_2026_finance")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 4320 # 3 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./investai.db")
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "")
    MARKET_DATA_API_KEY: str = os.getenv("MARKET_DATA_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
