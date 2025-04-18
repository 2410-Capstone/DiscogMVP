require('dotenv').config({ path: '.env.test' });

jest.setTimeout(30000); // Set timeout for the tests

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server/API');
const seed = require('../server/db/seed');
const pool = require('../server/db/pool');

let adminToken;
let userToken;

beforeAll(async () => {
  console.log('Seeding test DB...');
  await seed();
  console.log('Seeding complete.');

  // Admin token
  const { rows: adminRows } = await pool.query(
    "SELECT id FROM users WHERE user_role = 'admin' LIMIT 1"
  );
  const adminId = adminRows[0].id;
  adminToken = jwt.sign(
    { id: adminId, user_role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Customer token
  const { rows: userRows } = await pool.query(
    "SELECT id FROM users WHERE user_role = 'customer' LIMIT 1"
  );
  const userId = userRows[0].id;
  userToken = jwt.sign(
    { id: userId, user_role: 'customer' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});




afterAll(async () => {
  console.log('Closing pool...');
  await pool.end();
  console.log('Pool closed.');
});

// GET /products
describe('GET /products', () => {
  it('should return an array of products', async () => {
    const res = await request(app).get('/products');

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

// GET /products/:id
describe('GET /products/:id', () => {
  it('should return a single product by ID', async () => {
    // First, fetch all products to get a valid ID
    const allProductsRes = await request(app).get('/products');
    const productId = allProductsRes.body[0]?.id;

    const res = await request(app).get(`/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', productId);
    expect(res.body).toHaveProperty('artist');
    expect(res.body).toHaveProperty('description');
  });
});

it('should return 404 if product is not found', async () => {
  const fakeId = 999999; // unlikely to exist
  const res = await request(app).get(`/products/${fakeId}`);

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty('error', 'Product not found');
});

// POST /products
describe('POST /products', () => {
  it('should create a new product with valid data and admin token', async () => {
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        artist: 'Test Artist',
        description: 'A test album',
        price: 19.99,
        image: 'https://example.com/test.jpg',
        genre: 'Test Genre',
        stock: 10
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.artist).toBe('Test Artist');
  });
});

// POST /products with invalid data
it('should return 400 for invalid input', async () => {
  const res = await request(app)
    .post('/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      artist: '', // invalid
      price: -5,  // invalid
      stock: -1   // invalid
    });

  expect(res.statusCode).toBe(400);
  expect(res.body.errors).toBeInstanceOf(Array);
});

// Reject non-admin user
it('should return 403 for non-admin user', async () => {
  const res = await request(app)
    .post('/products')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      artist: 'User Attempt',
      description: 'Not allowed',
      price: 10.99,
      image: 'https://example.com/denied.jpg',
      genre: 'Blocked',
      stock: 5
    });

  expect(res.statusCode).toBe(403);
});

// PUT /products/:id
describe('PUT /products/:id', () => {
  let productIdToUpdate;

  beforeAll(async () => {
    // Create a product to update
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        artist: 'Original Artist',
        description: 'Original Description',
        price: 20.0,
        image: 'https://example.com/original.jpg',
        genre: 'Original Genre',
        stock: 5
      });

    productIdToUpdate = res.body.id;
  });

  it('should update a product with valid data and admin token', async () => {
    const res = await request(app)
      .put(`/products/${productIdToUpdate}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        artist: 'Updated Artist',
        description: 'Updated Description',
        price: 25.0,
        image: 'https://example.com/updated.jpg',
        genre: 'Updated Genre',
        stock: 10
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.artist).toBe('Updated Artist');
    expect(parseFloat(res.body.price)).toBeCloseTo(25.0, 2);
  });

  it('should return 404 if product does not exist', async () => {
    const res = await request(app)
      .put('/products/999999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        artist: 'Nonexistent',
        description: 'N/A',
        price: 15.0,
        image: 'https://example.com/nothing.jpg',
        genre: 'None',
        stock: 0
      });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid input', async () => {
    const res = await request(app)
      .put(`/products/${productIdToUpdate}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        artist: '',
        description: '',
        price: -10,
        stock: -5
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeInstanceOf(Array);
  });

  it('should return 403 for non-admin user', async () => {
    const res = await request(app)
      .put(`/products/${productIdToUpdate}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        artist: 'Blocked Update',
        description: 'Should fail',
        price: 30.0,
        image: 'https://example.com/fail.jpg',
        genre: 'Blocked',
        stock: 1
      });

    expect(res.statusCode).toBe(403);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .put(`/products/${productIdToUpdate}`)
      .send({
        artist: 'No Token Update',
        description: 'Should fail',
        price: 30.0,
        image: 'https://example.com/fail.jpg',
        genre: 'Blocked',
        stock: 1
      });

    expect(res.statusCode).toBe(401);
  });
});


// DELETE /products/:id
describe('DELETE /products/:id', () => {
  let productIdToDelete;

  beforeAll(async () => {
    // Create a product to delete
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        artist: 'To Delete',
        description: 'Temp Product',
        price: 10.0,
        image: 'https://example.com/temp.jpg',
        genre: 'Test',
        stock: 1
      });

    productIdToDelete = res.body.id;
  });

  it('should delete a product with valid admin token', async () => {
    const res = await request(app)
      .delete(`/products/${productIdToDelete}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted');
    expect(res.body.product).toHaveProperty('id', productIdToDelete);
  });

  it('should return 404 if product does not exist', async () => {
    const fakeId = 999999;
    const res = await request(app)
      .delete(`/products/${fakeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Product not found');
  });

  it('should return 403 for non-admin user', async () => {
    const res = await request(app)
      .delete(`/products/${productIdToDelete}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .delete(`/products/${productIdToDelete}`); // no auth header

    expect(res.statusCode).toBe(401);
  });
});

