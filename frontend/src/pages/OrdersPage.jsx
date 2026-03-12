import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  placed: { label: 'Placed', color: 'bg-blue-100 text-blue-700', icon: '✅' },
  preparing: { label: 'Preparing', color: 'bg-amber-100 text-amber-700', icon: '👨‍🍳' },
  baking: { label: 'Baking', color: 'bg-orange-100 text-orange-700', icon: '🔥' },
  ready: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-700', icon: '🛵' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: '🎉' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myOrders') || '[]');
    setOrders(saved);
  }, []);

  const clearOrders = () => {
    localStorage.removeItem('myOrders');
    setOrders([]);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-4xl font-bold text-orange-900">My Orders</h1>
          {orders.length > 0 && (
            <button onClick={clearOrders} className="text-sm text-stone-400 hover:text-red-500 transition-colors">
              Clear all
            </button>
          )}
        </div>
        <p className="text-stone-500 mb-10">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-7xl mb-4 pizza-emoji">🍕</span>
            <h2 className="font-display text-3xl font-bold text-stone-300 mb-2">No orders yet</h2>
            <p className="text-stone-400 mb-8">Your order history will appear here</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary text-white px-8 py-3 rounded-full font-semibold"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow animate-fade-in cursor-pointer group"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => navigate(`/track?orderId=${order.orderId}`)}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                        🍕
                      </div>
                      <div>
                        <p className="font-mono font-bold text-orange-800 tracking-widest text-lg">#{order.orderId}</p>
                        <p className="text-stone-500 text-sm mt-0.5">
                          {new Date(order.placedAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusCfg.color}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                      <svg className="w-5 h-5 text-stone-300 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(order.items || []).slice(0, 3).map((item, j) => (
                      <span key={j} className="bg-orange-50 text-stone-600 text-xs px-3 py-1.5 rounded-full">
                        {item.name} ({item.size}) ×{item.quantity}
                      </span>
                    ))}
                    {(order.items || []).length > 3 && (
                      <span className="bg-orange-50 text-stone-400 text-xs px-3 py-1.5 rounded-full">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-stone-500">📍 {order.customerAddress?.slice(0, 40)}{order.customerAddress?.length > 40 ? '...' : ''}</p>
                    <p className="font-bold text-orange-700">₹{order.totalAmount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
