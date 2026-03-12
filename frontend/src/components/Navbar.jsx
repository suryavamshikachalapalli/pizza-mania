import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { totalItems, dispatch } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-orange-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl pizza-emoji">🍕</span>
            <div>
              <span className="font-display text-xl font-bold text-orange-800 tracking-tight">PizzaMania</span>
              <p className="text-xs text-orange-400 font-body hidden sm:block" style={{marginTop: '-4px'}}>Artisan Pizzeria</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" current={location.pathname}>Menu</NavLink>
            <NavLink to="/track" current={location.pathname}>Track Order</NavLink>
            <NavLink to="/orders" current={location.pathname}>My Orders</NavLink>
          </div>

          {/* Cart Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="relative btn-primary text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-orange-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl mb-4 p-4 animate-slide-up">
            <div className="flex flex-col gap-3">
              <MobileNavLink to="/" onClick={() => setMenuOpen(false)}>🍕 Menu</MobileNavLink>
              <MobileNavLink to="/track" onClick={() => setMenuOpen(false)}>📍 Track Order</MobileNavLink>
              <MobileNavLink to="/orders" onClick={() => setMenuOpen(false)}>📋 My Orders</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, current, children }) {
  const isActive = current === to;
  return (
    <Link
      to={to}
      className={`relative font-medium text-sm transition-colors pb-1 ${
        isActive ? 'text-orange-600' : 'text-stone-600 hover:text-orange-600'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
      )}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 rounded-xl text-stone-700 hover:bg-orange-50 hover:text-orange-700 font-medium transition-colors"
    >
      {children}
    </Link>
  );
}
