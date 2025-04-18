const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdminMiddleware');

const router = express.Router();

// GET /users - Admin only
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, address, user_role FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /users/:id - Admin or self
router.get('/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const requestorId = req.user.id;
  
  if (req.user.role !== 'admin' && `${requestorId}` !== `${userId}`) {
    return res.sendStatus(403);
  }
   
  
  try {
    const result = await pool.query(
      'SELECT id, email, name, address, user_role FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /users/:id - Self only
router.put('/:id', authenticateToken, [
  body('name').optional().notEmpty().trim().escape(),
  body('address').optional().notEmpty().trim().escape(),
], async (req, res) => {
  const userId = req.params.id;
  const requestorId = req.user.id;

  // Allow only the user to update their own profile
  if (userId !== requestorId) {
    return res.sendStatus(403);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, address } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, address = $2 WHERE id = $3 RETURNING *',
      [name, address, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});


// DELETE /users/:id - Admin only
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id;

  // validate first
  if (!userId || typeof userId !== 'string' || userId.length < 10) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [userId]
    );

    // handle nonexistent user
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


module.exports = router;
