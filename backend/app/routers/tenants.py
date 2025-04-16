from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate, Tenant
from app.services.auth import get_current_superadmin

router = APIRouter()

@router.post("/", response_model=Tenant)
def create_tenant(
    *,
    db: Session = Depends(get_db),
    tenant_in: TenantCreate,
    current_user: Tenant = Depends(get_current_superadmin),
):
    tenant = Tenant(
        name=tenant_in.name,
        domain=tenant_in.domain,
        is_active=tenant_in.is_active,
    )
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return tenant

@router.get("/", response_model=List[Tenant])
def read_tenants(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Tenant = Depends(get_current_superadmin),
):
    tenants = db.query(Tenant).offset(skip).limit(limit).all()
    return tenants

@router.get("/{tenant_id}", response_model=Tenant)
def read_tenant(
    *,
    db: Session = Depends(get_db),
    tenant_id: int,
    current_user: Tenant = Depends(get_current_superadmin),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    return tenant

@router.put("/{tenant_id}", response_model=Tenant)
def update_tenant(
    *,
    db: Session = Depends(get_db),
    tenant_id: int,
    tenant_in: TenantUpdate,
    current_user: Tenant = Depends(get_current_superadmin),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    
    update_data = tenant_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tenant, field, value)
    
    db.add(tenant)
    db.commit()
    db.refresh(tenant)
    return tenant

@router.delete("/{tenant_id}")
def delete_tenant(
    *,
    db: Session = Depends(get_db),
    tenant_id: int,
    current_user: Tenant = Depends(get_current_superadmin),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    db.delete(tenant)
    db.commit()
    return {"ok": True} 