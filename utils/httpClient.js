const axios = require('axios');
const config = require('../config/config');

const httpClient = axios.create({
  timeout: config.httpTimeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

module.exports = httpClient;
