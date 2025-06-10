const express = require('express');
const app = express();
const config = require('./config/config');
const flightRoutesController = require('./controllers/flightRoutesController');
const correlationIdMiddleware = require('./middlewares/correlationIdMiddleware');
const flightRoutesService = require('./services/flightRoutesService');
const getProvider = require('./providers');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Inject provider dynamically
const flightProvider = getProvider(config.flightProviderName);
flightRoutesService.setFlightProvider(flightProvider);

app.use(express.json());
app.use(correlationIdMiddleware);

// Routes
app.get('/flightRoutes', flightRoutesController.getFlightRoutes);
app.get('/flightRoutesWithHotels', flightRoutesController.getFlightRoutesWithHotels);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error middleware
app.use((err, req, res, next) => {
  console.error(`[${req?.correlationId || 'NO_CORRELATION_ID'}] Unhandled error:`, err);

  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Global process error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally: graceful shutdown
});

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
  console.log(`Using flight provider: ${config.flightProviderName}`);
  console.log(`API Docs available at: http://localhost:${config.port}/api-docs`);
});
