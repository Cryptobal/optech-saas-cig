from typing import Optional

from pydantic import BaseModel, EmailStr


# Propiedades compartidas
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    full_name: Optional[str] = None
    is_superuser: bool = False


# Propiedades para crear usuario
class UserCreate(UserBase):
    email: EmailStr
    password: str
    full_name: str


# Propiedades para actualizar usuario
class UserUpdate(UserBase):
    password: Optional[str] = None


# Propiedades en la respuesta
class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True


# Propiedades adicionales almacenadas en DB no visibles en respuesta
class UserInDB(UserInDBBase):
    hashed_password: str


# Propiedades para devolver al API
class User(UserInDBBase):
    pass


# Propiedades para autenticación
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None 