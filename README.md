# Base Tenants - Sistema de Gestión Operativa para Empresas de Seguridad (GARD-SaaS)

Sistema SaaS diseñado específicamente para la gestión operativa de empresas de seguridad, enfocado en optimizar la administración de guardias, instalaciones y turnos.

## Tecnologías Principales

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Python 3.9+

## Estructura del Proyecto

```
.
├── backend/          # Código del backend
├── SPECS.md         # Especificaciones detalladas del sistema
└── .gitignore       # Configuración de archivos ignorados por git
```

## Configuración del Entorno de Desarrollo

1. Clonar el repositorio:
```bash
git clone https://github.com/yourusername/base-tenants.git
cd base-tenants
```

2. Crear y activar entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
cd backend
pip install -r requirements.txt
```

4. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

5. Ejecutar migraciones:
```bash
alembic upgrade head
```

6. Iniciar el servidor de desarrollo:
```bash
uvicorn app.main:app --reload
```

## Documentación

Para más detalles sobre el sistema, consulta [SPECS.md](SPECS.md).

## Licencia

Este proyecto está bajo la Licencia MIT.

## Despliegue

### Frontend (Vercel)

1. Fork o clone este repositorio
2. Conecta tu cuenta de Vercel con GitHub
3. Importa el repositorio en Vercel
4. Configura las variables de entorno:
   - `NEXT_PUBLIC_API_URL`: URL del backend desplegado en Railway

### Backend (Railway)

1. Crear una cuenta en Railway
2. Conectar con GitHub
3. Crear un nuevo proyecto seleccionando este repositorio
4. Agregar un servicio PostgreSQL
5. Configurar las variables de entorno:
   - `DATABASE_URL`: URL de conexión a PostgreSQL (automático en Railway)
   - `JWT_SECRET`: Clave secreta para JWT
   - `CORS_ORIGINS`: URLs permitidas (incluir la URL de Vercel)
   - Otras variables según `.env.example`

### Base de Datos

La base de datos se inicializará automáticamente con las migraciones al desplegar en Railway.
El superadministrador se creará con las credenciales especificadas en las variables de entorno:

- `FIRST_SUPERADMIN_EMAIL`
- `FIRST_SUPERADMIN_PASSWORD`

## Desarrollo Local

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Variables de Entorno

Copia `.env.example` a `.env` en ambos directorios (frontend y backend) y configura las variables necesarias. 