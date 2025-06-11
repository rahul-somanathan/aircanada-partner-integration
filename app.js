const express = require('express');
const app = express();
const config = require('./config/config');
const flightRoutesController = require('./controllers/flightRoutesController');
const correlationIdMiddleware = require('./middlewares/correlationIdMiddleware');
const flightRoutesService = require('./services/flightRoutesService');
const getProvider = require('./providers');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require('./utils/logger');
const timeout = require('connect-timeout');
const rateLimit = require('express-rate-limit');

// Inject provider dynamically
const flightProvider = getProvider(config.flightProviderName);
flightRoutesService.setFlightProvider(flightProvider);

app.use(express.json());
app.use(correlationIdMiddleware);

// Rate limiter
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests
});
app.use(limiter);

// Request timeout
app.use(timeout(`${config.requestTimeoutMs}ms`));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.get('/flightRoutes', flightRoutesController.getFlightRoutes);
app.get('/flightRoutesWithHotels', flightRoutesController.getFlightRoutesWithHotels);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error handler
app.use((err, req, res, next) => {
  const correlationId = req?.correlationId || 'NO_CORRELATION_ID';
  logger.error(`[${correlationId}] Unhandled error: ${err.stack || err.message}`);

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong. Please try again later.',
      correlationId
    }
  });
});

// Export the app for testing
module.exports = app;
