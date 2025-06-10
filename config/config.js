require('dotenv').config();

module.exports = {
  flightProviderName: process.env.FLIGHT_PROVIDER || 'amadeus',
  port: process.env.PORT || 3000,
  amadeus: {
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    baseUrl: process.env.AMADEUS_BASE_URL
  },
  httpTimeout: parseInt(process.env.HTTP_TIMEOUT, 10) || 5000,
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  logLevel: process.env.LOG_LEVEL || 'info',
  requestTimeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS, 10) || 10000
};
