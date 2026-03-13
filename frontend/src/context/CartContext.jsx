import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCartAPI, updateCartItemAPI, removeCartItemAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        if (!user) {
            setCart(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await getCart();
            // Backend returns { success, cart: { cartId, items, totalItems, subtotal } }
            setCart(response.data.cart);
        } catch (error) {
            console.error('Failed to fetch cart', error);
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }

        // Validate productId before sending
        const parsedId = Number(productId);
        if (!parsedId || isNaN(parsedId) || parsedId <= 0) {
            console.error('Invalid productId passed to addToCart:', productId);
            alert('Invalid product. Please try again.');
            return;
        }

        const parsedQuantity = Number(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            alert('Invalid quantity');
            return;
        }

        try {
            await addToCartAPI(parsedId, parsedQuantity);
            await fetchCart();
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        const parsedItemId = Number(cartItemId);
        if (isNaN(parsedItemId) || parsedItemId <= 0) {
            console.error('Invalid cartItemId:', cartItemId);
            return;
        }

        try {
            if (quantity <= 0) {
                await removeCartItemAPI(parsedItemId);
            } else {
                await updateCartItemAPI(parsedItemId, quantity);
            }
            await fetchCart();
        } catch (error) {
            console.error('Failed to update quantity:', error);
            alert(error.response?.data?.message || 'Failed to update quantity');
        }
    };

    const removeFromCart = async (cartItemId) => {
        const parsedItemId = Number(cartItemId);
        if (isNaN(parsedItemId) || parsedItemId <= 0) {
            console.error('Invalid cartItemId:', cartItemId);
            return;
        }

        try {
            await removeCartItemAPI(parsedItemId);
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove item', error);
            alert(error.response?.data?.message || 'Failed to remove item');
        }
    };

    // Check if a product is already in cart and return its cart item info
    const getProductInCart = (productId) => {
        if (!cart?.items) return null;
        return cart.items.find(
            (item) => item.product_id === parseInt(productId)
        ) || null;
    };

    // Get total number of items in cart (for badge display)
    const cartCount = cart?.totalItems || 0;

    // Get subtotal
    const cartSubtotal = cart?.subtotal || 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                cartCount,
                cartSubtotal,
                addToCart,
                updateQuantity,
                removeFromCart,
                getProductInCart,
                refreshCart: fetchCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};  