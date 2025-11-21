/**
 * Express Application Configuration
 * 
 * Configures and exports the Express app instance.
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

// Import routes (will be created)
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import propertiesRoutes from './routes/properties.routes';
import tenantRoutes from './routes/tenant.routes';
import roomsRoutes from './routes/rooms.routes';
import reviewsRoutes from './routes/reviews.routes';
import pricingRoutes from './routes/pricing.routes';
import configRoutes from './routes/config.routes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api', pricingRoutes); // Includes property-pricing, room-availability, peak-season-rates
app.use('/api', configRoutes); // Includes hosts, languages, currencies, exchange-rates, contact

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
