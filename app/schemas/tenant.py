from pydantic import BaseModel

class TenantBase(BaseModel):
    name: str
    domain: str
    is_active: bool = True

class TenantCreate(TenantBase):
    pass

class TenantUpdate(TenantBase):
    name: str | None = None
    domain: str | None = None
    is_active: bool | None = None

class TenantInDBBase(TenantBase):
    id: int

    class Config:
        from_attributes = True

class Tenant(TenantInDBBase):
    pass 