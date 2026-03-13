import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { getProducts } from '../services/api.js';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Toys & Games'];

const HERO_BANNERS = [
    {
        bg: 'from-[#232F3E] to-[#131921]',
        title: 'Great Indian Festival',
        sub: 'Deals up to 80% off on Electronics',
        cta: 'Shop Now',
        img: 'https://picsum.photos/seed/electronics/800/500'
    },
    {
        bg: 'from-[#004B91] to-[#00264D]',
        title: 'New Arrivals',
        sub: 'Discover the latest products',
        cta: 'Explore',
        img: 'https://picsum.photos/seed/newarrivals/800/500'
    },
    {
        bg: 'from-[#c7511f] to-[#8a3710]',
        title: 'Best Sellers',
        sub: 'Top picks for you this season',
        cta: 'View All',
        img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop'
    },
];

const QUICK_CATEGORIES = [
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&h=400&auto=format&fit=crop' },
    { name: 'Home & Kitchen', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400&h=400&auto=format&fit=crop' },
    { name: 'Clothing', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&h=400&auto=format&fit=crop' },
    { name: 'Toys & Games', img: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=400&h=400&auto=format&fit=crop' },
];

function sortProducts(products, sortBy) {
    const sorted = [...products];
    switch (sortBy) {
        case 'price_asc':
            return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        case 'price_desc':
            return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        case 'top_rated':
            return sorted.sort((a, b) => (b.id % 15) - (a.id % 15));
        default:
            return sorted;
    }
}

export default function Home() {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [heroIndex, setHeroIndex] = useState(0);
    const [sortBy, setSortBy] = useState('featured');
    const LIMIT = 12;

    const location = useLocation();
    const navigate = useNavigate();
    const searchQuery = new URLSearchParams(location.search).get('search') || '';
    const categoryQuery = new URLSearchParams(location.search).get('category') || '';

    useEffect(() => {
        if (categoryQuery) setSelectedCategory(categoryQuery);
    }, [categoryQuery]);

    useEffect(() => {
        const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_BANNERS.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { limit: LIMIT, offset: (page - 1) * LIMIT };
            if (searchQuery) params.search = searchQuery;
            const res = await getProducts(params);
            let allProducts = res.data.products || [];

            if (selectedCategory !== 'All') {
                allProducts = allProducts.filter(p => p.Category?.name === selectedCategory);
            }
            setProducts(allProducts);
            setTotal(res.data.total || 0);
        } catch (err) {
            setError('Failed to load products. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, selectedCategory]);

    useEffect(() => { setPage(1); }, [searchQuery, selectedCategory]);
    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const sortedProducts = sortProducts(products, sortBy);
    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="min-h-screen bg-[#eaeded]">
            {/* Hero Banner - Fix: Added explicit height and z-index context */}
            {!searchQuery && (
                <div className={`relative overflow-hidden bg-gradient-to-r ${HERO_BANNERS[heroIndex].bg} text-white transition-all duration-700 min-h-[500px] lg:min-h-[650px] z-0`}>
                    <img
                        src={HERO_BANNERS[heroIndex].img}
                        alt={HERO_BANNERS[heroIndex].title}
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                    {/* Content - Fix: Added bottom padding to ensure button isn't covered */}
                    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-48 flex items-center">
                        <div className="max-w-xl">
                            <span className="inline-block px-3 py-1 bg-[#FF9900] text-black text-xs font-bold rounded-full uppercase tracking-tighter mb-4">
                                Exclusive Offer
                            </span>

                            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
                                {HERO_BANNERS[heroIndex].title}
                            </h1>

                            <p className="text-gray-200 text-xl font-medium mb-8 max-w-lg">
                                {HERO_BANNERS[heroIndex].sub}
                            </p>

                            <button className="bg-[#FF9900] hover:bg-[#e68a00] text-black font-extrabold px-10 py-4 rounded-full text-lg transition hover:scale-105 active:scale-95 shadow-xl">
                                {HERO_BANNERS[heroIndex].cta} →
                            </button>
                        </div>
                    </div>

                    {/* Slider dots - Fix: Raised position to stay above cards */}
                    <div className="absolute bottom-40 left-0 right-0 z-10 flex justify-center gap-3">
                        {HERO_BANNERS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setHeroIndex(i)}
                                className={`h-3 rounded-full transition-all duration-500 ${
                                    i === heroIndex ? "bg-[#FF9900] w-12" : "bg-white/30 w-3 hover:bg-white/50"
                                }`}
                            />
                        ))}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/80 to-transparent"></div>
                </div>
            )}

            {/* Main Content - Fix: Managed z-index and spacing to prevent navbar/hero overlap issues */}
            <div className={`max-w-7xl mx-auto px-4 py-8 relative z-20 ${!searchQuery ? '-mt-32 lg:-mt-44' : 'mt-8'}`}>
                
                {/* Category Grid */}
                {!searchQuery && selectedCategory === 'All' && page === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {QUICK_CATEGORIES.map((cat) => (
                            <div key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className="bg-white p-6 shadow-xl rounded-xl flex flex-col group cursor-pointer hover:shadow-2xl transition-all duration-300 border border-white">
                                <h3 className="text-xl font-bold mb-4 group-hover:text-[#c7511f] transition">{cat.name}</h3>
                                <div className="flex-1 overflow-hidden rounded-lg mb-4 bg-gray-50">
                                    <img src={cat.img} alt={cat.name} className="w-full h-48 object-cover group-hover:scale-110 transition duration-700" />
                                </div>
                                <span className="text-sm font-semibold text-[#007185] group-hover:text-[#c7511f] transition">See more</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Fix: Ensured sticky top account for common navbar height (approx 80px) */}
                    <aside className="lg:w-64 flex-shrink-0 z-10">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm p-6 sticky top-24 border border-white">
                            <h2 className="font-extrabold text-[#111] mb-5 border-b border-gray-100 pb-3 text-lg flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                                Categories
                            </h2>
                            <ul className="space-y-2">
                                {CATEGORIES.map(cat => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => { setSelectedCategory(cat); setPage(1); }}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${selectedCategory === cat
                                                ? 'bg-[#131921] text-white font-bold shadow-md'
                                                : 'text-gray-600 hover:bg-orange-50 hover:text-[#c7511f]'}`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <h2 className="font-extrabold text-[#111] mt-8 mb-4 border-b border-gray-100 pb-3 text-lg">Reviews</h2>
                            <div className="space-y-3 text-sm">
                                {[4, 3, 2, 1].map(stars => (
                                    <div key={stars} className="flex items-center gap-2 cursor-pointer group text-gray-500 hover:text-[#c7511f] transition">
                                        <span className="text-[#FF9900] text-lg">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                                        <span className="font-medium group-hover:font-bold">& Up</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm px-6 py-4 border border-white">
                            <div>
                                {searchQuery && (
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        Results for <span className="text-[#c7511f]">"{searchQuery}"</span>
                                        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-red-500 scale-75 transition">✕</button>
                                    </h2>
                                )}
                                <p className="text-sm text-gray-500 font-medium mt-0.5">
                                    {loading ? 'Loading...' : `${total} products found`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-orange-200 shadow-sm outline-none cursor-pointer"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="top_rated">Top Rated</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-2xl mb-8 flex items-center gap-3">
                                <div className="text-2xl">⚠️</div>
                                <div>
                                    <p className="font-bold">Error</p>
                                    <p className="text-sm opacity-80">{error}</p>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse h-[26rem] border border-gray-100">
                                        <div className="h-56 bg-gray-100 rounded-t-2xl m-2" />
                                        <div className="p-5 space-y-4">
                                            <div className="h-4 bg-gray-100 rounded w-3/4" />
                                            <div className="h-4 bg-gray-100 rounded w-1/2" />
                                            <div className="h-10 bg-gray-100 rounded-full mt-8" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : sortedProducts.length === 0 ? (
                            <div className="bg-white rounded-3xl shadow-sm p-24 text-center border border-white flex flex-col items-center">
                                <div className="text-8xl mb-6 opacity-20">🔎</div>
                                <h3 className="text-3xl font-black text-gray-900 mb-3">No matches found</h3>
                                <button onClick={() => { setSelectedCategory('All'); navigate('/'); }}
                                    className="bg-[#131921] hover:bg-black text-white font-bold px-10 py-4 rounded-full transition-all">
                                    Browse All
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {sortedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-16 pb-10">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-6 py-3 rounded-full border border-gray-200 bg-white text-sm font-bold hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    ← Prev
                                </button>
                                <div className="hidden sm:flex gap-2">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                        <button key={p} onClick={() => setPage(p)}
                                            className={`w-12 h-12 rounded-full font-black text-sm transition-all duration-300 ${page === p
                                                ? 'bg-[#FF9900] text-black shadow-lg'
                                                : 'bg-white text-gray-400 hover:text-[#c7511f] border border-gray-100'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-6 py-3 rounded-full border border-gray-200 bg-white text-sm font-bold hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}