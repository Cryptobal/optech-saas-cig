from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()


@router.get("/", response_model=List[schemas.Tenant])
def read_tenants(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Obtiene todos los tenants.
    """
    tenants = crud.tenant.get_multi(db, skip=skip, limit=limit)
    return tenants


@router.post("/", response_model=schemas.Tenant)
def create_tenant(
    *,
    db: Session = Depends(deps.get_db),
    tenant_in: schemas.TenantCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Crea un nuevo tenant.
    """
    tenant = crud.tenant.create(db, obj_in=tenant_in)
    return tenant


@router.get("/{tenant_id}", response_model=schemas.Tenant)
def read_tenant(
    *,
    db: Session = Depends(deps.get_db),
    tenant_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Obtiene un tenant específico por ID.
    """
    tenant = crud.tenant.get(db, id=tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=404,
            detail="Tenant no encontrado",
        )
    return tenant


@router.put("/{tenant_id}", response_model=schemas.Tenant)
def update_tenant(
    *,
    db: Session = Depends(deps.get_db),
    tenant_id: int,
    tenant_in: schemas.TenantUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Actualiza un tenant.
    """
    tenant = crud.tenant.get(db, id=tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=404,
            detail="Tenant no encontrado",
        )
    tenant = crud.tenant.update(db, db_obj=tenant, obj_in=tenant_in)
    return tenant


@router.delete("/{tenant_id}", response_model=schemas.Tenant)
def delete_tenant(
    *,
    db: Session = Depends(deps.get_db),
    tenant_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Elimina un tenant.
    """
    tenant = crud.tenant.get(db, id=tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=404,
            detail="Tenant no encontrado",
        )
    tenant = crud.tenant.delete(db, id=tenant_id)
    return tenant 