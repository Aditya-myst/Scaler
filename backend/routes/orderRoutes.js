const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/checkout', orderController.checkout);
router.get('/history', orderController.getMyOrders);

module.exports = router;