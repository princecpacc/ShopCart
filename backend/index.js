require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const customerRoutes = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET in .env');
  process.exit(1);
}

const app = express();

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`ShopKart Clone server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
