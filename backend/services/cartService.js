// services/cartService.js
const { Cart, CartItem, Product, sequelize } = require("../models");

// Create or find cart
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({
    where: { user_id: userId }
  });

  if (!cart) {
    cart = await Cart.create({
      user_id: userId,
      total_price: 0
    });
  }

  return cart;
}

// Add item to cart
async function addItemToCart(userId, productId, quantity = 1) {
  productId = Number(productId);
  if (isNaN(productId) || productId <= 0) {
    throw new Error("Invalid product ID");
  }

  quantity = Number(quantity);
  if (isNaN(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity");
  }

  return await sequelize.transaction(async (t) => {
    const cart = await getOrCreateCart(userId);

    const product = await Product.findByPk(productId, { transaction: t });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock_quantity < quantity) {
      throw new Error(`Only ${product.stock_quantity} items available`);
    }

    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id: productId
      },
      transaction: t
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;

      if (newQuantity > product.stock_quantity) {
        throw new Error("Exceeds available stock");
      }

      cartItem.quantity = newQuantity;
      await cartItem.save({ transaction: t });
    } else {
      cartItem = await CartItem.create(
        {
          cart_id: cart.id,
          product_id: productId,
          quantity,
          price: product.price
        },
        { transaction: t }
      );
    }

    await recalculateCartTotal(cart.id, t);

    return cartItem;
  });
}

// Update cart item quantity
async function updateCartItem(cartItemId, quantity, userId) {
  cartItemId = Number(cartItemId);
  if (isNaN(cartItemId) || cartItemId <= 0) {
    throw new Error("Invalid cart item ID");
  }

  quantity = Number(quantity);
  if (isNaN(quantity)) {
    throw new Error("Invalid quantity");
  }

  const cartItem = await CartItem.findByPk(cartItemId, {
    include: [
      { model: Cart, as: "Cart" },         // ✅ alias matches CartItem.belongsTo alias
      { model: Product, as: "Product" }    // ✅ alias matches CartItem.belongsTo alias
    ]
  });

  if (!cartItem || cartItem.Cart.user_id !== userId) {
    throw new Error("Cart item not found or unauthorized");
  }

  if (quantity <= 0) {
    await cartItem.destroy();
    await recalculateCartTotal(cartItem.cart_id);
    return null;
  }

  if (quantity > cartItem.Product.stock_quantity) {
    throw new Error(`Only ${cartItem.Product.stock_quantity} items available`);
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  await recalculateCartTotal(cartItem.cart_id);
  return cartItem;
}

// Remove item from cart
async function removeCartItem(cartItemId, userId) {
  cartItemId = Number(cartItemId);
  if (isNaN(cartItemId) || cartItemId <= 0) {
    throw new Error("Invalid cart item ID");
  }

  const cartItem = await CartItem.findByPk(cartItemId, {
    include: [
      { model: Cart, as: "Cart" }          // ✅ alias matches CartItem.belongsTo alias
    ]
  });

  if (!cartItem || cartItem.Cart.user_id !== userId) {
    throw new Error("Cart item not found or unauthorized");
  }

  const cartId = cartItem.cart_id;
  await cartItem.destroy();
  await recalculateCartTotal(cartId);
}

// Get cart details
async function getCart(userId) {
  const cart = await getOrCreateCart(userId);

  const items = await CartItem.findAll({
    where: { cart_id: cart.id },
    include: [
      {
        model: Product,
        as: "Product",                     // ✅ alias matches CartItem.belongsTo alias
        attributes: ["id", "name", "price", "image_urls", "stock_quantity"]
      }
    ]
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.Product.price),
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartId: cart.id,
    items,
    totalItems,
    subtotal
  };
}

// Recalculate cart total
async function recalculateCartTotal(cartId, transaction = null) {
  const items = await CartItem.findAll({
    where: { cart_id: cartId },
    transaction
  });

  const total = items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price),
    0
  );

  await Cart.update(
    { total_price: total },
    { where: { id: cartId }, transaction }
  );
}

// Clear cart after checkout
async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);

  await CartItem.destroy({
    where: { cart_id: cart.id }
  });

  await Cart.update(
    { total_price: 0 },
    { where: { id: cart.id } }
  );
}

module.exports = {
  addItemToCart,
  updateCartItem,
  removeCartItem,
  getCart,
  clearCart
};