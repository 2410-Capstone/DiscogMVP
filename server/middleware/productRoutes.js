const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdminMiddleware');

const router = express.Router();

router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE stock > 0');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Protected product routes
router.post('/products', authenticateToken, isAdmin, 
  [
    body('artist').notEmpty().trim().escape(),
    body('description').notEmpty().trim().escape(),
    body('price').isFloat({ min: 0.01 }),
    body('stock').isInt({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { artist, description, price, image_url, genre, stock } = req.body;
    
    try {
      const result = await pool.query(
        'INSERT INTO products (artist, description, price, image_url, genre, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [artist, description, price, image_url, genre, stock]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

router.put('/api/products/:id', authenticateToken, isAdmin, 
  [
    body('artist').notEmpty().trim().escape(),
    body('description').notEmpty().trim().escape(),
    body('price').isFloat({ min: 0.01 }),
    body('stock').isInt({ min: 0 }),
    body('genre').notEmpty().trim().escape(),
    body('image').optional().isURL()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { artist, description, price, image, genre, stock } = req.body;

    try {
      const result = await pool.query(
        `UPDATE products 
         SET artist = $1, description = $2, price = $3, image_url = $4, genre = $5, stock = $6
         WHERE id = $7 RETURNING *`,
        [artist, description, price, image, genre, stock, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
);


router.delete('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted', product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});


module.exports = router;
