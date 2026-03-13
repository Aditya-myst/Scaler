// controllers/cartController.js
const cartService = require("../services/cartService");

// Get user's cart
async function getCart(req, res, next) {
  try {
    const userId = req.user.id;

    const cart = await cartService.getCart(userId);

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
}

// Add item to cart
async function addItemToCart(req, res, next) {
  try {
    const userId = req.user.id;
    let { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    productId = Number(productId);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID"
      });
    }

    quantity = Number(quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0"
      });
    }

    const cartItem = await cartService.addItemToCart(userId, productId, quantity);

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      cartItem
    });
  } catch (error) {
    next(error);
  }
}

// Update item quantity
async function updateCartItem(req, res, next) {
  try {
    const userId = req.user.id;
    let { cartItemId, quantity } = req.body;

    if (!cartItemId) {
      return res.status(400).json({
        success: false,
        message: "Cart Item ID is required"
      });
    }

    cartItemId = Number(cartItemId);
    if (isNaN(cartItemId) || cartItemId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Cart Item ID"
      });
    }

    quantity = Number(quantity);
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative"
      });
    }

    // If quantity = 0, remove item
    if (quantity === 0) {
      await cartService.removeCartItem(cartItemId, userId);
      return res.status(200).json({
        success: true,
        message: "Item removed from cart"
      });
    }

    const updatedCartItem = await cartService.updateCartItem(
      cartItemId,
      quantity,
      userId
    );

    res.status(200).json({
      success: true,
      message: "Cart updated",
      updatedCartItem
    });
  } catch (error) {
    next(error);
  }
}

// Remove item from cart
async function removeCartItem(req, res, next) {
  try {
    let { cartItemId } = req.params;
    const userId = req.user.id;

    if (!cartItemId) {
      return res.status(400).json({
        success: false,
        message: "Cart Item ID is required"
      });
    }

    cartItemId = Number(cartItemId);
    if (isNaN(cartItemId) || cartItemId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Cart Item ID"
      });
    }

    await cartService.removeCartItem(cartItemId, userId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem
};