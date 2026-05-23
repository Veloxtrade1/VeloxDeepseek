const request = require('supertest');
const app = require('../server');
describe('Auth', () => {
  test('POST /api/auth/register', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'test@test.com', password: '123', fullName: 'Test', country: 'Pakistan' });
    expect(res.statusCode).toBe(200);
  });
});