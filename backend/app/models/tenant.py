from sqlalchemy import Column, String, Boolean, TIMESTAMP, UUID, JSON
from sqlalchemy.sql import func
import uuid
from app.db.session import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    nombre = Column(String, nullable=False)
    rut = Column(String(20), unique=True, nullable=False)
    estado = Column(Boolean, default=True)
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    configuracion = Column(JSON)
    plan_subscripcion = Column(String(50))
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now()) 