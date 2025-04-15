require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../server/API');
const seed = require('../server/db/seed');
const pool = require('../server/db/pool');

describe('placeholder test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
