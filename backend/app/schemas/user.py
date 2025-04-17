from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    is_active: bool = True
    is_superadmin: bool = False
    tenant_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    is_active: Optional[bool] = None
    is_superadmin: Optional[bool] = None
    tenant_id: Optional[int] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 