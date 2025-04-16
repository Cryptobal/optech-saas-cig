import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.session import engine, Base
from app.models.user import User
from app.routers import auth, tenants
from app.core.security import get_password_hash

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(tenants.router, prefix=f"{settings.API_V1_STR}/tenants", tags=["tenants"])

# Endpoints de salud y debug
@app.get("/health")
async def health_check():
    return {"status": "OK"}

@app.get("/cors-debug")
async def cors_debug():
    return {
        "message": "CORS funcionando correctamente",
        "origins": settings.BACKEND_CORS_ORIGINS,
        "environment": "development" if settings.DEBUG else "production"
    }

# Manejadores de errores
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

# Eventos de inicio
@app.on_event("startup")
async def startup_event():
    # Crear tablas
    Base.metadata.create_all(bind=engine)
    
    # Crear superadmin si no existe
    from app.db.session import SessionLocal
    db = SessionLocal()
    try:
        superadmin = db.query(User).filter(User.email == settings.FIRST_SUPERADMIN_EMAIL).first()
        if not superadmin:
            superadmin = User(
                email=settings.FIRST_SUPERADMIN_EMAIL,
                hashed_password=get_password_hash(settings.FIRST_SUPERADMIN_PASSWORD),
                is_superadmin=True,
                is_active=True
            )
            db.add(superadmin)
            db.commit()
            logger.info("Superadmin creado exitosamente")
    finally:
        db.close()
    
    # Log de configuración
    logger.info(f"Entorno: {'development' if settings.DEBUG else 'production'}")
    logger.info(f"Orígenes CORS: {settings.BACKEND_CORS_ORIGINS}") 