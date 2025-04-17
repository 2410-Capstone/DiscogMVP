require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../server/API'); 

describe('POST /create-payment-intent', () => {
  it('should create a Stripe payment intent and return a client secret', async () => {
    const response = await request(app)
      .post('/create-payment-intent')
      .send({ amount: 2000 }); // $20.00 in cents

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('clientSecret');
    expect(typeof response.body.clientSecret).toBe('string');
  });

  it('should return 500 for missing or invalid amount', async () => {
    const response = await request(app)
      .post('/create-payment-intent')
      .send({ amount: 'bad-amount' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

it('should return 404 for unknown route', async () => {
  const res = await request(app).post('/api/payments/invalid');
  expect(res.statusCode).toBe(404);
});
