require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./middleware/authRoutes');
const productRoutes = require('./middleware/productRoutes');
const cartRoutes = require('./middleware/cartRoutes');
const orderRoutes = require('./middleware/orderRoutes');
const userRoutes = require('./middleware/userRoutes');
const paymentRoutes = require('./middleware/paymentRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/auth/', authLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/create-payment-intent', userRoutes)

module.exports = app;