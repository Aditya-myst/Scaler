const { sequelize, Order, OrderItem, Cart, CartItem, Product } = require('../models');
const { sendOrderConfirmationEmail } = require('./emailService');

async function createOrder(userId, shippingAddress) {
    const t = await sequelize.transaction();

    try {
        const cart = await Cart.findOne({
            where: { user_id: userId },
            include: [{
                model: CartItem,
                as: 'CartItems',
                include: [{
                    model: Product,
                    as: 'Product'
                }]
            }]
        });

        if (!cart || cart.CartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        for (const item of cart.CartItems) {
            if (item.Product.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product: ${item.Product.name}`);
            }
        }

        const total_price = cart.CartItems.reduce((acc, item) => {
            return acc + (parseFloat(item.Product.price) * item.quantity);
        }, 0);

        const order = await Order.create({
            user_id: userId,
            total_price,
            shipping_address: shippingAddress,
            status: 'pending'
        }, { transaction: t });

        for (const item of cart.CartItems) {
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.Product.price
            }, { transaction: t });

            item.Product.stock_quantity -= item.quantity;
            await item.Product.save({ transaction: t });
        }

        await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
        await Cart.update({ total_price: 0 }, { where: { id: cart.id }, transaction: t });

        await t.commit();

        // ✅ Now includes Product inside OrderItems for email
        const fullOrder = await Order.findByPk(order.id, {
            include: [{ 
                model: OrderItem, 
                as: 'OrderItems',
                include: [{
                    model: Product,
                    as: 'Product',
                    attributes: ['name', 'price', 'image_urls']
                }]
            }]
        });

        return fullOrder;

    } catch (error) {
        await t.rollback();
        throw error;
    }
}

async function getOrderHistory(userId) {
    return await Order.findAll({
        where: { user_id: userId },
        include: [{
            model: OrderItem,
            as: 'OrderItems',
            include: [{
                model: Product,
                as: 'Product',
                attributes: ['name', 'image_urls']
            }]
        }],
        order: [['createdAt', 'DESC']]
    });
}

module.exports = { createOrder, getOrderHistory };