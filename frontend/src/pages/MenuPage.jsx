import React, { useState, useEffect } from 'react';
import PizzaCard from '../components/PizzaCard';
import { pizzaAPI } from '../services/api';

const CATEGORIES = ['All', 'Classic', 'Non-Veg', 'Veg', 'Seafood', 'Premium'];

// Fallback data if API is down
const FALLBACK_PIZZAS = [
  { id: 'p1', name: 'Margherita Classic', description: 'Fresh tomato sauce, mozzarella di bufala, basil leaves, extra virgin olive oil', category: 'Classic', emoji: '🍕', tags: ['Vegetarian', 'Bestseller'], sizes: { small: { price: 199, inches: 8 }, medium: { price: 299, inches: 10 }, large: { price: 399, inches: 12 } }, rating: 4.8, reviews: 1243 },
  { id: 'p2', name: 'Pepperoni Supreme', description: 'Double pepperoni, smoked mozzarella, spicy tomato base, oregano', category: 'Non-Veg', emoji: '🥩', tags: ['Non-Veg', 'Spicy'], sizes: { small: { price: 249, inches: 8 }, medium: { price: 349, inches: 10 }, large: { price: 499, inches: 12 } }, rating: 4.9, reviews: 2187 },
  { id: 'p3', name: 'BBQ Chicken Fiesta', description: 'Smoky BBQ sauce, grilled chicken, caramelized onions, capsicum, cheese blend', category: 'Non-Veg', emoji: '🍗', tags: ['Non-Veg', 'Bestseller'], sizes: { small: { price: 279, inches: 8 }, medium: { price: 379, inches: 10 }, large: { price: 529, inches: 12 } }, rating: 4.7, reviews: 987 },
  { id: 'p4', name: 'Garden Veggie Delight', description: 'Roasted veggies, sun-dried tomatoes, ricotta, pesto drizzle, arugula', category: 'Veg', emoji: '🥦', tags: ['Vegetarian', 'Healthy'], sizes: { small: { price: 229, inches: 8 }, medium: { price: 329, inches: 10 }, large: { price: 449, inches: 12 } }, rating: 4.6, reviews: 654 },
  { id: 'p5', name: 'Quattro Formaggi', description: 'Four cheese blend: mozzarella, gorgonzola, parmesan, and fontina with honey drizzle', category: 'Classic', emoji: '🧀', tags: ['Vegetarian', 'Premium'], sizes: { small: { price: 269, inches: 8 }, medium: { price: 369, inches: 10 }, large: { price: 519, inches: 12 } }, rating: 4.8, reviews: 1102 },
  { id: 'p6', name: 'Spicy Diavola', description: 'Fiery salami, jalapeños, red chillies, sriracha swirl, pepper jack cheese', category: 'Non-Veg', emoji: '🌶️', tags: ['Non-Veg', 'Extra Spicy'], sizes: { small: { price: 259, inches: 8 }, medium: { price: 359, inches: 10 }, large: { price: 509, inches: 12 } }, rating: 4.5, reviews: 876 },
  { id: 'p7', name: 'Truffle Mushroom', description: 'White truffle oil, wild mushrooms, caramelized onion, gruyère, fresh thyme', category: 'Premium', emoji: '🍄', tags: ['Vegetarian', 'Gourmet', 'Premium'], sizes: { small: { price: 319, inches: 8 }, medium: { price: 429, inches: 10 }, large: { price: 599, inches: 12 } }, rating: 4.9, reviews: 543 },
  { id: 'p8', name: 'Prawn Scampi', description: 'Garlic butter base, tiger prawns, lemon zest, parsley, cherry tomatoes', category: 'Seafood', emoji: '🦐', tags: ['Seafood', 'Premium'], sizes: { small: { price: 339, inches: 8 }, medium: { price: 459, inches: 10 }, large: { price: 629, inches: 12 } }, rating: 4.7, reviews: 432 },
];

export default function MenuPage() {
  const [pizzas, setPizzas] = useState(FALLBACK_PIZZAS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await pizzaAPI.getAll();
        setPizzas(res.data.data);
      } catch {
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const filtered = pizzas.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient pt-28 pb-16 px-4 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Open Now · Delivering in 10 mins
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-black text-orange-900 leading-tight mb-4">
            Artisan Pizza,<br/>
            <span className="italic text-orange-500">Hot & Fresh</span>
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto mb-8">
            Wood-fired perfection crafted by master pizzaiolos. Every pie made to order, delivered in minutes.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search pizzas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg shadow-orange-100 border border-orange-100 outline-none focus:ring-2 focus:ring-orange-300 text-stone-700 placeholder-stone-400"
            />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10">
            {[
              { value: '10 min', label: 'Avg Delivery' },
              { value: '4.9★', label: 'Rating' },
              { value: '50k+', label: 'Orders' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold text-orange-800">{stat.value}</p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-stone-600 hover:bg-orange-50 border border-orange-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-stone-500 text-sm">
            {filtered.length} pizza{filtered.length !== 1 ? 's' : ''} {activeCategory !== 'All' ? `in ${activeCategory}` : 'available'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-sm text-orange-600 hover:text-orange-800"
            >
              Clear search ×
            </button>
          )}
        </div>

        {/* Pizza Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden">
                <div className="shimmer h-44 rounded-t-3xl" />
                <div className="p-5 bg-white rounded-b-3xl space-y-3">
                  <div className="shimmer h-5 rounded-lg w-3/4" />
                  <div className="shimmer h-4 rounded-lg" />
                  <div className="shimmer h-4 rounded-lg w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl">🍕</span>
            <p className="font-display text-2xl text-stone-400 mt-4">No pizzas found</p>
            <p className="text-stone-400 mt-2">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((pizza, i) => (
              <div key={pizza.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <PizzaCard pizza={pizza} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
