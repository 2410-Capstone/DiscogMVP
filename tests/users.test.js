require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server/API');
const seed = require('../server/db/seed');
const pool = require('../server/db/pool');

let adminToken;
let userToken;
let adminId;
let userId;

beforeAll(async () => {
  await seed();

  const timestamp = Date.now();

  const adminEmail = `admin_${timestamp}@example.com`;
  const userEmail = `user_${timestamp}@example.com`;
  
  const adminRes = await pool.query(`
    INSERT INTO users (email, password, name, address, user_role)
    VALUES ($1, 'hashedpassword', 'Admin Test', 'Admin St', 'admin')
    RETURNING id;
  `, [adminEmail]);
  
  adminId = adminRes.rows[0].id;
  
  const userRes = await pool.query(`
    INSERT INTO users (email, password, name, address, user_role)
    VALUES ($1, 'hashedpassword', 'Customer Test', 'Customer St', 'customer')
    RETURNING id;
  `, [userEmail]);
  
  userId = userRes.rows[0].id;
  
  // Tokens
  adminToken = jwt.sign(
    { id: adminId, user_role: 'admin' },  
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  userToken = jwt.sign(
    { id: userId, user_role: 'customer' },  
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});  



afterAll(async () => {
  await pool.end();
});

// GET /users
describe('GET /users', () => {
  it('should return all users for admin', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('email');
  });

  it('should return 403 for non-admin', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});

// GET /users/:id
describe('GET /users/:id', () => {
  it('should return user data for self', async () => {
    const res = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it('should return user data for admin viewing another user', async () => {
    const res = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it('should return 403 if user tries to access someone else', async () => {
    const res = await request(app)
      .get(`/users/${adminId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});

// PUT /users/:id
describe('PUT /users/:id', () => {
  it('should allow user to update their own profile', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Updated Name', address: '123 Updated St' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Name');
  });

  it('should return 403 if user tries to update another user', async () => {
    const res = await request(app)
      .put(`/users/${adminId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Hacker Name' });

    expect(res.statusCode).toBe(403);
  });
});

// DELETE /users/:id
describe('DELETE /users/:id', () => {
  let userToDeleteId;

  beforeAll(async () => {
    const newUser = await pool.query(`
      INSERT INTO users (email, password, name, address, user_role)
      VALUES ('delete_me@example.com', 'hashed', 'Temp User', '123 St', 'customer')
      RETURNING id;
    `);
    userToDeleteId = newUser.rows[0].id;
  });

  it('should allow admin to delete a user', async () => {
    const res = await request(app)
      .delete(`/users/${userToDeleteId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted');
  });

  it('should return 403 if non-admin tries to delete user', async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});