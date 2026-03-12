import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { orderAPI } from '../services/api';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: '✅', desc: 'We received your order!' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳', desc: 'Chef is prepping your pizza' },
  { key: 'baking', label: 'Baking', icon: '🔥', desc: 'In the wood-fired oven' },
  { key: 'ready', label: 'Out for Delivery', icon: '🛵', desc: 'On the way to you!' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Enjoy your pizza!' },
];

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('orderId') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(600);

  const fetchOrder = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await orderAPI.getById(id);
      setOrder(res.data.data);
    } catch {
      // Try localStorage
      const saved = JSON.parse(localStorage.getItem('myOrders') || '[]');
      const found = saved.find(o => o.orderId === id);
      if (found) {
        setOrder(found);
      } else {
        setError('Order not found. Please check the order ID.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder(orderId);
  }, [orderId]);

  // Countdown timer based on order placement time
  useEffect(() => {
    if (!order || order.status === 'delivered') return;
    
    const placedTime = new Date(order.placedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - placedTime) / 1000);
    const remaining = Math.max(0, 600 - elapsed);
    setSecondsLeft(remaining);

    if (remaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  // Simulate status progression
  useEffect(() => {
    if (!order || order.status === 'delivered') return;
    const statusOrder = ['placed', 'preparing', 'baking', 'ready', 'delivered'];
    const currentIdx = statusOrder.indexOf(order.status);
    
    if (currentIdx < statusOrder.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = statusOrder[currentIdx + 1];
        const updatedOrder = { ...order, status: nextStatus };
        setOrder(updatedOrder);
        
        // Update in localStorage
        const saved = JSON.parse(localStorage.getItem('myOrders') || '[]');
        const idx = saved.findIndex(o => o.orderId === order.orderId);
        if (idx >= 0) {
          saved[idx] = updatedOrder;
          localStorage.setItem('myOrders', JSON.stringify(saved));
        }

        // Try API update
        orderAPI.updateStatus(order.orderId, nextStatus).catch(() => {});
      }, [120000, 90000, 90000, 60000][currentIdx] || 60000); // Realistic timing
      
      return () => clearTimeout(timer);
    }
  }, [order?.status]);

  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === order?.status);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = secondsLeft / 600;
  const CIRCUMFERENCE = 2 * Math.PI * 52;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-orange-900 mb-2">Track Order</h1>
        <p className="text-stone-500 mb-8">Enter your order ID to track your pizza in real-time.</p>

        {/* Search */}
        <div className="flex gap-3 mb-10">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. A1B2C3D4)"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value.toUpperCase())}
            onKeyDown={e => { if (e.key === 'Enter') setOrderId(searchInput); }}
            className="flex-1 px-5 py-4 rounded-2xl border border-orange-200 bg-white outline-none focus:ring-2 focus:ring-orange-300 font-mono tracking-widest text-stone-700 placeholder-stone-300 uppercase"
          />
          <button
            onClick={() => setOrderId(searchInput)}
            className="btn-primary text-white px-6 py-4 rounded-2xl font-semibold"
          >
            Track
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <span className="text-4xl">🔍</span>
            <p className="font-semibold text-red-700 mt-3">{error}</p>
            <p className="text-red-400 text-sm mt-1">Check your confirmation message for the order ID</p>
          </div>
        )}

        {order && (
          <div className="space-y-6 animate-slide-up">
            {/* Order Header */}
            <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-stone-400">Order ID</p>
                  <p className="font-mono text-2xl font-bold text-orange-800 tracking-widest">#{order.orderId}</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Placed at {new Date(order.placedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {STATUS_STEPS.find(s => s.key === order.status)?.icon} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-sm text-stone-500 mt-2">Total: ₹{order.totalAmount}</p>
                </div>
              </div>
            </div>

            {/* Timer */}
            {order.status !== 'delivered' && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-100 flex items-center gap-8">
                <div className="relative flex-shrink-0">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#fed7aa" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      stroke={progress > 0.3 ? '#ea580c' : '#ef4444'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s linear' }}
                    />
                    <text x="60" y="54" textAnchor="middle" style={{ fontFamily: 'JetBrains Mono', fontSize: '24px', fontWeight: 700, fill: '#ea580c' }}>
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </text>
                    <text x="60" y="72" textAnchor="middle" style={{ fontFamily: 'DM Sans', fontSize: '9px', fill: '#78716c', letterSpacing: '2px' }}>
                      REMAINING
                    </text>
                  </svg>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-orange-900">
                    {secondsLeft > 0 ? `${minutes} min ${seconds} sec` : 'Arriving now!'}
                  </p>
                  <p className="text-stone-500 mt-1">
                    {STATUS_STEPS.find(s => s.key === order.status)?.desc}
                  </p>
                  <p className="text-sm text-orange-600 font-medium mt-3">
                    📍 Delivering to: {order.customerAddress}
                  </p>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm">
              <h3 className="font-display text-lg font-bold text-stone-800 mb-6">Order Progress</h3>
              <div className="space-y-1">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const isPending = idx > currentStepIdx;
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                          isDone ? 'bg-green-500 text-white' :
                          isCurrent ? 'bg-orange-500 text-white ring-4 ring-orange-200 animate-pulse' :
                          'bg-orange-100 text-stone-400'
                        }`}>
                          {isDone ? '✓' : step.icon}
                        </div>
                        {idx < STATUS_STEPS.length - 1 && (
                          <div className={`w-0.5 h-10 my-1 transition-all duration-500 ${
                            isDone ? 'bg-green-400' : 'bg-orange-100'
                          }`} />
                        )}
                      </div>
                      <div className="pb-4 pt-1.5">
                        <p className={`font-semibold text-sm ${
                          isCurrent ? 'text-orange-700' : isDone ? 'text-green-700' : 'text-stone-400'
                        }`}>
                          {step.label}
                          {isCurrent && <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Current</span>}
                        </p>
                        <p className={`text-xs mt-0.5 ${isCurrent || isDone ? 'text-stone-500' : 'text-stone-300'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm">
              <h3 className="font-display text-lg font-bold text-stone-800 mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl">🍕</div>
                    <div className="flex-1">
                      <p className="font-medium text-stone-800 text-sm">{item.name}</p>
                      <p className="text-xs text-stone-400 capitalize">{item.size} size · Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-orange-700">₹{item.price * item.quantity}</p>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-orange-900 pt-2 border-t border-orange-100">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
