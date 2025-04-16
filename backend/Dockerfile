FROM node:20-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar script de espera
COPY scripts/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Copiar archivos de package.json
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Copiar el código de la aplicación
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 8000

# Script de inicio
COPY scripts/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"] 