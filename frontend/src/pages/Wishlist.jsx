import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';

export default function Wishlist() {
    const { wishlist, loading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleMoveToCart = async (item) => {
        await addToCart(item.product_id, 1);
        await removeFromWishlist(item.product_id);
        showToast(`${item.Product?.name?.substring(0, 30)} moved to cart!`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-gray-400 text-lg">Loading wishlist...</div>
        </div>
    );

    if (wishlist.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="text-7xl mb-6">❤️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love to your wishlist and revisit them anytime.</p>
            <button onClick={() => navigate('/')}
                className="bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold px-8 py-3 rounded-full transition">
                Discover Products
            </button>
        </div>
    );

    return (
        <div className="min-h-screen py-8 bg-gray-50">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                        <p className="text-sm text-gray-500 mt-1">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map(item => {
                        const product = item.Product;
                        const img = product?.image_urls?.[0] ||
                            `https://picsum.photos/seed/${item.product_id}/400/400`;
                        const inStock = product?.stock_quantity > 0;

                        return (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-[#FF9900] transition-all group">
                                {/* Image */}
                                <Link to={`/products/${item.product_id}`} className="block relative">
                                    <div className="h-48 flex items-center justify-center bg-gray-50 p-4">
                                        <img src={img} alt={product?.name}
                                            className="max-h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                                            onError={e => e.target.src = `https://picsum.photos/seed/${item.product_id}/400/400`} />
                                    </div>
                                    {/* Remove button */}
                                    <button
                                        onClick={e => { e.preventDefault(); removeFromWishlist(item.product_id); }}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-red-50 hover:text-red-500 transition text-gray-400"
                                        title="Remove from wishlist"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-red-400" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </Link>

                                {/* Info */}
                                <div className="p-4">
                                    <Link to={`/products/${item.product_id}`}>
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#c7511f] mb-2">
                                            {product?.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-lg font-bold text-gray-900">{formatPrice(product?.price)}</span>
                                        <span className="text-xs text-gray-400 line-through">{formatPrice(parseFloat(product?.price) * 1.2)}</span>
                                    </div>
                                    <p className={`text-xs font-medium mb-3 ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                                        {inStock ? '✓ In Stock' : '✕ Out of Stock'}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            disabled={!inStock}
                                            className="flex-1 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-black text-sm font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Move to Cart
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(item.product_id)}
                                            className="px-3 py-2 border border-gray-300 hover:border-red-400 hover:text-red-500 text-gray-600 text-sm rounded-full transition"
                                            title="Remove"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}