require('dotenv').config({ path: '.env.test' });

jest.setTimeout(30000); // Set timeout for the tests

const request = require('supertest');
const app = require('../server/API');
const seed = require('../server/db/seed');
const pool = require('../server/db/pool');

beforeAll(async () => {
  await seed(); // seeds the test DB
});

afterAll(async () => {
  await pool.end(); // closes DB connection cleanly
});

describe('GET /products', () => {
  it('should return an array of products', async () => {
    const res = await request(app).get('/products/products');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('artist');
    expect(res.body[0]).toHaveProperty('description');
    expect(res.body[0]).toHaveProperty('price');
    expect(res.body[0]).toHaveProperty('stock');
    expect(res.body[0]).toHaveProperty('image_url');
    expect(res.body[0]).toHaveProperty('genre');
  });
});
