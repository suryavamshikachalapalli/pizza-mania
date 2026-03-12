import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const { items, isOpen, dispatch, totalAmount, totalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    dispatch({ type: 'CLOSE_CART' });
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-orange-100">
          <div>
            <h2 className="font-display text-2xl font-bold text-orange-900">Your Order</h2>
            <p className="text-sm text-stone-500 mt-0.5">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
            className="p-2 rounded-full hover:bg-orange-50 text-stone-400 hover:text-orange-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4 pizza-emoji">🍕</span>
              <p className="font-display text-xl text-stone-400">Your cart is empty</p>
              <p className="text-sm text-stone-400 mt-2">Add some delicious pizzas!</p>
              <button
                onClick={() => dispatch({ type: 'CLOSE_CART' })}
                className="mt-6 btn-primary text-white px-6 py-3 rounded-full font-medium"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <CartItem key={idx} item={item} index={idx} dispatch={dispatch} />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-orange-100 bg-orange-50/50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-600">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-orange-900 pt-2 border-t border-orange-200">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full btn-primary text-white py-4 rounded-2xl font-semibold text-lg"
            >
              Proceed to Checkout →
            </button>
            <p className="text-center text-xs text-stone-400 mt-3">🔒 Secure checkout</p>
          </div>
        )}
      </div>
    </>
  );
}

function CartItem({ item, index, dispatch }) {
  return (
    <div className="flex gap-4 p-4 bg-orange-50 rounded-2xl group">
      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
        {item.emoji || '🍕'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-stone-800 truncate">{item.name}</p>
        <p className="text-xs text-stone-500 capitalize">{item.size} size</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { index, qty: item.quantity - 1 } })}
              className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-600 font-bold shadow-sm hover:bg-orange-100 transition-colors"
            >
              −
            </button>
            <span className="font-mono font-bold text-stone-800 w-5 text-center">{item.quantity}</span>
            <button
              onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { index, qty: item.quantity + 1 } })}
              className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-orange-600 font-bold shadow-sm hover:bg-orange-100 transition-colors"
            >
              +
            </button>
          </div>
          <span className="font-bold text-orange-700">₹{item.price * item.quantity}</span>
        </div>
      </div>
      <button
        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: index })}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all self-start"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
