const request = require('supertest');
const app = require('../server/API'); 
const pool = require('../server/db/pool');
const jwt = require('jsonwebtoken');
const { createUser } = require('../server/db/users');

let token;
let createdItem;
let testUser;

beforeAll(async () => {
  const timestamp = Date.now();
  testUser = await createUser({
    email: `test${timestamp}@example.com`,
    password: 'testpassword',
    name: 'Test User',
    address: '123 Test Lane',
    user_role: 'customer',
  });

  token = jwt.sign(
    {
      userId: testUser.id,
      user_role: testUser.user_role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});


afterAll(async () => {
  await pool.end(); // close db connection
});

// POST /cart/items
it('should add a product to the cart', async () => {
  const response = await request(app)
    .post('/cart/items')
    .set('Authorization', `Bearer ${token}`)
    .send({
      product_id: 13,
      quantity: 2
    });

  expect(response.statusCode).toBe(201);
  expect(response.body).toHaveProperty('id');
  expect(response.body.quantity).toBe(2);

  createdItem = response.body;
});

// GET /cart/items
it('should fetch all items in the users cart', async () => {
  const response = await request(app)
    .get('/cart')
    .set('Authorization', `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBeGreaterThan(0);
  expect(response.body[0]).toHaveProperty('product_id');
});

// PUT /cart/items/:id
it('should update the quantity of an item in the cart', async () => {
  const response = await request(app)
    .put(`/cart/items/${createdItem.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ quantity: 5 });

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('id');
  expect(response.body.quantity).toBe(5);
});

// DELETE /cart/items/:id
it('should remove an item from the cart', async () => {
  const response = await request(app)
    .delete(`/cart/items/${createdItem.id}`)
    .set('Authorization', `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toMatch('Item removed');
});
