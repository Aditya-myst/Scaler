const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/add', cartController.addItemToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:cartItemId', cartController.removeCartItem);

module.exports = router;