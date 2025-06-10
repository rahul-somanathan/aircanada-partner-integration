module.exports = {
  log: (correlationId, message, data = {}) => {
    console.log(`[${correlationId}] ${message}`, data);
  }
};
