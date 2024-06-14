const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Маршрут для регистрации пользователя
router.post('/register', authController.registerUser);
// Маршрут для авторизации пользователя
router.post('/login', authController.loginUser);



module.exports = router;