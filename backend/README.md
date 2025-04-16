# GARD-SaaS Backend

Backend para la aplicación GARD-SaaS desarrollado con FastAPI, SQLAlchemy 2, Alembic y Pydantic v2.

## Requisitos

* Python 3.11.x
* PostgreSQL (Neon)

## Instalación

1. Clonar el repositorio
   ```bash
   git clone git@github.com:Cryptobal/gard_saas.git
   cd gard_saas/backend
   ```

2. Crear un entorno virtual
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. Instalar dependencias
   ```bash
   pip install -r requirements.txt
   ```

4. Configurar variables de entorno
   El archivo `.env` ya debe estar configurado con:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_As5bQjz7qpKv@ep-soft-king-a4o2tbut-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
   FIRST_SUPERADMIN_EMAIL=carlos.irigoyen@gmail.com
   FIRST_SUPERADMIN_PASSWORD=Admin123
   SECRET_KEY=VKoLUqp5TrhMyuC7zxpPSs6Bzo5kNxEpzMi62LQAdEo
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   CORS_ORIGINS=*
   ```

## Ejecución

1. Ejecutar el servidor
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. Acceder a la documentación de la API
   - Abrir en el navegador: http://localhost:8000/docs

## Migraciones con Alembic

1. Inicializar Alembic (solo la primera vez)
   ```bash
   cd backend
   alembic init migrations
   ```

2. Generar una migración
   ```bash
   alembic revision --autogenerate -m "descripción de la migración"
   ```

3. Aplicar migraciones
   ```bash
   alembic upgrade head
   ```

## Uso de la API

### Autenticación

1. Login como superadmin
   ```
   POST /api/v1/auth/login
   
   {
     "username": "carlos.irigoyen@gmail.com",
     "password": "Admin123"
   }
   ```

2. Usar el token JWT recibido en las siguientes peticiones en el header:
   ```
   Authorization: Bearer {token}
   ```

### Endpoints Disponibles

#### Autenticación
- `POST /api/v1/auth/login` - Iniciar sesión y obtener token JWT

#### Usuarios (requiere superadmin)
- `GET /api/v1/users/` - Listar todos los usuarios
- `POST /api/v1/users/` - Crear usuario
- `GET /api/v1/users/me` - Ver perfil propio
- `PUT /api/v1/users/me` - Actualizar perfil propio
- `GET /api/v1/users/{user_id}` - Ver usuario específico
- `PUT /api/v1/users/{user_id}` - Actualizar usuario
- `DELETE /api/v1/users/{user_id}` - Eliminar usuario

#### Tenants (requiere superadmin)
- `GET /api/v1/tenants/` - Listar todos los tenants
- `POST /api/v1/tenants/` - Crear tenant
- `GET /api/v1/tenants/{tenant_id}` - Ver tenant específico
- `PUT /api/v1/tenants/{tenant_id}` - Actualizar tenant
- `DELETE /api/v1/tenants/{tenant_id}` - Eliminar tenant 