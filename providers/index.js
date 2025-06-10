const amadeusProvider = require('./amadeusProvider');

const getProvider = (providerName) => {
  switch (providerName) {
    case 'amadeus':
      return amadeusProvider;
    default:
      throw new Error(`Unknown flight provider: ${providerName}`);
  }
};

module.exports = getProvider;
