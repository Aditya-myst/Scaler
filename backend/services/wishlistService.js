const { Wishlist, Product } = require('../models');

async function getWishlist(userId) {
    return await Wishlist.findAll({
        where: { user_id: userId },
        include: [{
            model: Product,
            as: 'Product',
            attributes: ['id', 'name', 'price', 'image_urls', 'stock_quantity']
        }],
        order: [['createdAt', 'DESC']]
    });
}

async function addToWishlist(userId, productId) {
    productId = Number(productId);
    if (isNaN(productId) || productId <= 0) throw new Error('Invalid product ID');

    const existing = await Wishlist.findOne({
        where: { user_id: userId, product_id: productId }
    });

    if (existing) return existing; // already wishlisted, no error

    return await Wishlist.create({ user_id: userId, product_id: productId });
}

async function removeFromWishlist(userId, productId) {
    productId = Number(productId);
    if (isNaN(productId) || productId <= 0) throw new Error('Invalid product ID');

    await Wishlist.destroy({
        where: { user_id: userId, product_id: productId }
    });
}

async function isWishlisted(userId, productId) {
    const item = await Wishlist.findOne({
        where: { user_id: userId, product_id: Number(productId) }
    });
    return !!item;
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist, isWishlisted };