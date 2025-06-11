const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');

// Global process error handling
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.stack || err.message}`);
});

// Start server
app.listen(config.port, () => {
  logger.info(`Server running at http://localhost:${config.port}`);
  logger.info(`Using flight provider: ${config.flightProviderName}`);
  logger.info(`API Docs available at: http://localhost:${config.port}/api-docs`);
});
