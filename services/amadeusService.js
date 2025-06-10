const axios = require('axios');

const CLIENT_ID = '8CDDoDAnNV8PRUOZw22yodzK6nWEPDs0';
const CLIENT_SECRET = '4UMWG6Zed47fEIDC';

exports.getAccessToken = async () => {
  const response = await axios.post(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data.access_token;
};

exports.getFlightOffers = async (accessToken, origin, destination, departureDate, adults) => {
  const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-HTTP-Method-Override': 'GET'
    },
    params: {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults,
      nonStop: false,
      max: 20,
      currencyCode: 'CAD'
    }
  });
  return response.data;
};

exports.getHotels = async (accessToken, cityCode) => {
  const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      cityCode,
      radius: 50,
      radiusUnit: 'KM',
      hotelSource: 'ALL'
    }
  });

  return response.data.data.map(hotel => ({ name: hotel.name }));
};
