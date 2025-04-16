from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import Session

from app.db.session import Base
from app.schemas.user import UserCreate
from app.services.auth import get_password_hash

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superadmin = Column(Boolean, default=False)

    @classmethod
    def get_by_email(cls, db: Session, email: str):
        return db.query(cls).filter(cls.email == email).first()

    @classmethod
    def create(cls, db: Session, obj_in: UserCreate):
        db_obj = cls(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            is_active=obj_in.is_active,
            is_superadmin=obj_in.is_superadmin
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj 