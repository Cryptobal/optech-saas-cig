#!/bin/bash
set -e

# Esperar a que la base de datos esté lista
/wait-for-it.sh

# Ejecutar migraciones
npx sequelize-cli db:migrate

# Iniciar la aplicación
exec node dist/index.js 