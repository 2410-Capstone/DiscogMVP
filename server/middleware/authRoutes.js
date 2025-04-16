const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').notEmpty().trim().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, address, user_role = 'customer' } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (email, password, name, address, user_role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, user_role',
        [email, hashedPassword, name, address, user_role] // Default role is 'customer'
      );
      
      const user = result.rows[0];
      const token = jwt.sign(
        { id: user.id, user_role: user.user_role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      
      
      res.status(201).json({ 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_role: user.user_role
        },
        token
      });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      console.error(err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

router.post('/login', 
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        // Generic error message to prevent user enumeration
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, user_role: user.user_role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      

      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_role: user.user_role
        },
        token 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, address, user_role FROM users WHERE id = $1',
      [req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.sendStatus(404);
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;
