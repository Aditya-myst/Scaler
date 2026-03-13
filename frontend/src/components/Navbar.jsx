import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { getProducts } from '../services/api.js';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Toys & Games'];

export default function Navbar() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowSuggestions(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (search.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            setLoadingSuggestions(true);
            try {
                const params = { search: search.trim(), limit: 6 };
                if (category !== 'All') params.category = category;
                const res = await getProducts(params);
                setSuggestions(res.data.products || []);
                setShowSuggestions(true);
                setActiveIndex(-1);
            } catch {
                setSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [search, category]);

    const handleSearch = (e) => {
        e?.preventDefault();
        if (!search.trim()) return;
        setShowSuggestions(false);
        setMobileSearchOpen(false);
        const params = new URLSearchParams({ search: search.trim() });
        if (category !== 'All') params.set('category', category);
        navigate(`/?${params.toString()}`);
    };

    const handleSuggestionClick = (product) => {
        setShowSuggestions(false);
        setSearch('');
        setMobileSearchOpen(false);
        navigate(`/products/${product.id}`);
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, suggestions.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
        else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); handleSuggestionClick(suggestions[activeIndex]); }
        else if (e.key === 'Escape') { setShowSuggestions(false); setActiveIndex(-1); }
    };

    const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

    const SearchBar = ({ className = '' }) => (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <div className="flex w-full h-10 rounded-md overflow-hidden ring-2 ring-[#FF9900] bg-white">
                {/* Category select - hidden on mobile */}
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="bg-[#f3f3f3] hover:bg-[#e8e8e8] text-black text-xs px-2 border-r border-gray-300 cursor-pointer focus:outline-none flex-shrink-0 max-w-[110px] hidden sm:block"
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                {/* Input */}
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        placeholder="Search products, brands and more..."
                        className="w-full h-full px-3 py-2 text-black text-sm outline-none bg-white placeholder-gray-400"
                        autoComplete="off"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => { setSearch(''); setSuggestions([]); setShowSuggestions(false); inputRef.current?.focus(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl leading-none"
                        >×</button>
                    )}
                </div>

                {/* Search button */}
                <button
                    onClick={handleSearch}
                    className="bg-[#FF9900] hover:bg-[#e68a00] active:bg-[#c96d00] text-black px-4 transition flex items-center justify-center flex-shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                </button>
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white text-black shadow-2xl rounded-b-lg z-50 border border-gray-200 overflow-hidden mt-0.5">
                    {loadingSuggestions ? (
                        <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-[#FF9900]" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Searching...
                        </div>
                    ) : suggestions.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">No results for "{search}"</div>
                    ) : (
                        <>
                            <div className="px-3 py-1.5 text-xs text-gray-400 bg-gray-50 border-b font-medium uppercase tracking-wide">
                                {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} {category !== 'All' ? `in ${category}` : ''}
                            </div>
                            {suggestions.map((product, i) => {
                                const img = Array.isArray(product.image_urls)
                                    ? product.image_urls[0]
                                    : `https://picsum.photos/seed/${product.id}/80/80`;
                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSuggestionClick(product)}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === activeIndex ? 'bg-[#FFF3CD]' : 'hover:bg-gray-50'}`}
                                    >
                                        <img src={img} alt={product.name}
                                            className="w-10 h-10 object-contain rounded bg-gray-50 border flex-shrink-0"
                                            onError={e => e.target.src = `https://picsum.photos/seed/${product.id}/80/80`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {product.name.split(new RegExp(`(${search})`, 'gi')).map((part, j) =>
                                                    part.toLowerCase() === search.toLowerCase()
                                                        ? <mark key={j} className="bg-yellow-200 text-black rounded px-0.5">{part}</mark>
                                                        : part
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">{product.Category?.name || 'General'}</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 flex-shrink-0">{formatPrice(product.price)}</span>
                                    </button>
                                );
                            })}
                            <button
                                onClick={handleSearch}
                                className="w-full px-4 py-2.5 text-sm text-[#c7511f] font-semibold hover:bg-orange-50 border-t text-center transition-colors"
                            >
                                See all results for "{search}" →
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <header className="sticky top-0 z-40 shadow-md">
            {/* Main navbar */}
            <div className="bg-[#131921] text-white px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3">

                {/* Logo */}
                <Link to="/" className="flex-shrink-0 border-2 border-transparent hover:border-white rounded px-1 sm:px-2 py-1">
                    <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                        <span className="text-white">amazon</span>
                        <span className="text-[#FF9900]">.</span>
                        <span className="text-white text-xs sm:text-sm align-top">in</span>
                    </span>
                </Link>

                {/* Desktop search bar */}
                <SearchBar className="flex-1 max-w-2xl mx-auto hidden sm:block" />

                {/* Mobile search toggle */}
                <button
                    className="sm:hidden text-white p-1 hover:text-[#FF9900] transition ml-auto"
                    onClick={() => setMobileSearchOpen(v => !v)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                </button>

                {/* Right side icons */}
                <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">

                    {/* Account */}
                    {user ? (
                        <div className="relative group">
                            <button className="border-2 border-transparent hover:border-white rounded px-1 sm:px-2 py-1 text-xs text-left leading-tight hidden sm:block">
                                <div className="text-gray-300">Hello, {user.name?.split(' ')[0]}</div>
                                <div className="font-bold">Account ▾</div>
                            </button>
                            {/* Mobile account button */}
                            <button
                                className="sm:hidden border-2 border-transparent hover:border-white rounded p-1"
                                onClick={() => setMobileMenuOpen(v => !v)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            {/* Dropdown */}
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white text-black rounded-lg shadow-xl hidden group-hover:block z-50 border border-gray-100">
                                <div className="px-4 py-3 border-b">
                                    <p className="text-sm font-semibold truncate">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                                <Link to="/orders" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 font-medium transition">
                                    <span>📦</span> My Orders
                                </Link>
                                <Link to="/wishlist" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 font-medium transition">
                                    <span>❤️</span> My Wishlist
                                    {wishlistCount > 0 && (
                                        <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="border-t">
                                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition">
                                        <span>🚪</span> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="border-2 border-transparent hover:border-white rounded px-1 sm:px-2 py-1 text-xs leading-tight"
                        >
                            <div className="text-gray-300 hidden sm:block">Hello, Sign in</div>
                            <div className="font-bold hidden sm:block">Account ▾</div>
                            {/* Mobile */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    )}

                    {/* Wishlist icon */}
                    <Link to="/wishlist" className="hidden sm:flex items-center gap-1 border-2 border-transparent hover:border-white rounded px-2 py-1 relative">
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </span>
                            )}
                        </div>
                        <span className="font-bold text-sm hidden lg:block">Wishlist</span>
                    </Link>

                    {/* Cart icon */}
                    <Link to="/cart" className="flex items-center gap-1 border-2 border-transparent hover:border-white rounded px-1 sm:px-2 py-1 relative">
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#FF9900] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </div>
                        <span className="font-bold text-sm hidden sm:block">Cart</span>
                    </Link>
                </div>
            </div>

            {/* Mobile search bar (expandable) */}
            {mobileSearchOpen && (
                <div className="sm:hidden bg-[#232F3E] px-3 py-2">
                    <SearchBar className="w-full" />
                </div>
            )}

            {/* Mobile menu */}
            {mobileMenuOpen && user && (
                <div className="sm:hidden bg-white text-black border-t shadow-lg z-50">
                    <div className="px-4 py-3 border-b bg-gray-50">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b">
                        <span>📦</span> My Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b">
                        <span>❤️</span> My Wishlist
                        {wishlistCount > 0 && (
                            <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>
                        )}
                    </Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            )}

            {/* Bottom nav */}
            <div className="bg-[#232F3E] text-white px-3 sm:px-4 py-1.5 flex items-center gap-4 sm:gap-6 text-sm overflow-x-auto scrollbar-hide">
                <button className="flex items-center gap-1 hover:text-[#FF9900] whitespace-nowrap flex-shrink-0">
                    <span>☰</span>
                    <span className="hidden sm:inline">All</span>
                </button>
                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <Link key={cat} to={`/?category=${encodeURIComponent(cat)}`}
                        className="hover:text-[#FF9900] whitespace-nowrap transition-colors flex-shrink-0 text-xs sm:text-sm">
                        {cat}
                    </Link>
                ))}
                <Link to="/" className="hover:text-[#FF9900] whitespace-nowrap text-[#FF9900] font-semibold flex-shrink-0 text-xs sm:text-sm">
                    Today's Deals
                </Link>
            </div>
        </header>
    );
}