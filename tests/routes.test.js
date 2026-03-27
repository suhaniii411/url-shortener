const request = require('supertest');

// Mock the database before importing app
jest.mock('../src/db', () => ({
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [] })
  },
  initDB: jest.fn().mockResolvedValue(true)
}));

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