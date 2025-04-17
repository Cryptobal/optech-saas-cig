from typing import Optional
from datetime import datetime
from pydantic import BaseModel, validator
import re

def validar_rut(rut: str) -> bool:
    """Valida el formato y dígito verificador de un RUT chileno."""
    rut = rut.upper().replace(".", "").replace("-", "")
    if not re.match(r'^[0-9]+[0-9Kk]$', rut):
        return False
    
    cuerpo = rut[:-1]
    dv = rut[-1]
    
    suma = 0
    multiplicador = 2
    
    for c in reversed(cuerpo):
        suma += int(c) * multiplicador
        multiplicador = multiplicador + 1 if multiplicador < 7 else 2
    
    resto = suma % 11
    dv_calculado = str(11 - resto) if resto > 1 else 'K'
    
    return dv.upper() == dv_calculado

class TenantBase(BaseModel):
    name: str
    rut: str
    is_active: bool = True

    @validator('rut')
    def validate_rut(cls, v):
        v = v.upper().replace(".", "").replace("-", "")
        if not validar_rut(v):
            raise ValueError('RUT inválido')
        return v

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseModel):
    name: Optional[str] = None
    rut: Optional[str] = None
    is_active: Optional[bool] = None

    @validator('rut')
    def validate_rut(cls, v):
        if v is not None:
            v = v.upper().replace(".", "").replace("-", "")
            if not validar_rut(v):
                raise ValueError('RUT inválido')
        return v

class TenantInDBBase(TenantBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Tenant(TenantInDBBase):
    pass 