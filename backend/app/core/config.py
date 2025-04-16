from typing import List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator
import re

class Settings(BaseSettings):
    PROJECT_NAME: str = "OpTech SaaS"
    API_V1_STR: str = "/api/v1"
    
    # CORS - Default origins para desarrollo y producción
    CORS_ORIGINS: str = "https://gard-saas-git-main-gard-security.vercel.app,http://localhost:3000,http://localhost:3001,http://localhost:3002"
    
    @property
    def BACKEND_CORS_ORIGINS(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return []
        # Limpiamos los orígenes de cualquier carácter no deseado
        origins = []
        for origin in self.CORS_ORIGINS.split(","):
            # Limpiamos el origen de cualquier carácter que no sea parte de una URL válida
            cleaned = re.sub(r'[;,\s]+$', '', origin.strip())
            if cleaned and cleaned != '*':  # Ignoramos '*' en producción
                origins.append(cleaned)
        return origins
    
    # Database
    DATABASE_URL: str
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # First superadmin
    FIRST_SUPERADMIN_EMAIL: str
    FIRST_SUPERADMIN_PASSWORD: str
    
    # Debug - Forzar False en producción
    DEBUG: bool = False
    
    @validator("DEBUG", pre=True)
    def validate_debug(cls, v, values):
        # Asegurar que DEBUG sea False si estamos en un entorno que parece producción
        if isinstance(v, str):
            v = v.lower() == "true"
        return False if "production" in values.get("ENVIRONMENT", "").lower() else v
    
    # Environment
    ENVIRONMENT: str = "production"  # Valor por defecto

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 