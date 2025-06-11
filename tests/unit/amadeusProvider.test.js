const amadeusProvider = require('../../providers/amadeusProvider');
const httpClient = require('../../utils/httpClient');

jest.mock('../../utils/httpClient', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('AmadeusProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFlightRoutes', () => {
    it('should map API response to routes structure', async () => {
      // Mock access token
      httpClient.post.mockResolvedValue({
        data: { access_token: 'mock_token' },
      });

      // Mock flight offers
      httpClient.get.mockResolvedValue({
        data: {
          data: [
            {
              price: { total: '123.00', currency: 'CAD' },
              itineraries: [
                {
                  segments: [
                    {
                      carrierCode: 'AC',
                      number: '123',
                      departure: { at: '2025-07-20T09:00' },
                      arrival: { at: '2025-07-20T10:00' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      });

      const routes = await amadeusProvider.getFlightRoutes({
        origin: 'YUL',
        destination: 'YYZ',
        departureDate: '2025-07-20',
        adults: 1,
      });

      expect(routes).toHaveLength(1);
      expect(routes[0]).toMatchObject({
        totalPrice: 123,
        currency: 'CAD',
        flights: [
          {
            airline: 'AC',
            flightNumber: '123',
            scheduledDepartureTime: '2025-07-20T09:00',
            scheduledArrivalTime: '2025-07-20T10:00',
          },
        ],
      });
    });

    it('should throw error on API failure', async () => {
      httpClient.post.mockResolvedValue({
        data: { access_token: 'mock_token' },
      });

      httpClient.get.mockRejectedValue(new Error('API Error'));

      await expect(
        amadeusProvider.getFlightRoutes({
          origin: 'YUL',
          destination: 'YYZ',
          departureDate: '2025-07-20',
          adults: 1,
        })
      ).rejects.toThrow('Failed to fetch flight offers from Amadeus');
    });
  });

  describe('getFlightRoutesAndHotels', () => {
    it('should map API response to routes and hotels structure', async () => {
      // Mock access token
      httpClient.post.mockResolvedValue({
        data: { access_token: 'mock_token' },
      });

      // Mock flight offers
      httpClient.get
        .mockResolvedValueOnce({
          data: {
            data: [
              {
                price: { total: '123.00', currency: 'CAD' },
                itineraries: [
                  {
                    segments: [
                      {
                        carrierCode: 'AC',
                        number: '123',
                        departure: { at: '2025-07-20T09:00' },
                        arrival: { at: '2025-07-20T10:00' },
                      },
                    ],
                  },
                ],
              },
            ],
            dictionaries: {
              locations: {
                YYZ: {
                  cityCode: 'YMQ',
                },
              },
            },
          },
        })
        // Mock hotels
        .mockResolvedValueOnce({
          data: {
            data: [
              { name: 'Hotel 123' },
              { name: 'Hotel 456' },
            ],
          },
        });

      const result = await amadeusProvider.getFlightRoutesAndHotels({
        origin: 'YUL',
        destination: 'YYZ',
        departureDate: '2025-07-20',
        adults: 1,
      });

      expect(result.routes).toHaveLength(1);
      expect(result.routes[0]).toMatchObject({
        totalPrice: 123,
        currency: 'CAD',
        flights: [
          {
            airline: 'AC',
            flightNumber: '123',
            scheduledDepartureTime: '2025-07-20T09:00',
            scheduledArrivalTime: '2025-07-20T10:00',
          },
        ],
      });

      expect(result.hotels).toEqual([
        { name: 'Hotel 123' },
        { name: 'Hotel 456' },
      ]);
    });

    it('should throw error on flight offers API failure', async () => {
      httpClient.post.mockResolvedValue({
        data: { access_token: 'mock_token' },
      });

      httpClient.get.mockRejectedValue(new Error('API Error'));

      await expect(
        amadeusProvider.getFlightRoutesAndHotels({
          origin: 'YUL',
          destination: 'YYZ',
          departureDate: '2025-07-20',
          adults: 1,
        })
      ).rejects.toThrow('Failed to fetch flight offers from Amadeus');
    });
  });
});
