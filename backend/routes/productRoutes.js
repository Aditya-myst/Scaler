// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /products
router.get('/', productController.listProducts);

// GET /products/:id
router.get('/:id', productController.getProductDetail);

module.exports = router;