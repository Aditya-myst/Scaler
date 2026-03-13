import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('amazon_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('amazon_token');
            localStorage.removeItem('amazon_user');
        }
        return Promise.reject(error);
    }
);

// Auth
export const loginAPI = (credentials) => API.post('/auth/login', credentials);
export const signupAPI = (userData) => API.post('/auth/signup', userData);
export const getMeAPI = () => API.get('/auth/me');

// Products
export const getProducts = (params = {}) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);

// Categories
export const getCategories = () => API.get('/categories');

// Cart
export const getCart = () => API.get('/cart');
export const addToCartAPI = (productId, quantity = 1) =>
    API.post('/cart/add', { productId, quantity });
export const updateCartItemAPI = (cartItemId, quantity) =>
    API.put('/cart/update', { cartItemId, quantity });
export const removeCartItemAPI = (cartItemId) =>
    API.delete(`/cart/remove/${cartItemId}`);

// Orders
export const checkoutAPI = (shippingAddress) =>
    API.post('/orders/checkout', { shippingAddress });
export const getOrderHistoryAPI = () => API.get('/orders/history');

// Wishlist
export const getWishlistAPI = () => API.get('/wishlist');
export const addToWishlistAPI = (productId) => API.post('/wishlist/add', { productId });
export const removeFromWishlistAPI = (productId) => API.delete(`/wishlist/remove/${productId}`);

export default API;