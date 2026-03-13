import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlistAPI, addToWishlistAPI, removeFromWishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = async () => {
        if (!user) { setWishlist([]); return; }
        setLoading(true);
        try {
            const res = await getWishlistAPI();
            setWishlist(res.data.items || []);
        } catch {
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWishlist(); }, [user]);

    const addToWishlist = async (productId) => {
        if (!user) return;
        try {
            await addToWishlistAPI(productId);
            await fetchWishlist();
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await removeFromWishlistAPI(productId);
            await fetchWishlist();
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    const isWishlisted = (productId) => {
        return wishlist.some(item => item.product_id === Number(productId));
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            addToWishlist,
            removeFromWishlist,
            isWishlisted,
            refreshWishlist: fetchWishlist,
            wishlistCount: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
};