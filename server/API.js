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
const discogsRoutes = require('./middleware/discogsRoutes');

const app = express();


app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/auth/', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/discogs', discogsRoutes);

// Test route to see if the backend is working. needed it for testing but leaving it for now
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is working!" });
});
module.exports = app;