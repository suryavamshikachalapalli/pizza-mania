import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrderPage from './pages/TrackOrderPage';
import OrdersPage from './pages/OrdersPage';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <div className="noise min-h-screen bg-cream">
            <Navbar />
            <CartSidebar />
            <main>
              <Routes>
                <Route path="/" element={<MenuPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/track" element={<TrackOrderPage />} />
                <Route path="/orders" element={<OrdersPage />} />
              </Routes>
            </main>
            {/* Footer */}
            <footer className="bg-orange-900 text-orange-100 py-12 px-4 mt-8">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🍕</span>
                    <span className="font-display text-xl font-bold text-white">PizzaMania</span>
                  </div>
                  <p className="text-orange-300 text-sm leading-relaxed">
                    Artisan wood-fired pizzas crafted with the finest ingredients. 
                    Delivered hot in 10 minutes or less.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-orange-300">
                    <li><a href="/" className="hover:text-white transition-colors">Menu</a></li>
                    <li><a href="/track" className="hover:text-white transition-colors">Track Order</a></li>
                    <li><a href="/orders" className="hover:text-white transition-colors">My Orders</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Contact</h4>
                  <ul className="space-y-2 text-sm text-orange-300">
                    <li>📞 1800-PIZZA-HQ</li>
                    <li>📧 hello@PizzaMania.in</li>
                    <li>⏰ Mon–Sun, 11AM–11PM</li>
                  </ul>
                </div>
              </div>
              <div className="max-w-6xl mx-auto border-t border-orange-800 mt-8 pt-6 text-center text-orange-400 text-sm">
                © 2026 PizzaMania. Made with ❤️ and 🍕
              </div>
            </footer>
          </div>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
