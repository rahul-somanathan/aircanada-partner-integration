const request = require('supertest');
const app = require('../../app');

describe('Rate limiting', () => {
  it('should return 429 after exceeding limit', async () => {
    jest.setTimeout(15000);

    const requests = [];

    for (let i = 0; i < 101; i++) {
      requests.push(
        request(app).get('/flightRoutes').query({
          origin: 'YUL',
          destination: 'YYZ',
          departureDate: '2025-07-20',
          adults: 1
        })
      );
    }

    const responses = await Promise.allSettled(requests);

    const lastResponse = responses[responses.length - 1].value;
    expect(lastResponse.statusCode).toBe(429);
  });
});
