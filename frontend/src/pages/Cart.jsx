import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/helpers.js';

export default function Cart() {
    const { cart, loading, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-gray-500 text-lg animate-pulse">Loading cart...</div>
        </div>
    );

    const cartItems = cart?.items || [];
    const cartTotal = cart?.subtotal || 0;
    const totalItems = cart?.totalItems || 0;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="text-8xl mb-6">🛒</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Amazon Cart is empty</h2>
                <p className="text-gray-500 mb-8">Add items that interest you here. Check your Saved items and Wish Lists.</p>
                <Link
                    to="/"
                    className="bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold px-8 py-3 rounded-full text-base transition hover:shadow-md active:scale-95"
                >
                    Shop Today's Deals
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cart Items */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-6 py-3 bg-gray-50 border-b text-right text-sm text-gray-500 hidden md:block">
                                Price
                            </div>

                            {cartItems.map((item, idx) => {
                                // ✅ item.Product holds product details from backend
                                const product = item.Product;
                                const imageUrl = Array.isArray(product?.image_urls)
                                    ? product.image_urls[0]
                                    : `https://picsum.photos/seed/${product?.id}/400/400`;

                                return (
                                    <div key={item.id} className={`px-6 py-5 flex flex-col sm:flex-row gap-4 ${idx < cartItems.length - 1 ? 'border-b' : ''}`}>
                                        {/* Image */}
                                        <Link to={`/products/${product?.id}`} className="flex-shrink-0">
                                            <img
                                                src={imageUrl}
                                                alt={product?.name}
                                                className="w-28 h-28 object-contain bg-gray-50 rounded-lg border"
                                                onError={e => e.target.src = `https://picsum.photos/seed/${product?.id}/400/400`}
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <Link to={`/products/${product?.id}`}>
                                                <h3 className="font-medium text-gray-900 hover:text-[#c7511f] leading-snug mb-1">
                                                    {product?.name}
                                                </h3>
                                            </Link>
                                            <p className="text-green-600 text-sm font-medium mb-2">In Stock</p>

                                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                                {/* Quantity — ✅ use item.id (cart item id) not product id */}
                                                <div className="flex items-center border rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-4 py-1 text-sm font-semibold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* ✅ use item.id (cart item id) not product id */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-blue-600 hover:text-red-600 hover:underline transition"
                                                >
                                                    Delete
                                                </button>

                                                <button className="text-blue-600 hover:underline">Save for later</button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="sm:text-right flex-shrink-0">
                                            <span className="text-lg font-bold text-gray-900">
                                                {formatPrice(parseFloat(item.price) * item.quantity)}
                                            </span>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="px-6 py-4 bg-gray-50 border-t text-right text-sm">
                                <span className="text-gray-600">Subtotal ({totalItems} items):</span>
                                <span className="ml-2 font-bold text-lg text-gray-900">{formatPrice(cartTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
                            <div className="text-green-600 text-sm font-medium mb-3">
                                ✓ Your order is eligible for FREE Delivery
                            </div>
                            <div className="text-lg mb-1">
                                Subtotal ({totalItems} items):{' '}
                                <span className="font-bold">{formatPrice(cartTotal)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Estimated delivery: 2-5 business days</p>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-3 bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold rounded-full transition hover:shadow-md active:scale-95"
                            >
                                Proceed to Checkout
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full mt-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-full transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}