require('dotenv').config();

module.exports = {
  flightProviderName: process.env.FLIGHT_PROVIDER || 'amadeus',
  port: process.env.PORT || 3000,
  amadeus: {
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    baseUrl: process.env.AMADEUS_BASE_URL
  },
  httpTimeout: parseInt(process.env.HTTP_TIMEOUT, 10) || 5000
};
