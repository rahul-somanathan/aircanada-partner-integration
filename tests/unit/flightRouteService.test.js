const flightRoutesService = require('../../services/flightRoutesService');

describe('FlightRoutesService', () => {
  test('throws error if provider not set', async () => {
    flightRoutesService.setFlightProvider(null);

    await expect(
      flightRoutesService.getFlightRoutesOnly({
        origin: 'YYZ',
        destination: 'YVR',
        departureDate: '2025-06-10',
        adults: 1
      })
    ).rejects.toThrow('Flight provider not set');
  });
});
