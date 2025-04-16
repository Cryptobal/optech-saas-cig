FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY . .

# Crear y hacer ejecutable el script de inicio
RUN echo '#!/bin/bash\n\
echo "Starting application..."\n\
echo "Current directory: $(pwd)"\n\
echo "Files in current directory: $(ls -la)"\n\
echo "Environment variables:"\n\
env\n\
echo "Starting uvicorn..."\n\
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT --log-level debug' > /app/start.sh && \
chmod +x /app/start.sh

# Exponer el puerto (usando la variable PORT)
ENV PORT=8000
EXPOSE $PORT

# Usar el script de inicio
CMD ["/app/start.sh"] 