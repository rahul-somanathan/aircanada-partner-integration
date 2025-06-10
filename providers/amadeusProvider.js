const httpClient = require('../utils/httpClient');
const config = require('../config/config');

const getAccessToken = async () => {
  try {
    const response = await httpClient.post(
      `${config.amadeus.baseUrl}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.amadeus.clientId,
        client_secret: config.amadeus.clientSecret
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return response.data.access_token;
  } catch (err) {
    console.error('Error fetching Amadeus access token:', err.message);
    throw new Error('Failed to fetch access token from Amadeus');
  }
};

const getFlightOffers = async (accessToken, origin, destination, departureDate, adults) => {
  try {
    const response = await httpClient.get(`${config.amadeus.baseUrl}/v2/shopping/flight-offers`, {
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
  } catch (err) {
    console.error('Error fetching flight offers:', err.message);
    throw new Error('Failed to fetch flight offers from Amadeus');
  }
};

const getHotels = async (accessToken, cityCode) => {
  try {
    const response = await httpClient.get(`${config.amadeus.baseUrl}/v1/reference-data/locations/hotels/by-city`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        cityCode,
        radius: 50,
        radiusUnit: 'KM',
        hotelSource: 'ALL'
      }
    });

    return response.data.data.map(hotel => ({ name: hotel.name }));
  } catch (err) {
    console.error('Error fetching hotels:', err.message);
    throw new Error('Failed to fetch hotels from Amadeus');
  }
};

exports.getFlightRoutesAndHotels = async ({ origin, destination, departureDate, adults }) => {
  const accessToken = await getAccessToken();

  const flightData = await getFlightOffers(accessToken, origin, destination, departureDate, adults);

  const cityCode = flightData.dictionaries.locations[destination]?.cityCode;
  const hotels = cityCode
    ? await getHotels(accessToken, cityCode)
    : [];

  const routes = flightData.data.map(offer => {
    const flights = offer.itineraries[0].segments.map(segment => ({
      airline: segment.carrierCode,
      flightNumber: segment.number,
      scheduledDepartureTime: segment.departure.at,
      scheduledArrivalTime: segment.arrival.at
    }));

    return {
      totalPrice: parseFloat(offer.price.total),
      currency: offer.price.currency,
      flights
    };
  });

  return { routes, hotels };
};

exports.getFlightRoutes = async ({ origin, destination, departureDate, adults }) => {
  try {
    const accessToken = await getAccessToken();

    const flightData = await getFlightOffers(accessToken, origin, destination, departureDate, adults);

    const routes = flightData.data.map(offer => {
      const flights = offer.itineraries[0].segments.map(segment => ({
        airline: segment.carrierCode,
        flightNumber: segment.number,
        scheduledDepartureTime: segment.departure.at,
        scheduledArrivalTime: segment.arrival.at
      }));

      return {
        totalPrice: parseFloat(offer.price.total),
        currency: offer.price.currency,
        flights
      };
    });

    return routes;
  } catch (err) {
    console.error('Error fetching flight routes:', err.message);
    throw new Error('Failed to fetch flight routes from Amadeus');
  }
};

