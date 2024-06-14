const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authMiddleware.authenticateToken, productController.addProduct);
router.put('/products/:id', authMiddleware.authenticateToken, productController.updateProduct);
router.delete('/products/:id', authMiddleware.authenticateToken, productController.deleteProduct);


module.exports = router;