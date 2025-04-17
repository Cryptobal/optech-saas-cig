from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Session, relationship
from sqlalchemy.sql import func

from app.db.session import Base
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nombre = Column(String, nullable=True)
    apellido = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superadmin = Column(Boolean, default=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relación con tenant (si aplica)
    tenant = relationship("Tenant", back_populates="users")

    @classmethod
    def get_by_email(cls, db: Session, email: str):
        return db.query(cls).filter(cls.email == email).first()

    @classmethod
    def create(cls, db: Session, obj_in: UserCreate):
        db_obj = cls(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            nombre=obj_in.nombre,
            apellido=obj_in.apellido,
            is_active=obj_in.is_active,
            is_superadmin=obj_in.is_superadmin,
            tenant_id=obj_in.tenant_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj 