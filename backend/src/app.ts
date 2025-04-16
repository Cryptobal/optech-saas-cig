import express from 'express';
import cors from 'cors';
import tenantRoutes from './routes/tenant.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.use('/api/tenants', tenantRoutes);

export default app; 