import express from 'express';
import cors from 'cors';
import tenantRoutes from './routes/tenant.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Healthcheck endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.use('/api/v1/tenants', tenantRoutes);

export default app; 