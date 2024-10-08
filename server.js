require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');


// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static('static'));
app.use(fileUpload({}));

// routes
app.use('/api/products', require('./routes/product.route'));
app.use('/api/users', require('./routes/auth.route'));

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

module.exports = app;
