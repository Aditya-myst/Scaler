import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getOrderHistoryAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';

const STATUS_STYLES = {
    pending:   { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', label: 'Pending' },
    shipped:   { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500',   label: 'Shipped' },
    delivered: { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500',  label: 'Delivered' },
    cancelled: { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500',    label: 'Cancelled' },
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getOrderHistoryAPI()
            .then(res => setOrders(res.data || []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-gray-400 text-lg">Loading orders...</div>
        </div>
    );

    if (orders.length === 0) return (
        <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="text-7xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">When you place an order, it will appear here.</p>
            <button onClick={() => navigate('/')}
                className="bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold px-8 py-3 rounded-full transition">
                Start Shopping
            </button>
        </div>
    );

    return (
        <div className="min-h-screen py-8 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>
                <p className="text-sm text-gray-500 mb-6">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

                <div className="space-y-4">
                    {orders.map(order => {
                        const status = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                        const isExpanded = expandedId === order.id;
                        const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        });

                        return (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Order Header */}
                                <div className="px-5 py-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:items-center gap-3">
                                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Order Placed</p>
                                            <p className="font-medium text-gray-900">{orderDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Total</p>
                                            <p className="font-medium text-gray-900">{formatPrice(parseFloat(order.total_price) * 1.18)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Order ID</p>
                                            <p className="font-medium text-[#c7511f]">#{String(order.id).padStart(8, '0')}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Status</p>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap flex items-center gap-1"
                                    >
                                        {isExpanded ? 'Hide details ▲' : 'View details ▼'}
                                    </button>
                                </div>

                                {/* Order Items Preview (always visible) */}
                                <div className="px-5 py-4">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {order.OrderItems?.slice(0, 4).map(item => {
                                            const img = item.Product?.image_urls?.[0] ||
                                                `https://picsum.photos/seed/${item.product_id}/80/80`;
                                            return (
                                                <Link key={item.id} to={`/products/${item.product_id}`}>
                                                    <img src={img} alt={item.Product?.name}
                                                        className="w-14 h-14 object-contain bg-gray-50 border rounded-lg hover:border-[#FF9900] transition"
                                                        onError={e => e.target.src = `https://picsum.photos/seed/${item.product_id}/80/80`} />
                                                </Link>
                                            );
                                        })}
                                        {order.OrderItems?.length > 4 && (
                                            <span className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-600">
                                                +{order.OrderItems.length - 4}
                                            </span>
                                        )}
                                        <div className="ml-2">
                                            <p className="text-sm font-medium text-gray-900">
                                                {order.OrderItems?.length} item{order.OrderItems?.length !== 1 ? 's' : ''}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">
                                                {order.OrderItems?.map(i => i.Product?.name).filter(Boolean).join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t px-5 py-4 bg-gray-50">
                                        <div className="space-y-3 mb-4">
                                            {order.OrderItems?.map(item => {
                                                const img = item.Product?.image_urls?.[0] ||
                                                    `https://picsum.photos/seed/${item.product_id}/80/80`;
                                                return (
                                                    <div key={item.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border">
                                                        <Link to={`/products/${item.product_id}`}>
                                                            <img src={img} alt={item.Product?.name}
                                                                className="w-16 h-16 object-contain bg-gray-50 rounded border"
                                                                onError={e => e.target.src = `https://picsum.photos/seed/${item.product_id}/80/80`} />
                                                        </Link>
                                                        <div className="flex-1 min-w-0">
                                                            <Link to={`/products/${item.product_id}`}>
                                                                <p className="text-sm font-medium text-gray-900 hover:text-[#c7511f] truncate">
                                                                    {item.Product?.name}
                                                                </p>
                                                            </Link>
                                                            <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                                                            {formatPrice(parseFloat(item.price) * item.quantity)}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Price breakdown */}
                                        <div className="bg-white rounded-lg p-4 border text-sm space-y-1.5">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal</span>
                                                <span>{formatPrice(order.total_price)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Delivery</span>
                                                <span className="text-green-600 font-medium">FREE</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600">
                                                <span>GST (18%)</span>
                                                <span>{formatPrice(parseFloat(order.total_price) * 0.18)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                                                <span>Order Total</span>
                                                <span className="text-[#c7511f]">{formatPrice(parseFloat(order.total_price) * 1.18)}</span>
                                            </div>
                                        </div>

                                        {/* Shipping address */}
                                        <div className="mt-3 bg-white rounded-lg p-4 border text-sm">
                                            <p className="font-semibold text-gray-700 mb-1">Shipped to:</p>
                                            <p className="text-gray-600">{order.shipping_address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}