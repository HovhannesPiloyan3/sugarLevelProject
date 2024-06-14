const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/addSugarLevel', authMiddleware.authenticateToken, userController.addSugarLevel);
router.get('/dailySugarLevels', authMiddleware.authenticateToken, userController.getDailySugarLevels);
router.get('/sugarLevelsDates', authMiddleware.authenticateToken, userController.getDates);
router.put('/updateProfile', authMiddleware.authenticateToken, userController.updateUserProfile);
// Маршрут для получения профиля пользователя
router.get('/profile', authMiddleware.authenticateToken, userController.getUserProfile);
module.exports = router;
