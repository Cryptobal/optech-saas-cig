import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, EmailStr, PostgresDsn, validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS
    CORS_ORIGINS: Union[str, List[str]]

    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str):
            if "," in v:
                return [i.strip() for i in v.split(",")]
            return [v.strip()]
        return v

    # DATABASE
    DATABASE_URL: PostgresDsn
    
    # SUPERADMIN
    FIRST_SUPERADMIN_EMAIL: EmailStr
    FIRST_SUPERADMIN_PASSWORD: str

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings() 