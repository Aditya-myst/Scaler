import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { formatPrice } from '../utils/helpers.js';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);
        Promise.all([
            getProductById(id),
            getProducts({ limit: 5 }),
        ]).then(([prodRes, simRes]) => {
            setProduct(prodRes.data);
            setSimilar((simRes.data.products || []).filter(p => p.id !== parseInt(id)).slice(0, 4));
        }).catch(() => {
            showToast('Failed to load product', 'error');
        }).finally(() => setLoading(false));
    }, [id]);

    const images = Array.isArray(product?.image_urls) ? product.image_urls : [];

    // ✅ Pass only product.id and qty
    const handleAddToCart = () => {
        addToCart(product.id, qty);
        showToast(`${product.name.substring(0, 30)} added to cart!`);
    };

    // ✅ Pass only product.id and qty
    const handleBuyNow = () => {
        addToCart(product.id, qty);
        navigate('/cart');
    };

    const rating = (3.5 + (parseInt(id) % 15) * 0.1).toFixed(1);

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
            <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-gray-200 h-96 rounded-xl" />
                <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
            <button onClick={() => navigate('/')} className="mt-4 bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold px-6 py-2 rounded-full">
                Go Back Home
            </button>
        </div>
    );

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                    <button onClick={() => navigate('/')} className="hover:text-[#c7511f] hover:underline">Home</button>
                    <span>›</span>
                    <button onClick={() => navigate(`/?category=${product.Category?.name}`)} className="hover:text-[#c7511f] hover:underline">
                        {product.Category?.name || 'Products'}
                    </button>
                    <span>›</span>
                    <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
                </nav>

                <div className="bg-white rounded-xl shadow-md p-6 grid md:grid-cols-2 gap-10 mb-10">
                    {/* Image gallery */}
                    <div>
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 mb-4">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`w-16 h-16 border-2 rounded-lg overflow-hidden flex items-center justify-center transition ${activeImage === i ? 'border-[#FF9900]' : 'border-gray-200 hover:border-gray-400'}`}
                                    >
                                        <img src={img} alt={`thumb-${i}`} className="max-h-full max-w-full object-contain"
                                            onError={e => e.target.src = `https://picsum.photos/seed/${product.id}-${i}/400/400`} />
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Main Image */}
                        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                            <img
                                src={images[activeImage] || `https://picsum.photos/seed/${product.id}/400/400`}
                                alt={product.name}
                                className="max-h-72 max-w-full object-contain hover:scale-105 transition-transform duration-300"
                                onError={e => e.target.src = `https://picsum.photos/seed/${product.id}/400/400`}
                            />
                        </div>

                        {/* Prev/Next */}
                        {images.length > 1 && (
                            <div className="flex justify-center gap-4 mt-4">
                                <button onClick={() => setActiveImage(i => Math.max(0, i - 1))}
                                    disabled={activeImage === 0}
                                    className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-30">◀</button>
                                <span className="text-sm text-gray-500 self-center">{activeImage + 1} / {images.length}</span>
                                <button onClick={() => setActiveImage(i => Math.min(images.length - 1, i + 1))}
                                    disabled={activeImage === images.length - 1}
                                    className="p-2 rounded-full border hover:bg-gray-100 disabled:opacity-30">▶</button>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <p className="text-sm text-blue-600 font-medium mb-1">{product.Category?.name}</p>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[#FF9900] text-lg">{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>
                            <span className="text-sm text-blue-600 hover:underline cursor-pointer">{rating} ({100 + parseInt(id) % 900} ratings)</span>
                        </div>

                        <hr className="mb-4" />

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                                <span className="text-gray-400 line-through text-sm">{formatPrice(parseFloat(product.price) * 1.2)}</span>
                                <span className="text-green-600 font-semibold text-sm">Save 17%</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                        </div>

                        {/* Stock */}
                        <div className={`text-sm font-semibold mb-4 ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock_quantity > 10
                                ? '✓ In Stock'
                                : product.stock_quantity > 0
                                    ? `⚠ Only ${product.stock_quantity} left in stock!`
                                    : '✕ Currently unavailable'}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
                        )}

                        {/* Quantity select */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-sm text-gray-700 font-medium">Qty:</span>
                            <select
                                value={qty}
                                onChange={e => setQty(parseInt(e.target.value))}
                                className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#FF9900]"
                            >
                                {Array.from({ length: Math.min(product.stock_quantity, 10) }, (_, i) => i + 1).map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity === 0}
                                className="w-full py-3 bg-[#FF9900] hover:bg-[#e68a00] active:bg-[#c96d00] text-black font-bold rounded-full transition-all hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock_quantity === 0}
                                className="w-full py-3 bg-[#FFA41C] hover:bg-[#e6920a] active:bg-[#c97d00] text-black font-bold rounded-full transition-all hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                        </div>

                        <hr className="my-6" />

                        {/* Specs */}
                        {product.specifications && (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Specifications</h3>
                                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                                    {typeof product.specifications === 'object' ? (
                                        Object.entries(product.specifications).map(([k, v]) => (
                                            <div key={k} className="flex gap-2 py-1 border-b last:border-0">
                                                <span className="font-medium capitalize w-24">{k}</span>
                                                <span>{String(v)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>{String(product.specifications)}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Similar Products */}
                {similar.length > 0 && (
                    <section className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-5">Customers also viewed</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {similar.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}