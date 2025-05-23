require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./middleware/authRoutes');
const productRoutes = require('./middleware/productRoutes');
const cartRoutes = require('./middleware/cartRoutes');
const orderRoutes = require('./middleware/orderRoutes');
const userRoutes = require('./middleware/userRoutes');
const paymentRoutes = require('./middleware/paymentRoutes');
const discogsRoutes = require('./middleware/discogsRoutes');
const adminRoutes = require('./middleware/adminRoutes');
const wishlistRoutes = require('./middleware/wishlistRoutes');

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'http://localhost:3000'],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/auth/', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/discogs', discogsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlists', wishlistRoutes);

//images will be served from here
app.use('/public/images', express.static(path.join(__dirname, '..', 'public/images')));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
