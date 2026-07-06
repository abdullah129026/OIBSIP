# Build Plan

Phased, numbered feature plan for PizzaCrave.

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

---

## How to Use This File

1. Features are grouped into phases and numbered sequentially.
2. Each feature lists **UI** (what the user sees) and **Logic** (what gets wired).
3. Build UI-with-mock-data before logic; finish one feature fully before the next.
4. Mirror this numbering in progress-tracker.md.

---

## Phase 1 — Foundation

### 01 Scaffold + App Shell

**UI:**

- Vite React app, global token stylesheet (ui-tokens.md), fonts loaded (Playfair, Poppins, Inter)
- Navbar (transparent, white center pill, active pill) + both Footer variants
- Route skeleton for all pages with placeholders

**Logic:**

- React Router setup, `ProtectedRoute` + `AdminRoute` wrappers (stubbed)
- Axios instance in `client/src/api/` with token interceptor
- Express app scaffold, CORS locked to `CLIENT_URL`, dotenv, DB connect

---

### 02 Database Models + Seed

**Logic:**

- Mongoose models: User, Pizza, Inventory, Order (per architecture.md schema)
- Seed script: bases/sauces/cheeses/veggies inventory, predefined pizzas, one admin user
- Shared constants (ORDER_STATUS, PAYMENT_STATUS, INVENTORY_TYPES)

---

### 03 Auth (backend)

**Logic:**

- Register (+ crypto verify token, hashed, email link), email verify, login → JWT
- `verifyJWT` middleware, `admin` middleware
- Forgot password + reset (token + expiry), bcrypt hashing
- express-validator on all auth routes, rate limiting
- Nodemailer emailService (verify + reset templates)

---

### 04 Frontend Auth Pages

**UI:**

- Register, Login, Verify, Forgot, Reset pages (token-styled forms, empty/error states)

**Logic:**

- AuthContext (store JWT, current user, login/logout)
- Wire pages to `/api/auth/*`; enforce `ProtectedRoute`; post-login redirect (user → `/dashboard`, admin → `/admin/inventory`)

---

## Phase 2 — Marketing Site

### 05 Landing Page — Full UI

Complete landing UI with mock data (hero, Today's Best Deals, Customer Favorites, builder promo, Our Regular Flavoures, Made with Love, How It Works, testimonials, Footer A). No logic.

### 06 Menu / About / Contact / Locations — Full UI

Menu, About, Contact (form UI only), Locations pages with mock data + Footer B. Shopping Cart page restyled to PizzaCrave (orange + gold).

---

## Phase 3 — Ordering

### 07 Dashboard + Pizza Builder — Full UI

**UI:**

- Dashboard pizza list (PizzaCard grid, mock data)
- 4-step StepBuilder wizard: Base → Sauce → Cheese → Veggies, running price
- Order Summary review page

### 08 Builder + Pizzas — Logic

**Logic:**

- `GET /api/pizzas`, `GET /api/inventory/options` → populate dashboard + builder
- Accumulate selection in state, compute price
- Server recomputes total on submit

### 09 Payment — Logic

**Logic:**

- `POST /api/payment/create-order` (server-priced Razorpay order)
- Client checkout → `POST /api/payment/verify` (HMAC signature)
- On verify → `POST /api/orders` creates Order + atomic stock `$inc` decrement

### 10 Order Tracking — Logic

**UI:** StatusBadge on user dashboard.

**Logic:**

- `GET /api/orders/mine`, poll every ~5s
- Badge: Received → In Kitchen → Out for Delivery → Delivered

---

## Phase 4 — Admin + Automation

### 11 Admin Login + Inventory

**UI:** AdminLogin page, grouped inventory stock table, manual update form.

**Logic:**

- `POST /api/auth/admin/login` (role check), `AdminRoute`
- `GET /api/inventory`, `PATCH /api/inventory/:id`

### 12 Admin Order Panel

**UI:** All-orders list with per-order status dropdown.

**Logic:**

- `GET /api/orders`, `PATCH /api/orders/:id/status` → reflected on user dashboard via polling

### 13 Stock Cron + Low-Stock Email

**Logic:**

- `node-cron` stockWatcher (STOCK_CRON) scans `stock < threshold`
- Nodemailer alert to `ADMIN_EMAIL`, debounce via `alertedAt`

---

## Phase 5 — Polish

### 14 Polish

Validation coverage, error/loading states, empty states, responsive passes (nav drawer, stacked grids), README.

---

## Feature Count

| Phase                     | Features |
| ------------------------- | -------- |
| Phase 1 — Foundation      | 4        |
| Phase 2 — Marketing Site  | 2        |
| Phase 3 — Ordering        | 4        |
| Phase 4 — Admin + Automation | 3     |
| Phase 5 — Polish          | 1        |
| **Total**                 | **14**   |
