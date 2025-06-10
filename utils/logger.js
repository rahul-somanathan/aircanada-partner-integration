const { createLogger, format, transports } = require('winston');
const config = require('../config/config');

const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [new transports.Console()]
});

module.exports = logger;
