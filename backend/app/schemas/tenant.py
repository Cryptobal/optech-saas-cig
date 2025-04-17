from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class TenantBase(BaseModel):
    nombre: str
    rut: str
    estado: bool = True
    plan_subscripcion: Optional[str] = None
    configuracion: Optional[dict] = None

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseModel):
    nombre: Optional[str] = None
    rut: Optional[str] = None
    estado: Optional[bool] = None
    plan_subscripcion: Optional[str] = None
    configuracion: Optional[dict] = None

class TenantInDBBase(TenantBase):
    id: UUID
    fecha_creacion: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Tenant(TenantInDBBase):
    pass 