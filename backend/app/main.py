import logging

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.v1.api import api_router
from app.core.config import settings
from app import crud, schemas
from app.db.session import engine, get_db
from app.db.base import Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GARD-SaaS API",
    description="API para la aplicación GARD-SaaS",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configurar CORS
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS]
        if isinstance(settings.CORS_ORIGINS, list)
        else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Incluir rutas de API
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
def startup_event():
    # Crear tablas si no existen
    logger.info("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    
    # Crear superadmin si no existe
    db = next(get_db())
    user = crud.user.get_by_email(db, email=settings.FIRST_SUPERADMIN_EMAIL)
    if not user:
        logger.info(f"Creando superadmin: {settings.FIRST_SUPERADMIN_EMAIL}")
        user_in = schemas.UserCreate(
            email=settings.FIRST_SUPERADMIN_EMAIL,
            password=settings.FIRST_SUPERADMIN_PASSWORD,
            full_name="Super Admin",
            is_superuser=True,
        )
        crud.user.create(db, obj_in=user_in)
    db.close()


@app.get("/")
def root():
    return {"message": "Bienvenido a GARD-SaaS API"}


@app.get(f"{settings.API_V1_STR}/health")
async def health_check():
    return {"status": "healthy"} 