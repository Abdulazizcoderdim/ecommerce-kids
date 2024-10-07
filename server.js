require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// middleware
app.use(express.json());

// routes
app.use('/api/products', require('./routes/product.route'));

const PORT = process.env.PORT || 8080;

const foo = async () => {
  try {
    await mongoose.connect(process.env.DB_URL).then(() => {
      console.log('Database connected...');
    });
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('Server running failed', error);
  }
};

foo();
