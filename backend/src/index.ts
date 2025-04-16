import { sequelize } from './config/database';
import app from './app';

const port = process.env.PORT || 8000;

// Sincronizar la base de datos y luego iniciar el servidor
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('Error al sincronizar la base de datos:', error);
}); 