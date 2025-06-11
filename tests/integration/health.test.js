const request = require('supertest');
const app = require('../../app');

describe('GET /health', () => {
  it('should return 200 and status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
