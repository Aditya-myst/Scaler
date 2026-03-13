import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { checkoutAPI } from '../services/api.js';
import { formatPrice } from '../utils/helpers.js';

export default function Checkout() {
    const { cart, refreshCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [ordered, setOrdered] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [form, setForm] = useState({
        fullName: '', phone: '', address: '', city: '', state: '', pincode: '', country: 'India'
    });
    const [errors, setErrors] = useState({});

    // ✅ Fixed: cart.items not cart.cartItems
    const cartItems = cart?.items || [];
    const cartTotal = cart?.subtotal || 0;

    const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = 'Required';
        if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone';
        if (!form.address.trim()) e.address = 'Required';
        if (!form.city.trim()) e.city = 'Required';
        if (!form.state.trim()) e.state = 'Required';
        if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode';
        return e;
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handlePlaceOrder = async () => {
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        try {
            const shippingAddress = `${form.fullName}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}, ${form.country}. Ph: ${form.phone}`;
            const res = await checkoutAPI(shippingAddress);
            setOrderId(res.data.id);
            await refreshCart();
            setOrdered(true);
            showToast('Order placed successfully!', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to place order. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (ordered) {
        return (
            <div className="min-h-screen flex items-center justify-center py-20 px-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-4">Thank you for your order. We'll send you a confirmation shortly.</p>
                    {orderId && (
                        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
                            <p className="text-sm text-gray-600">Order ID</p>
                            <p className="text-xl font-bold text-[#c7511f]">#{String(orderId).padStart(8, '0')}</p>
                        </div>
                    )}
                    <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700 mb-6">
                        Estimated delivery: <strong>3-7 business days</strong>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold rounded-full transition hover:shadow-md"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && !loading && !ordered) {
        return (
            <div className="min-h-screen py-20 text-center">
                <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#FF9900] rounded-lg">
                    Go to Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Shipping form */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-7 h-7 bg-[#232F3E] text-white rounded-full flex items-center justify-center text-sm">1</span>
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={form.fullName}
                                        onChange={(e) => handleChange('fullName', e.target.value)}
                                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] transition ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number *</label>
                                    <input
                                        type="tel"
                                        placeholder="10-digit mobile number"
                                        value={form.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] transition ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Pincode *</label>
                                    <input
                                        type="text"
                                        placeholder="6-digit pincode"
                                        value={form.pincode}
                                        onChange={(e) => handleChange('pincode', e.target.value)}
                                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] transition ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Address *</label>
                                    <input
                                        type="text"
                                        placeholder="House No., Street, Area"
                                        value={form.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] transition ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={form.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] transition ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">State *</label>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={form.state}
                                        onChange={(e) => handleChange('state', e.target.value)}
                                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF990033] transition ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-7 h-7 bg-[#232F3E] text-white rounded-full flex items-center justify-center text-sm">2</span>
                                Payment
                            </h2>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                                💳 Cash on Delivery is available for this order. No payment needed now.
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
                            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                                {cartItems.map(item => {
                                    const img = item.Product?.image_urls?.[0] || `https://picsum.photos/seed/${item.product_id}/80/80`;
                                    return (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            <div className="relative flex-shrink-0">
                                                <img src={img} alt={item.Product?.name} className="w-12 h-12 object-contain bg-gray-50 rounded border" />
                                                <span className="absolute -top-1.5 -right-1.5 bg-gray-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{item.quantity}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-700 truncate font-medium">{item.Product?.name}</p>
                                            </div>
                                            <span className="text-sm font-semibold flex-shrink-0">{formatPrice(parseFloat(item.price) * item.quantity)}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-medium">FREE</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (GST 18%)</span>
                                    <span>{formatPrice(cartTotal * 0.18)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                    <span>Order Total</span>
                                    <span className="text-[#c7511f]">{formatPrice(cartTotal * 1.18)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || cartItems.length === 0}
                                className="w-full mt-5 py-3 bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold rounded-full transition hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}