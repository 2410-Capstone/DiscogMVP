require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../server/API.js');