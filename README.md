# 🍕 PizzaMania — Full-Stack Pizza E-Commerce App

A complete, production-ready pizza ordering app with real-time order tracking and a 10-minute countdown timer.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v6, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (with in-memory fallback) |
| **Fonts** | Playfair Display + DM Sans (Google Fonts) |

---

## 📁 Project Structure

```
pizza-app/
├── backend/
│   ├── server.js          # Express API server
│   ├── .env.example       # Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx         # Navigation with cart button
    │   │   ├── CartSidebar.jsx    # Sliding cart panel
    │   │   ├── PizzaCard.jsx      # Pizza menu item card
    │   │   └── OrderToast.jsx     # 10-min countdown toast 🔥
    │   ├── pages/
    │   │   ├── MenuPage.jsx       # Pizza menu with filters
    │   │   ├── CheckoutPage.jsx   # Order form + summary
    │   │   ├── TrackOrderPage.jsx # Real-time order tracking
    │   │   └── OrdersPage.jsx     # Order history
    │   ├── context/
    │   │   ├── CartContext.jsx    # Global cart state
    │   │   └── ToastContext.jsx   # Notifications
    │   └── services/
    │       └── api.js             # Axios API calls
    └── tailwind.config.js
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB (optional — app works with in-memory fallback)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Configure Backend (optional)

```bash
cd backend
cp .env.example .env
# Edit .env — set your MongoDB URI (or leave default for local MongoDB)
```

### 3. Start the App

**Terminal 1 — Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

---

## 🎯 Features

### 🛍️ Menu Page
- 8 artisan pizzas with descriptions, ratings, and tags
- Filter by category: Classic, Non-Veg, Veg, Seafood, Premium
- Search by name or ingredients
- Size selector (Small/Medium/Large) with dynamic pricing
- Add to cart with animated feedback

### 🛒 Cart
- Sliding sidebar cart panel
- Adjust quantities, remove items
- Persistent cart (localStorage)
- Real-time total calculation

### 📝 Checkout
- Customer details form with validation
- Order summary preview
- COD payment method
- Places order via API (with fallback if backend is offline)

### ⏱️ Order Toast (The Star Feature!)
After placing an order, a **floating toast appears** in the bottom-right corner with:
- **Circular countdown timer** — 10:00 → 0:00 with animated SVG ring
- **Color-coded progress** — Orange → Amber → Red as time runs out
- **Status messages** that update dynamically (Confirmed → Prepping → Baking → Delivering!)
- **4-step progress indicator** with connecting progress bar
- **"Track Order"** button to jump to full tracking page
- Persists until dismissed or timer ends

### 📍 Order Tracking
- Enter order ID to track any order
- **Circular SVG timer** synced to actual order placement time
- Real-time status timeline (Placed → Preparing → Baking → Out for Delivery → Delivered)
- Auto-status progression simulated in frontend
- Full order breakdown with items & total

### 📋 Order History
- View all past orders from localStorage
- Status badges with color coding
- Click any order to track it
- Items preview

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pizzas` | Get all pizzas |
| GET | `/api/pizzas/:id` | Get single pizza |
| POST | `/api/orders` | Place new order |
| GET | `/api/orders/:orderId` | Get order by ID |
| GET | `/api/orders` | Get all orders |
| PATCH | `/api/orders/:orderId/status` | Update order status |

### Sample Order Request
```json
POST /api/orders
{
  "customerName": "Rahul Sharma",
  "customerPhone": "9876543210",
  "customerAddress": "42, MG Road, Bengaluru",
  "items": [
    {
      "pizzaId": "p1",
      "name": "Margherita Classic",
      "size": "medium",
      "price": 299,
      "quantity": 2
    }
  ],
  "totalAmount": 598
}
```

---

## 🎨 Design System

| Variable | Value |
|----------|-------|
| Primary | `#ea580c` (Orange 600) |
| Accent | `#e63946` (Ember Red) |
| Background | `#fdf6ec` (Warm Cream) |
| Display Font | Playfair Display (serif) |
| Body Font | DM Sans (sans-serif) |
| Mono Font | JetBrains Mono |

---

## 🌐 MongoDB Atlas Setup (Production)

1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Add to `.env`:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/pizzaapp
   ```

> ⚠️ **Note:** The app works perfectly without MongoDB — it automatically falls back to in-memory storage when the database isn't connected.

---

## 📱 Responsive Design
- Mobile-first layout
- Collapsible navbar on small screens
- Cart sidebar is full-width on mobile
- Touch-friendly buttons and inputs

---

Built with ❤️ using React + Node.js + MongoDB + Tailwind CSS
