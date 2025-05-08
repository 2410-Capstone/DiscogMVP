const request = require('supertest');
const app = require('../server/API');
const pool = require('../server/db/pool');
const jwt = require('jsonwebtoken');
const { createUser } = require('../server/db/users');
const { createProduct } = require('../server/db/products');

let token;
let createdItem;
let testUser;
let testProduct;

beforeAll(async () => {
  const timestamp = Date.now();
  testUser = await createUser({
    email: `test${timestamp}@example.com`,
    password: 'testpassword',
    name: 'Test User',
    address: '123 Test Lane',
    user_role: 'customer',
  });
  testProduct = await createProduct({
    artist: 'Test Artist',
    description: 'A product for testing',
    price: 9.99,
    image_url: 'http://example.com/image.jpg',
    genre: 'Test',
    stock: 10,
    artist_details: 'Test details about the artist',
  });

  token = jwt.sign(
    {
      id: testUser.id,
      user_role: testUser.user_role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await pool.end(); // close db connection
});

it('should add a product to the cart', async () => {
  const response = await request(app).post('/api/carts/items').set('Authorization', `Bearer ${token}`).send({
    product_id: testProduct.id,
    quantity: 2,
  });

  console.log('POST /api/carts/items response:', response.body);

  expect(response.statusCode).toBe(201);
  expect(response.body).toHaveProperty('id');
  expect(response.body.quantity).toBe(2);

  createdItem = response.body;
});

it('should fetch all items in the users cart', async () => {
  const response = await request(app).get('/api/carts').set('Authorization', `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBeGreaterThan(0);
  expect(response.body[0]).toHaveProperty('product_id');
});

it('should update the quantity of an item in the cart', async () => {
  const response = await request(app)
    .put(`/api/carts/items/${createdItem.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ quantity: 5 });

  expect(response.statusCode).toBe(200);
});

// DELETE /cart/items/:id
it('should remove an item from the cart', async () => {
  const response = await request(app)
    .delete(`/api/carts/items/${createdItem.id}`)
    .set('Authorization', `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toMatch('Item removed');
});
