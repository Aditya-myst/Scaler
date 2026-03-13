const orderService = require('../services/orderService');
// ✅ Import your email utility (adjust the path to where your file is)
const { sendOrderConfirmationEmail } = require('../services/emailService');

async function checkout(req, res, next) {
    try {
        const userId = req.user.id;
        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        const order = await orderService.createOrder(userId, shippingAddress);

        // ✅ Trigger the email sending
        // We use .catch() to ensure that even if the email fails, 
        // the user still gets their "Order Successful" response.
        sendOrderConfirmationEmail(
            req.user.email, 
            req.user.name || 'Valued Customer', 
            order
        ).catch(err => console.error("Order placed, but confirmation email failed:", err));

        res.status(201).json(order);
    } catch (error) {
        if (error.message.includes('Insufficient stock') || error.message === 'Cart is empty') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
}

async function getMyOrders(req, res, next) {
    try {
        const userId = req.user.id;
        const orders = await orderService.getOrderHistory(userId);
        res.json(orders);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    checkout,
    getMyOrders
};