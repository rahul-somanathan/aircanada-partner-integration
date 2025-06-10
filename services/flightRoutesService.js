let flightProvider;

exports.setFlightProvider = (provider) => {
  flightProvider = provider;
};

exports.getFlightRoutesOnly = async ({ origin, destination, departureDate, adults }) => {
  if (!flightProvider) {
    throw new Error('Flight provider not set');
  }

  const routes = await flightProvider.getFlightRoutes({
    origin,
    destination,
    departureDate,
    adults
  });

  return routes;
};

exports.getFlightRoutesWithHotels = async ({ origin, destination, departureDate, adults }) => {
  if (!flightProvider) {
    throw new Error('Flight provider not set');
  }

  const { routes, hotels } = await flightProvider.getFlightRoutesAndHotels({
    origin,
    destination,
    departureDate,
    adults
  });

  return { routes, hotels };
};
