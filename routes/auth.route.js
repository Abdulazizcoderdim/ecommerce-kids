const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/', authController.getUsers);
router.post('/register', authController.register);

module.exports = router;
