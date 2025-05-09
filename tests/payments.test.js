require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../server/API');
const pool = require('../server/db/pool');

describe('POST /api/payment', () => {
  let userId;
  let productId;

  beforeAll(async () => {
    const timestamp = Date.now(); // ensures uniqueness
    const email = `paytest_${timestamp}@example.com`;

    const userRes = await pool.query(
      `
      INSERT INTO users (email, password, name, address, user_role)
      VALUES ($1, 'hashed', 'Pay Test', '123 Pay St', 'customer')
      RETURNING id;
    `,
      [email]
    );
    userId = userRes.rows[0].id;

    const productRes = await pool.query(`
      INSERT INTO products (artist, description, price, image_url, genre, stock)
      VALUES ('Test Artist', 'Test Desc', 10.99, 'test.jpg', 'Pop', 50)
      RETURNING id;
    `);
    productId = productRes.rows[0].id;
  });

  afterAll(async () => {
    await pool.end(); // close DB connection
  });

  it('should create a Stripe payment intent and return a client secret', async () => {
    const mockData = {
      userId,
      cartItems: [
        { product_id: productId, price: 10.99, quantity: 2 },
        { product_id: productId, price: 5.0, quantity: 1 },
      ],
      shippingAddress: '123 Test St',
    };

    const response = await request(app).post('/api/payment').send(mockData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('clientSecret');
    expect(typeof response.body.clientSecret).toBe('string');
    expect(response.body).toHaveProperty('orderId');
    expect(typeof response.body.orderId).toBe('string');
  });

  it('should return 500 for missing or invalid input', async () => {
    const response = await request(app).post('/api/payment').send({}); // empty object triggers error

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});
