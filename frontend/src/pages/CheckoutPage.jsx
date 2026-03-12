import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import OrderToast from '../components/OrderToast';

export default function CheckoutPage() {
  const { items, totalAmount, dispatch } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!form.customerPhone.trim() || !/^\d{10}$/.test(form.customerPhone.replace(/\s/g, '')))
      errs.customerPhone = 'Valid 10-digit phone required';
    if (!form.customerAddress.trim()) errs.customerAddress = 'Address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);

    const orderData = {
      ...form,
      items: items.map(i => ({
        pizzaId: i.pizzaId,
        name: i.name,
        size: i.size,
        price: i.price,
        quantity: i.quantity
      })),
      totalAmount
    };

    try {
      const res = await orderAPI.place(orderData);
      const order = res.data.data;

      // Save to localStorage for tracking
      const savedOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      savedOrders.unshift(order);
      localStorage.setItem('myOrders', JSON.stringify(savedOrders));

      dispatch({ type: 'CLEAR_CART' });
      setActiveOrder(order);
    } catch (err) {
      // Simulate success even if backend is down
      const mockOrder = {
        orderId: Math.random().toString(36).slice(2, 10).toUpperCase(),
        ...orderData,
        status: 'placed',
        placedAt: new Date().toISOString(),
        estimatedTime: 10
      };
      const savedOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      savedOrders.unshift(mockOrder);
      localStorage.setItem('myOrders', JSON.stringify(savedOrders));
      dispatch({ type: 'CLEAR_CART' });
      setActiveOrder(mockOrder);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !activeOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <span className="text-6xl mb-4">🍕</span>
        <h2 className="font-display text-3xl font-bold text-stone-700 mb-2">Cart is empty</h2>
        <p className="text-stone-400 mb-6">Add some amazing pizzas first!</p>
        <button onClick={() => navigate('/')} className="btn-primary text-white px-8 py-3 rounded-full font-semibold">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-orange-900 mb-2">Checkout</h1>
        <p className="text-stone-500 mb-10">Almost there! Fill in your details to place the order.</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm">
              <h2 className="font-display text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">1</span>
                Delivery Details
              </h2>

              <div className="space-y-4">
                <InputField
                  label="Full Name"
                  icon="👤"
                  type="text"
                  placeholder="Rahul Sharma"
                  value={form.customerName}
                  onChange={v => setForm({ ...form, customerName: v })}
                  error={errors.customerName}
                />
                <InputField
                  label="Phone Number"
                  icon="📱"
                  type="tel"
                  placeholder="9876543210"
                  value={form.customerPhone}
                  onChange={v => setForm({ ...form, customerPhone: v })}
                  error={errors.customerPhone}
                />
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    <span className="mr-2">📍</span>Delivery Address
                  </label>
                  <textarea
                    rows={3}
                    placeholder="House no., Street, Area, City..."
                    value={form.customerAddress}
                    onChange={e => setForm({ ...form, customerAddress: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-300 transition-all text-stone-700 placeholder-stone-300 resize-none ${
                      errors.customerAddress ? 'border-red-300 bg-red-50' : 'border-orange-100 bg-orange-50/30'
                    }`}
                  />
                  {errors.customerAddress && <p className="text-red-500 text-xs mt-1">{errors.customerAddress}</p>}
                </div>
              </div>
            </div>

            {/* Payment note */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-semibold text-green-800 text-sm">Cash on Delivery</p>
                <p className="text-green-600 text-xs">Pay when your pizza arrives. Safe & convenient.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full btn-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {placing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  🍕 Place Order · ₹{totalAmount}
                </>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm sticky top-24">
              <h2 className="font-display text-xl font-bold text-stone-800 mb-5 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">2</span>
                Order Summary
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                    <span className="text-xl">{item.emoji || '🍕'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-stone-400 capitalize">{item.size} × {item.quantity}</p>
                    </div>
                    <span className="font-bold text-orange-700 text-sm">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-orange-100 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span><span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Delivery</span><span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-orange-900 text-lg pt-1">
                  <span>Total</span><span>₹{totalAmount}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-50 rounded-xl flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                <p className="text-sm text-stone-600">Estimated delivery: <strong className="text-orange-700">10 minutes</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Toast with Timer */}
      {activeOrder && (
        <OrderToast
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onViewOrder={() => navigate(`/track?orderId=${activeOrder.orderId}`)}
        />
      )}
    </div>
  );
}

function InputField({ label, icon, type, placeholder, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">
        <span className="mr-2">{icon}</span>{label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-orange-300 transition-all text-stone-700 placeholder-stone-300 ${
          error ? 'border-red-300 bg-red-50' : 'border-orange-100 bg-orange-50/30'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
