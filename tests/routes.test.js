const request = require('supertest');
const app = require('../src/app');

describe('URL Shortener API', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /shorten returns short_code', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ url: 'https://google.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.short_code).toBeDefined();
  });
});