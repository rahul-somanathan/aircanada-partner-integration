const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  req.correlationId = uuidv4();
  console.log(`[${req.correlationId}] Incoming request: ${req.method} ${req.url}`);
  next();
};
