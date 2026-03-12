import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const SIZE_LABELS = { small: 'S', medium: 'M', large: 'L' };

export default function PizzaCard({ pizza }) {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [adding, setAdding] = useState(false);
  const { dispatch } = useCart();

  const currentPrice = pizza.sizes[selectedSize]?.price;
  const currentInches = pizza.sizes[selectedSize]?.inches;

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        pizzaId: pizza.id,
        name: pizza.name,
        size: selectedSize,
        price: currentPrice,
        emoji: pizza.emoji,
        quantity: 1
      }
    });
    setAdding(true);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <div className="pizza-card bg-white rounded-3xl overflow-hidden border border-orange-100 flex flex-col group">
      {/* Pizza Visual */}
      <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 p-8 flex items-center justify-center h-44">
        <span className="text-7xl pizza-emoji select-none">{pizza.emoji}</span>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {pizza.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              tag === 'Vegetarian' || tag === 'Veg' ? 'bg-green-100 text-green-700' :
              tag === 'Non-Veg' ? 'bg-red-100 text-red-700' :
              tag === 'Bestseller' ? 'bg-orange-100 text-orange-700' :
              tag === 'Spicy' || tag === 'Extra Spicy' ? 'bg-red-50 text-red-500' :
              tag === 'Premium' || tag === 'Gourmet' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-50 text-blue-600'
            }`}>
              {tag === 'Vegetarian' ? '🌿 ' : tag === 'Non-Veg' ? '🥩 ' : tag === 'Spicy' ? '🌶️ ' : tag === 'Extra Spicy' ? '🔥 ' : tag === 'Bestseller' ? '⭐ ' : ''}{tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span className="text-amber-400 text-xs">★</span>
          <span className="text-xs font-bold text-stone-700">{pizza.rating}</span>
          <span className="text-xs text-stone-400">({pizza.reviews > 999 ? `${(pizza.reviews/1000).toFixed(1)}k` : pizza.reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="font-display text-lg font-bold text-stone-900 leading-tight">{pizza.name}</h3>
          <p className="text-sm text-stone-500 mt-1 line-clamp-2 leading-relaxed">{pizza.description}</p>
        </div>

        {/* Size Selector */}
        <div className="mb-4">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wider mb-2">Size</p>
          <div className="flex gap-2">
            {Object.entries(pizza.sizes).map(([size, info]) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  selectedSize === size
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-orange-50 text-stone-600 hover:bg-orange-100'
                }`}
              >
                <span className="block">{SIZE_LABELS[size]}</span>
                <span className="block text-xs opacity-75">{info.inches}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-display text-2xl font-bold text-orange-700">₹{currentPrice}</span>
            <span className="text-xs text-stone-400 ml-1">{currentInches}" pizza</span>
          </div>
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
              adding
                ? 'bg-green-500 text-white scale-95'
                : 'btn-primary text-white'
            }`}
          >
            {adding ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <span className="text-base leading-none">+</span>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
