from typing import List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    PROJECT_NAME: str = "OpTech SaaS"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: str = ""  # Lista de orígenes separados por coma
    
    @property
    def BACKEND_CORS_ORIGINS(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return []
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # First superadmin
    FIRST_SUPERADMIN_EMAIL: str
    FIRST_SUPERADMIN_PASSWORD: str
    
    # Debug
    DEBUG: bool = False

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 