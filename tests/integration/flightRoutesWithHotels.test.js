const request = require('supertest');
const app = require('../../app');

describe('GET /flightRoutesWithHotels', () => {
  it('should return 200 and valid structure', async () => {
    const response = await request(app)
      .get('/flightRoutesWithHotels')
      .query({
        origin: 'YUL',
        destination: 'YYZ',
        departureDate: '2025-07-20',
        adults: 1
      });

    expect(response.statusCode).toBe(200);
    expect(response.headers).toHaveProperty('x-correlation-id');
    expect(response.body).toHaveProperty('routes');
    expect(Array.isArray(response.body.routes)).toBe(true);
    expect(response.body).toHaveProperty('hotels');
    expect(Array.isArray(response.body.hotels)).toBe(true);
  });

  it('should return 400 on missing params', async () => {
    const response = await request(app).get('/flightRoutesWithHotels');
    expect(response.statusCode).toBe(400);
  });
});
