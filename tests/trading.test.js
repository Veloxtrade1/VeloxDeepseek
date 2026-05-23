const request = require('supertest');
const app = require('../server');
describe('Trading', () => {
  test('GET /api/account/me requires auth', async () => {
    const res = await request(app).get('/api/account/me');
    expect(res.statusCode).toBe(401);
  });
});