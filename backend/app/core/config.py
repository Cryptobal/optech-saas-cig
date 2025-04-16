from typing import List
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "OpTech SaaS"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: str = ""  # Lista de orígenes separados por coma
    
    @property
    def BACKEND_CORS_ORIGINS(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return []
        origins = [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        # Validar que no se use '*' en producción
        if not self.DEBUG and '*' in origins:
            return []  # En producción, si se detecta '*', retornamos lista vacía por seguridad
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