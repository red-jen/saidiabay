import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import cityRoutes from './routes/city.routes';
import reservationRoutes from './routes/reservation.routes';
import leadRoutes from './routes/lead.routes';
import blockedDateRoutes from './routes/blockedDate.routes';
import blogRoutes from './routes/blog.routes';
import heroRoutes from './routes/hero.routes';
import statsRoutes from './routes/stats.routes';
import { errorHandler } from './middlewares/error.middleware';
import heroClickRoutes from './routes/heroClick.routes';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Plateforme Immobilière API'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/blocked-dates', blockedDateRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/heroes', heroRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/hero-clicks', heroClickRoutes);


// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Immobilière running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;