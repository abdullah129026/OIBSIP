# Project Overview

## About the Project

**PizzaCrave** is a production-grade, full-stack pizza ordering and delivery platform. Customers register, verify email, browse pizzas, build a custom pizza through a 4-step wizard, pay via Razorpay (test mode), and track their order status in real time. Admins manage inventory and order fulfillment through a separate portal, with automated low-stock email alerts.

Brand tagline: _"est. 2024 · Fresh, hot, and delicious · delivered to your door!"_

---

## The Problem It Solves

Removes the friction of ordering custom pizza online: no more phone calls, manual price math, or blind waiting. Customers get a guided builder, transparent pricing, secure payment, and live order tracking. Admins get real-time inventory control and automatic restock alerts instead of manual stock audits.

---

## Pages

```
/                         → Landing (Home) — hero, deals, favorites, builder promo, flavours, testimonials
/menu                     → Full pizza menu (classic, specialty, sides & drinks)
/about                    → About Us — origins, philosophy, community
/contact                  → Contact form + details + support
/locations                → Store locations + map
/cart                     → Shopping cart
/checkout                 → Delivery, payment, tip, order summary
/register                 → User registration
/login                    → User login
/verify/:token            → Email verification
/forgot-password          → Request password reset
/reset-password/:token    → Set new password
/dashboard                → User dashboard — pizza list + order tracking
/builder                  → Custom pizza builder (4-step wizard)
/order-summary            → Review selection before payment
/admin/login              → Admin login (separate)
/admin/inventory          → Admin inventory dashboard
/admin/orders             → Admin order management panel
```

---

## Navigation

Top navbar on all public pages. Transparent over hero image. Logo **PizzaCrave** left (orange text). Center: white rounded pill holding nav links — Home ▾ · Menu ▾ · Locations ▾ · About Us ▾ · Contact ▾. Active link = orange pill. Right: circular search + circular account/avatar buttons. Collapses to hamburger drawer below 900px. Max content width ~1140–1200px, centered.

---

## Core User Flow

### Onboarding

- Register with name, email, password
- Receive verification email, click link → account verified
- Login → JWT issued → redirected to dashboard
- (Forgot password → email reset link → set new password)

### Order

- Browse dashboard pizza varieties or open custom builder
- Builder step 1: Base (single-select, 5 options)
- Builder step 2: Sauce (single-select, 5 options)
- Builder step 3: Cheese (single-select)
- Builder step 4: Veggies (multi-select)
- Review order summary + total
- Pay via Razorpay checkout → signature verified server-side
- Order created, inventory decremented
- Track live status: Received → In Kitchen → Out for Delivery → Delivered (polling ~5s)

### Admin

- Login via separate admin route (role check)
- View grouped inventory stock table
- Manually update stock
- View all orders, change status via dropdown
- Receive low-stock email alerts (cron)

---

## Data Architecture

### User

- Lives in MongoDB `users` collection
- Changes on register, verify, login, password reset
- Holds role (`user`/`admin`), verification + reset tokens

### Inventory

- Lives in `inventory` collection, per-item docs grouped by type (base/sauce/cheese/veggie)
- Decremented atomically on order create; updated manually by admin
- `threshold` drives low-stock alerts

### Pizza

- Lives in `pizzas` collection — predefined varieties for dashboard/menu
- Read-only from user side

### Order

- Lives in `orders` collection, owned by a user
- Created after payment verification; status mutated by admin only
- Never mutate price from client — recomputed server-side

---

## Features In Scope

- Registration + email verification
- JWT auth, forgot/reset password
- Pizza dashboard + 4-step custom builder
- Order summary + Razorpay payment (test mode)
- Order creation + automatic stock decrement
- Real-time order status tracking (polling)
- Admin login, inventory dashboard, manual stock update
- Admin order panel with status updates
- node-cron low-stock watcher + Nodemailer alerts
- Full marketing site (landing, menu, about, contact, locations)

---

## Features Out of Scope

- Live chat / real-time WebSocket status (v1 uses polling)
- Multiple payment providers beyond Razorpay
- Delivery driver GPS tracking
- Loyalty / rewards / coupons backend (cart shows UI only)
- Mobile native app
- Multi-language / i18n
- Social login (OAuth)
- Order history analytics / reporting dashboards

---

## Target User

Hungry customers who want to order and customize pizza online with minimal friction, on desktop or mobile. Comfortable with basic web checkout. Admin users are staff managing kitchen inventory and order fulfillment.

---

## Success Criteria

- Register → verify email → login → reach protected dashboard
- Build pizza → summary → Razorpay test card → order created, stock dropped
- Admin changes order status → user dashboard reflects within poll interval
- Item drops below threshold → cron fires → admin receives email
- Every price is recomputed and trusted server-side, never from client
- All pages responsive down to mobile
