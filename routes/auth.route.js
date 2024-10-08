const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/', authController.getUsers);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/activation/:id', authController.activation);
router.get('/refresh', authController.refresh);


module.exports = router;
