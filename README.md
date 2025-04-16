# Backend SaaS

Backend desarrollado con FastAPI para un sistema SaaS multi-tenant.

## Requisitos

- Python 3.8+
- PostgreSQL (Neon)
- pip

## Instalación

1. Clonar el repositorio
2. Crear un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Copiar el archivo de entorno:
```bash
cp .env.example .env
```

5. Configurar las variables en `.env`

## Ejecución Local

```bash
uvicorn app.main:app --reload
```

La API estará disponible en `http://localhost:8000`

## Despliegue en Railway

El backend está desplegado en Railway: [https://optech-saas-cig-production.up.railway.app/](https://optech-saas-cig-production.up.railway.app/)

### Variables de Entorno en Railway

Configurar las siguientes variables en Railway:

- `DATABASE_URL`: URL de conexión a Neon
- `SECRET_KEY`: Clave secreta para JWT
- `FIRST_SUPERADMIN_EMAIL`: Email del superadmin
- `FIRST_SUPERADMIN_PASSWORD`: Contraseña del superadmin
- `CORS_ORIGINS`: Orígenes permitidos (separados por coma)
- `DEBUG`: False para producción

### Migraciones

Para ejecutar las migraciones en Railway:

```bash
alembic upgrade head
```

## Documentación

- Swagger UI: [https://optech-saas-cig-production.up.railway.app/docs](https://optech-saas-cig-production.up.railway.app/docs)
- ReDoc: [https://optech-saas-cig-production.up.railway.app/redoc](https://optech-saas-cig-production.up.railway.app/redoc)

## Endpoints principales

### Autenticación
- `POST /api/v1/auth/login` - Login de usuario
- `GET /api/v1/auth/me` - Información del usuario actual

### Tenants (requiere superadmin)
- `GET /api/v1/tenants` - Listar tenants
- `POST /api/v1/tenants` - Crear tenant
- `GET /api/v1/tenants/{id}` - Obtener tenant
- `PUT /api/v1/tenants/{id}` - Actualizar tenant
- `DELETE /api/v1/tenants/{id}` - Eliminar tenant

## Variables de entorno

- `DATABASE_URL` - URL de conexión a Neon
- `SECRET_KEY` - Clave secreta para JWT
- `FIRST_SUPERADMIN_EMAIL` - Email del primer superadmin
- `FIRST_SUPERADMIN_PASSWORD` - Contraseña del primer superadmin
- `CORS_ORIGINS` - Orígenes permitidos (separados por coma)
- `DEBUG` - Modo debug (True/False) 