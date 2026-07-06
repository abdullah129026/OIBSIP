# 🍕 PizzaCrave

> _est. 2024 · Fresh, hot, and delicious · delivered to your door!_

A production-grade, full-stack pizza ordering and delivery platform. Customers register, verify their email, build a custom pizza through a 4-step wizard, pay via Razorpay (test mode), and track their order status in real time. Admins manage inventory and order fulfillment through a separate portal, with automated low-stock email alerts.

Built as **OIBSIP Web Development — Level 3**.

---

## ✨ Features

**Customer**
- Registration with email verification (JWT auth, bcrypt-hashed passwords)
- Forgot / reset password via emailed token
- Marketing site — landing, menu, about, contact, locations
- Dashboard with pizza varieties + live order tracking
- 4-step custom pizza builder (base → sauce → cheese → veggies) with running price
- Order summary + checkout, Razorpay payment (server-verified signature)
- Real-time order status via polling (~5s): Received → In Kitchen → Out for Delivery → Delivered

**Admin**
- Separate admin login (role-gated)
- Grouped inventory dashboard with manual stock updates
- Order management panel with per-order status dropdown
- Automated low-stock email alerts (`node-cron` + Nodemailer)

Every price is recomputed and trusted **server-side** — never from the client.

---

## 🛠 Tech Stack

| Layer          | Tool                              |
| -------------- | --------------------------------- |
| Frontend       | React 18 (Vite) + React Router 6  |
| HTTP client    | Axios (auth interceptor)          |
| State          | Context API (`AuthContext`)       |
| Backend        | Node.js + Express 4               |
| Database       | MongoDB + Mongoose 8              |
| Auth           | JWT + bcrypt                      |
| Payment        | Razorpay (test mode)              |
| Email          | Nodemailer (SMTP / Mailtrap)      |
| Scheduled jobs | node-cron (low-stock watcher)     |
| Validation     | express-validator                 |

Styling: plain CSS with design tokens (CSS custom properties) — no hardcoded colors.

---

## 📁 Project Structure

```
Webdev-L3-PizzaDeliverysystem/
├── context/            → design + build context docs
├── server/
│   └── src/
│       ├── config/     → db, razorpay, mailer clients
│       ├── models/     → User, Pizza, Inventory, Order
│       ├── middleware/ → auth (verifyJWT), admin, error, validate
│       ├── controllers/→ auth, pizza, order, inventory, payment
│       ├── routes/     → route wiring per resource
│       ├── services/   → emailService, pricingService
│       ├── jobs/       → stockWatcher (node-cron)
│       └── utils/      → token, seed, constants
└── client/
    └── src/
        ├── api/        → axios instance + endpoint fns (only layer that talks to backend)
        ├── context/    → AuthContext
        ├── components/ → Navbar, Footer, PizzaCard, StepBuilder, StatusBadge, …
        ├── pages/      → user/ + admin/
        ├── routes/     → ProtectedRoute, AdminRoute
        └── styles/     → tokens.css + per-component css
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a connection string)
- Razorpay test account (key id + secret)
- SMTP credentials (Mailtrap recommended for dev)

### 1. Server

```bash
cd server
npm install
cp .env.example .env      # then fill in real values
npm run seed              # seed inventory, pizzas, admin user
npm run dev               # starts on http://localhost:5000
```

### 2. Client

```bash
cd client
npm install
cp .env.example .env      # then fill in real values
npm run dev               # starts on http://localhost:5173
```

Open http://localhost:5173.

---

## 🔑 Environment Variables

**server/.env**

| Variable              | Purpose                          |
| --------------------- | -------------------------------- |
| `PORT`                | API port (default 5000)          |
| `CLIENT_URL`          | CORS origin + email link base    |
| `MONGO_URI`           | MongoDB connection string        |
| `JWT_SECRET`          | JWT signing secret               |
| `RAZORPAY_KEY_ID`     | Razorpay test key id             |
| `RAZORPAY_KEY_SECRET` | Razorpay secret (server-only)    |
| `SMTP_HOST/PORT/USER/PASS` | Nodemailer transport        |
| `ADMIN_EMAIL`         | Low-stock alert recipient + seeded admin login |
| `ADMIN_PASSWORD`      | Seeded admin password            |
| `STOCK_CRON`          | Low-stock scan schedule (default hourly) |

**client/.env**

| Variable               | Purpose                       |
| ---------------------- | ----------------------------- |
| `VITE_API_URL`         | Backend API base URL          |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key (checkout)|

> Only `VITE_`-prefixed vars reach the browser. The Razorpay secret stays server-only.

---

## 🧪 Test the Full Flow

1. Register → check the verification email (Mailtrap inbox) → click link → account verified.
2. Log in → land on the dashboard.
3. Open the builder → pick base/sauce/cheese/veggies → review summary.
4. Pay with a Razorpay [test card](https://razorpay.com/docs/payments/payments/test-card-details/) → order created, stock decremented.
5. Admin login (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) → change the order status → the user dashboard reflects it within one poll interval.
6. Drop an item below its threshold → the cron watcher emails `ADMIN_EMAIL`.

---

## 🔒 Security Notes

- Passwords bcrypt-hashed; login blocked until email is verified.
- JWT-guarded routes (`verifyJWT`); admin routes add a role gate.
- Order amounts recomputed server-side; Razorpay HMAC SHA256 signature verified before any order is created.
- Order queries always scoped to the authenticated user.
- CORS locked to `CLIENT_URL`; auth routes rate-limited.

---

## 📜 Scripts

**server:** `npm run dev` · `npm start` · `npm run seed`
**client:** `npm run dev` · `npm run build` · `npm run preview`
