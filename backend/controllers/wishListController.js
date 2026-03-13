const wishlistService = require('../services/wishlistService');

async function getWishlist(req, res, next) {
    try {
        const items = await wishlistService.getWishlist(req.user.id);
        res.json({ success: true, items });
    } catch (error) {
        next(error);
    }
}

async function addToWishlist(req, res, next) {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ success: false, message: 'Product ID required' });
        const item = await wishlistService.addToWishlist(req.user.id, productId);
        res.status(201).json({ success: true, item });
    } catch (error) {
        next(error);
    }
}

async function removeFromWishlist(req, res, next) {
    try {
        const { productId } = req.params;
        if (!productId) return res.status(400).json({ success: false, message: 'Product ID required' });
        await wishlistService.removeFromWishlist(req.user.id, productId);
        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        next(error);
    }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
