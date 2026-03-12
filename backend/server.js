const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pizzaapp';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('⚠️  MongoDB not connected, using in-memory store:', err.message));

// === SCHEMAS ===
const orderSchema = new mongoose.Schema({
  orderId: { type: String, default: () => uuidv4().slice(0, 8).toUpperCase() },
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  items: [{
    pizzaId: String,
    name: String,
    size: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['placed', 'preparing', 'baking', 'ready', 'delivered'],
    default: 'placed'
  },
  estimatedTime: { type: Number, default: 10 }, // minutes
  placedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// === IN-MEMORY FALLBACK ===
let inMemoryOrders = [];
let useInMemory = false;
mongoose.connection.on('error', () => { useInMemory = true; });

// === PIZZA DATA ===
const pizzas = [
  {
    id: 'p1',
    name: 'Margherita Classic',
    description: 'Fresh tomato sauce, mozzarella di bufala, basil leaves, extra virgin olive oil',
    category: 'Classic',
    image: '🍕',
    emoji: '🍕',
    tags: ['Vegetarian', 'Bestseller'],
    sizes: {
      small: { price: 199, inches: 8 },
      medium: { price: 299, inches: 10 },
      large: { price: 399, inches: 12 }
    },
    rating: 4.8,
    reviews: 1243
  },
  {
    id: 'p2',
    name: 'Pepperoni Supreme',
    description: 'Double pepperoni, smoked mozzarella, spicy tomato base, oregano',
    category: 'Non-Veg',
    image: '🍕',
    emoji: '🥩',
    tags: ['Non-Veg', 'Spicy'],
    sizes: {
      small: { price: 249, inches: 8 },
      medium: { price: 349, inches: 10 },
      large: { price: 499, inches: 12 }
    },
    rating: 4.9,
    reviews: 2187
  },
  {
    id: 'p3',
    name: 'BBQ Chicken Fiesta',
    description: 'Smoky BBQ sauce, grilled chicken, caramelized onions, capsicum, cheese blend',
    category: 'Non-Veg',
    image: '🍕',
    emoji: '🍗',
    tags: ['Non-Veg', 'Bestseller'],
    sizes: {
      small: { price: 279, inches: 8 },
      medium: { price: 379, inches: 10 },
      large: { price: 529, inches: 12 }
    },
    rating: 4.7,
    reviews: 987
  },
  {
    id: 'p4',
    name: 'Garden Veggie Delight',
    description: 'Roasted veggies, sun-dried tomatoes, ricotta, pesto drizzle, arugula',
    category: 'Veg',
    image: '🍕',
    emoji: '🥦',
    tags: ['Vegetarian', 'Healthy'],
    sizes: {
      small: { price: 229, inches: 8 },
      medium: { price: 329, inches: 10 },
      large: { price: 449, inches: 12 }
    },
    rating: 4.6,
    reviews: 654
  },
  {
    id: 'p5',
    name: 'Quattro Formaggi',
    description: 'Four cheese blend: mozzarella, gorgonzola, parmesan, and fontina with honey drizzle',
    category: 'Classic',
    image: '🍕',
    emoji: '🧀',
    tags: ['Vegetarian', 'Premium'],
    sizes: {
      small: { price: 269, inches: 8 },
      medium: { price: 369, inches: 10 },
      large: { price: 519, inches: 12 }
    },
    rating: 4.8,
    reviews: 1102
  },
  {
    id: 'p6',
    name: 'Spicy Diavola',
    description: 'Fiery salami, jalapeños, red chillies, sriracha swirl, pepper jack cheese',
    category: 'Non-Veg',
    image: '🍕',
    emoji: '🌶️',
    tags: ['Non-Veg', 'Extra Spicy'],
    sizes: {
      small: { price: 259, inches: 8 },
      medium: { price: 359, inches: 10 },
      large: { price: 509, inches: 12 }
    },
    rating: 4.5,
    reviews: 876
  },
  {
    id: 'p7',
    name: 'Truffle Mushroom',
    description: 'White truffle oil, wild mushrooms, caramelized onion, gruyère, fresh thyme',
    category: 'Premium',
    image: '🍕',
    emoji: '🍄',
    tags: ['Vegetarian', 'Gourmet', 'Premium'],
    sizes: {
      small: { price: 319, inches: 8 },
      medium: { price: 429, inches: 10 },
      large: { price: 599, inches: 12 }
    },
    rating: 4.9,
    reviews: 543
  },
  {
    id: 'p8',
    name: 'Prawn Scampi',
    description: 'Garlic butter base, tiger prawns, lemon zest, parsley, cherry tomatoes',
    category: 'Seafood',
    image: '🍕',
    emoji: '🦐',
    tags: ['Seafood', 'Premium'],
    sizes: {
      small: { price: 339, inches: 8 },
      medium: { price: 459, inches: 10 },
      large: { price: 629, inches: 12 }
    },
    rating: 4.7,
    reviews: 432
  }
];

// === ROUTES ===

// Get all pizzas
app.get('/api/pizzas', (req, res) => {
  res.json({ success: true, data: pizzas });
});

// Get single pizza
app.get('/api/pizzas/:id', (req, res) => {
  const pizza = pizzas.find(p => p.id === req.params.id);
  if (!pizza) return res.status(404).json({ success: false, message: 'Pizza not found' });
  res.json({ success: true, data: pizza });
});

// Place order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items, totalAmount } = req.body;

    const orderId = uuidv4().slice(0, 8).toUpperCase();
    const orderData = {
      orderId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
      status: 'placed',
      estimatedTime: 10,
      placedAt: new Date()
    };

    if (useInMemory || mongoose.connection.readyState !== 1) {
      inMemoryOrders.push(orderData);
      return res.status(201).json({ success: true, data: orderData, message: 'Order placed successfully!' });
    }

    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ success: true, data: order, message: 'Order placed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    if (useInMemory || mongoose.connection.readyState !== 1) {
      const order = inMemoryOrders.find(o => o.orderId === orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    }

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// Update order status (simulate progression)
app.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (useInMemory || mongoose.connection.readyState !== 1) {
      const order = inMemoryOrders.find(o => o.orderId === orderId);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      order.status = status;
      order.updatedAt = new Date();
      return res.json({ success: true, data: order });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    if (useInMemory || mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: inMemoryOrders });
    }
    const orders = await Order.find().sort({ placedAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

app.get('/', (req, res) => res.json({ message: '🍕 Pizza API Running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
