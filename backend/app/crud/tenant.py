import re
from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate


def get(db: Session, id: int) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.id == id).first()


def get_by_slug(db: Session, slug: str) -> Optional[Tenant]:
    return db.query(Tenant).filter(Tenant.slug == slug).first()


def get_multi(db: Session, *, skip: int = 0, limit: int = 100):
    return db.query(Tenant).offset(skip).limit(limit).all()


def create(db: Session, *, obj_in: TenantCreate) -> Tenant:
    # Generate slug from name
    slug = generate_unique_slug(db, obj_in.name)
    
    db_obj = Tenant(
        name=obj_in.name,
        slug=slug,
        description=obj_in.description,
        is_active=obj_in.is_active,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update(db: Session, *, db_obj: Tenant, obj_in: Union[TenantUpdate, Dict[str, Any]]) -> Tenant:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.model_dump(exclude_unset=True)
    
    # If name is updated, regenerate slug
    if update_data.get("name") and update_data["name"] != db_obj.name:
        update_data["slug"] = generate_unique_slug(db, update_data["name"])
        
    for field in update_data:
        setattr(db_obj, field, update_data[field])
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete(db: Session, *, id: int) -> Optional[Tenant]:
    obj = db.query(Tenant).get(id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj


def generate_unique_slug(db: Session, name: str) -> str:
    # Convert to lowercase, replace spaces with hyphens
    slug = re.sub(r'[^\w\s-]', '', name.lower())
    slug = re.sub(r'[\s_-]+', '-', slug)
    slug = re.sub(r'^-+|-+$', '', slug)
    
    # Check if slug exists
    original_slug = slug
    counter = 1
    
    while get_by_slug(db, slug):
        slug = f"{original_slug}-{counter}"
        counter += 1
        
    return slug 