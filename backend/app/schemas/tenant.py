from typing import Optional

from pydantic import BaseModel


# Propiedades compartidas
class TenantBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = True


# Propiedades para crear tenant
class TenantCreate(TenantBase):
    name: str


# Propiedades para actualizar tenant
class TenantUpdate(TenantBase):
    pass


# Propiedades en la respuesta
class TenantInDBBase(TenantBase):
    id: int
    slug: str

    class Config:
        from_attributes = True


# Propiedades para devolver al API
class Tenant(TenantInDBBase):
    pass 