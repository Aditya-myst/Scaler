import React from 'react';
import AppRoutes from './routes.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <ToastProvider>
                        <AppRoutes />
                    </ToastProvider>
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;