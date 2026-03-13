import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatPrice, truncate } from '../utils/helpers.js';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
    const [adding, setAdding] = useState(false);

    const wished = isWishlisted(product.id); // ✅ real state from context

    const imageUrl = Array.isArray(product.image_urls)
        ? product.image_urls[0]
        : product.image_urls?.[0] ?? `https://picsum.photos/seed/${product.id}/400/400`;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);
        addToCart(product.id, 1);
        showToast(`${truncate(product.name, 30)} added to cart!`);
        setTimeout(() => setAdding(false), 2000);
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (wished) {
            await removeFromWishlist(product.id);
            showToast(`Removed from wishlist`);
        } else {
            await addToWishlist(product.id);
            showToast(`Added to wishlist ❤️`);
        }
    };

    const rating = (3.5 + (product.id % 15) * 0.1).toFixed(1);
    const reviews = 100 + (product.id % 900);

    return (
        <Link to={`/products/${product.id}`} className="group bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-transparent hover:border-[#FF9900]">
            <div className="relative overflow-hidden bg-gray-50 h-56 flex items-center justify-center p-4">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-h-48 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = `https://picsum.photos/seed/${product.id}/400/400`; }}
                />
                {/* ✅ Real wishlist button */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow hover:scale-110 transition z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-colors ${wished ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-none'}`}
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                        Only {product.stock_quantity} left!
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-gray-500 mb-1">{product.Category?.name || 'General'}</p>
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-[#c7511f] transition">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                    <span className="text-[#FF9900] text-sm">{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>
                    <span className="text-xs text-blue-600 hover:text-orange-500 cursor-pointer">({reviews})</span>
                </div>

                <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                        <span className="text-xs text-gray-500 line-through">{formatPrice(parseFloat(product.price) * 1.2)}</span>
                        <span className="text-xs text-green-600 font-semibold">17% off</span>
                    </div>
                    <p className="text-xs text-green-600 mb-3">
                        {product.stock_quantity > 0 ? '✓ In Stock' : '✕ Out of Stock'}
                    </p>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock_quantity === 0 || adding}
                        className={`w-full py-2 rounded-full text-sm font-semibold transition-all duration-200 ${adding ? 'bg-green-500 text-white scale-95' :
                            product.stock_quantity === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' :
                                'bg-[#FF9900] hover:bg-[#e68a00] text-black hover:shadow-md active:scale-95'
                            }`}
                    >
                        {adding ? '✓ Added!' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </Link>
    );
}