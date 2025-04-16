#!/bin/bash

# Detener el servidor si está corriendo
echo "Deteniendo servidor si está corriendo..."
pkill -f "uvicorn app.main:app"

# Activar entorno virtual
echo "Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "Instalando dependencias..."
pip install -r requirements.txt

# Configurar base de datos
echo "Configurando base de datos..."
alembic upgrade head

# Iniciar servidor en modo producción
echo "Iniciando servidor en modo producción..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4 --ssl-keyfile /etc/ssl/private/gard.key --ssl-certfile /etc/ssl/certs/gard.crt > app.log 2>&1 &

echo "Servidor iniciado en modo producción" 