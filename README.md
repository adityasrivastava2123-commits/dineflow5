# 🍽️ DineFlow — Restaurant OS

> A complete multi-tenant restaurant SaaS platform built with React, Node.js, MongoDB, Socket.io, Razorpay, and Cloudinary.

---

## ✨ Features

- **QR Table Ordering** — Customers scan, browse, add to cart, pay
- **Kitchen Display System** — Live order queue, sound alerts, timers, kanban board
- **Multi-tenant Architecture** — One codebase, unlimited restaurants
- **Real-time Updates** — Socket.io for live order status
- **Razorpay Payments** — UPI, Cards, Net Banking
- **Loyalty Points** — Earn 1pt/₹10, redeem at checkout
- **WhatsApp Alerts** — via CallMeBot API (free)
- **GST Invoice PDFs** — Professional, restaurant-branded
- **Analytics Dashboard** — Revenue trends, heatmap, top dishes
- **Progressive Web App** — Installable, offline-ready, push notifications
- **Multi-language** — Hindi + English toggle
- **Dark Mode** — Customer menu follows system preference
- **Subscription Billing** — Self-service with Razorpay

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Razorpay account (test keys for dev)
- Cloudinary account
- CallMeBot WhatsApp API key (free)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/dineflow.git
cd dineflow

# Server
cd server && npm install
cp .env.example .env  # fill in your values

# Client
cd ../client && npm install
cp .env.example .env  # fill in your values
```

### 2. Configure Environment

**server/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dineflow
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_APP_URL=http://localhost:5173
```

### 3. Create SuperAdmin

```bash
# Run this once to create the superadmin account
cd server
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.create({ name: 'Super Admin', email: 'super@dineflow.app', password: 'admin123', role: 'superadmin' });
  console.log('SuperAdmin created: super@dineflow.app / admin123');
  process.exit(0);
});
"
```

### 4. Run

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Open http://localhost:5173

---

## 🗂️ Project Structure

```
dineflow/
├── server/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express API routes
│   ├── middleware/       # Auth middleware
│   ├── services/        # WhatsApp, etc.
│   ├── index.js         # Entry point + Socket.io
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── customer/    # Menu, Checkout, Tracking
│   │   │   ├── admin/       # Full admin panel
│   │   │   ├── kitchen/     # Kitchen Display System
│   │   │   ├── superadmin/  # Super admin panel
│   │   │   ├── mobile/      # PWA mobile apps
│   │   │   └── landing/     # Marketing page
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth, Cart, Socket contexts
│   │   ├── services/        # API service layer
│   │   └── App.jsx          # Routes
│   ├── public/
│   │   ├── manifest.json    # PWA manifest
│   │   └── sw.js            # Service worker
│   └── package.json
├── render.yaml              # Render deployment
└── vercel.json              # Vercel deployment
```

---

## 🔗 Key Routes

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/register` | Restaurant signup |
| `/login` | Staff login |
| `/restaurant/:slug?table=N` | Customer menu (QR link) |
| `/r/:slug` | Public restaurant profile |
| `/checkout` | Order checkout |
| `/order/:id` | Live order tracking |
| `/admin` | Admin dashboard |
| `/admin/menu` | Menu management |
| `/admin/orders` | Order management |
| `/admin/analytics` | Sales analytics |
| `/admin/subscription` | Plan & billing |
| `/kitchen` | Kitchen Display System |
| `/superadmin` | Super admin panel |
| `/kitchen-app` | Mobile KDS (PWA) |
| `/admin-app` | Mobile admin (PWA) |

---

## 🚢 Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set root directory to `client`
3. Add environment variables
4. Deploy

### Backend → Render
1. Connect GitHub repo to Render
2. Set root directory to `server`
3. Add environment variables
4. Deploy

### Database → MongoDB Atlas
1. Create free cluster
2. Get connection string
3. Add to `MONGODB_URI`

---

## 💳 Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| Trial | Free/30 days | Basic features, 5 tables |
| Basic | ₹999/mo | 20 tables, analytics, WhatsApp |
| Standard | ₹1999/mo | Unlimited tables, KDS, inventory, loyalty |
| Premium | ₹3999/mo | Multi-branch, GST reports, white label |

---

## 📱 PWA Installation

1. Open `/kitchen-app` on Android Chrome
2. Tap "Add to Home Screen"
3. Works offline, receives push notifications

---

## 🧑‍🍳 Demo Credentials

After running the seed script:
- **SuperAdmin:** super@dineflow.app / admin123
- Register a new restaurant at `/register` for admin access

---

## 📞 WhatsApp Notifications Setup

1. Send a WhatsApp to +34 644 59 72 48 saying: `I allow callmebot to send me messages`
2. Get your API key from the reply
3. Add to restaurant settings: WhatsApp Number + API Key

---

Built with ❤️ for Indian restaurants | [DineFlow](https://dineflow.app)
