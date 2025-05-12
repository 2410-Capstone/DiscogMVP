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
      "SELECT id, email, name, address, user_role FROM users WHERE user_role IN ('customer', 'admin') ORDER BY created_at DESC"
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
  if (req.user.user_role !== 'admin' && userId !== requestorId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const result = await pool.query('SELECT id, email, name, address, user_role FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Guest user
router.post('/guest', async (req, res) => {
  const { email, name, address } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (email, name, address, user_role)
       VALUES ($1, $2, $3, 'guest')
       RETURNING id, email, name, address, user_role`,
      [email, name, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating guest user:', err);
    res.status(500).json({ error: 'Failed to create guest user' });
  }
});
// PUT /users/:id - Self only

router.put('/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const requestorId = req.user.id;

  if (req.user.user_role !== 'admin' && userId !== requestorId) {
    return res.sendStatus(403);
  }

  const allowedFields = ['name', 'email', 'address'];
  const fieldsToUpdate = {};
  for (const key of allowedFields) {
    if (req.body[key]) {
      fieldsToUpdate[key] = req.body[key];
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update.' });
  }

  const keys = Object.keys(fieldsToUpdate);
  const setClause = keys.map((field, idx) => `${field} = $${idx + 1}`).join(', ');
  const values = [...Object.values(fieldsToUpdate), userId];

  try {
    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING id, email, name, address, user_role`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// PUT /users/:id (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id;

  const allowedFields = ['name', 'email', 'address', 'user_role'];
  const fieldsToUpdate = {};
  for (const key of allowedFields) {
    if (req.body[key]) {
      fieldsToUpdate[key] = req.body[key];
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update.' });
  }

  const keys = Object.keys(fieldsToUpdate);
  const setClause = keys.map((field, idx) => `"${field}" = $${idx + 1}`).join(', ');
  const values = [...Object.values(fieldsToUpdate), userId];

  try {
    const result = await pool.query(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${
        keys.length + 1
      } RETURNING id, email, name, address, user_role`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Admin error updating user:', err);
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
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

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
