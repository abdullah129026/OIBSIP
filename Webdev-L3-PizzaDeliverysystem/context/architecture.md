# Architecture

## Stack

| Layer          | Tool                          | Purpose                                        |
| -------------- | ----------------------------- | ---------------------------------------------- |
| Frontend       | React.js (Vite) + React Router | SPA — user + admin portals                     |
| HTTP client    | Axios                         | API calls with auth interceptor                |
| State          | Context API (AuthContext)     | Auth/session state                             |
| Backend        | Node.js + Express.js          | REST API                                        |
| Database       | MongoDB + Mongoose            | Users, pizzas, inventory, orders               |
| Auth           | JWT + bcrypt                  | Access token, password hashing                 |
| Payment        | Razorpay (test mode)          | Order create + signature verify                |
| Email          | Nodemailer (SMTP/Mailtrap)    | Verify, reset, low-stock alerts                |
| Scheduled jobs | node-cron                     | Low-stock inventory watcher                    |
| Validation     | express-validator            | Input validation/sanitization on auth + orders |
| Config         | dotenv                        | Env var loading                                |
| Real-time      | Polling (v1)                  | Order status refresh (~5s)                     |

---

## Folder Structure

```
Webdev-L3-PizzaDeliverysystem/
├── AGENTS.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   └── progress-tracker.md
├── server/
│   ├── src/
│   │   ├── config/          → db.js, razorpay.js, mailer.js  (client init)
│   │   ├── models/          → User, Pizza, Inventory, Order  (Mongoose schemas)
│   │   ├── middleware/      → auth.js (verifyJWT), admin.js, error.js
│   │   ├── controllers/     → auth, pizza, order, inventory, payment (business logic)
│   │   ├── routes/          → authRoutes, pizzaRoutes, orderRoutes, inventoryRoutes, paymentRoutes
│   │   ├── services/        → emailService, stockService
│   │   ├── jobs/            → stockWatcher (node-cron)
│   │   ├── utils/           → token.js, seed.js
│   │   └── app.js           → express app assembly
│   ├── server.js            → entry, DB connect + listen
│   ├── .env.example
│   └── package.json
└── client/
    ├── src/
    │   ├── api/             → axios instance + endpoint fns
    │   ├── context/         → AuthContext
    │   ├── components/      → Navbar, PizzaCard, StepBuilder, StatusBadge, Footer
    │   ├── pages/
    │   │   ├── user/        → Register, Login, Verify, Forgot, Reset, Dashboard, PizzaBuilder, OrderSummary
    │   │   └── admin/       → AdminLogin, Inventory, Orders
    │   ├── routes/          → ProtectedRoute, AdminRoute
    │   ├── styles/          → global tokens + component css
    │   └── App.jsx
    ├── vite.config.js
    └── package.json
```

---

## System Boundaries

| Folder              | Owns                                                                        |
| ------------------- | -------------------------------------------------------------------------- |
| `client/pages`      | Pages / routes only. No direct API/business logic beyond calling `api/`.   |
| `client/components` | UI only. No data fetching except via passed props / `api/` handlers.       |
| `client/api`        | Axios instance + endpoint functions. Only place that talks to the backend. |
| `client/context`    | Session/auth state only.                                                    |
| `server/controllers`| Business / mutation logic only. No route wiring, no direct client concerns. |
| `server/routes`     | Route → middleware → controller wiring only. No business logic.            |
| `server/models`     | Mongoose schemas only.                                                      |
| `server/config`     | Third-party client init (DB, Razorpay, mailer). No business logic.         |
| `server/middleware` | Cross-cutting request logic (auth, admin gate, error handler).             |
| `server/services`   | Reusable side-effect logic (email, stock).                                 |

---

## Data Flow

### Order + Payment flow

```
User builds pizza + confirms summary
        ↓
POST /api/payment/create-order  → Razorpay order created (server-priced)
        ↓
Razorpay checkout opens (client) → user pays
        ↓
POST /api/payment/verify  → HMAC SHA256 signature verified server-side
        ↓
POST /api/orders  → Order persisted, inventory $inc decremented atomically
        ↓
Client polls GET /api/orders/mine every ~5s for live status
```

### Auth flow

```
POST /api/auth/register
        ↓
User created (bcrypt hash) + crypto verify token stored (hashed)
        ↓
Nodemailer sends verify link → GET /api/auth/verify/:token
        ↓
isVerified = true → login allowed → POST /api/auth/login → JWT
```

### Background stock-watcher flow

```
node-cron (STOCK_CRON schedule)
        ↓
stockService scans inventory for stock < threshold
        ↓
emailService → Nodemailer alert to ADMIN_EMAIL
        ↓
set alertedAt flag (debounce, avoid repeat spam)
```

---

## Database Schema

### `users`

| Column            | Type     | Notes                              |
| ----------------- | -------- | ---------------------------------- |
| _id               | ObjectId | Primary key                        |
| name              | String   |                                    |
| email             | String   | Unique                             |
| password          | String   | bcrypt hash                        |
| role              | String   | `'user'` \| `'admin'` (default user)|
| isVerified        | Boolean  | Default false; blocks login        |
| verifyToken       | String   | Hashed crypto token                |
| verifyTokenExpiry | Date     |                                    |
| resetToken        | String   | Hashed crypto token                |
| resetTokenExpiry  | Date     |                                    |
| createdAt         | Date     |                                    |

### `inventory`

| Column    | Type   | Notes                                        |
| --------- | ------ | -------------------------------------------- |
| _id       | ObjectId | Primary key                                |
| type      | String | `'base'`\|`'sauce'`\|`'cheese'`\|`'veggie'`  |
| name      | String | e.g. "Thin Crust"                            |
| stock     | Number | Current quantity                             |
| threshold | Number | Low-stock alert level (configurable)         |
| unit      | String | `'units'`                                    |
| alertedAt | Date   | Debounce flag for low-stock email            |

### `pizzas`

| Column      | Type    | Notes                       |
| ----------- | ------- | --------------------------- |
| _id         | ObjectId| Primary key                 |
| name        | String  |                             |
| description | String  |                             |
| price       | Number  |                             |
| image       | String  |                             |
| isCustom    | Boolean | Default false               |

### `orders`

| Column          | Type     | Notes                                                           |
| --------------- | -------- | -------------------------------------------------------------- |
| _id             | ObjectId | Primary key                                                    |
| user            | ObjectId | Ref users                                                      |
| items           | Array    | `[{ base, sauce, cheese, veggies:[String], price }]`          |
| totalAmount     | Number   | Recomputed server-side                                        |
| paymentId       | String   | Razorpay payment id                                           |
| razorpayOrderId | String   |                                                               |
| paymentStatus   | String   | `'pending'`\|`'paid'`\|`'failed'`                             |
| status          | String   | `'received'`\|`'in_kitchen'`\|`'out_for_delivery'`\|`'delivered'`|
| createdAt       | Date     |                                                               |
| updatedAt       | Date     |                                                               |

---

## Authentication

- Provider: custom JWT (jsonwebtoken) + bcrypt
- Methods: email + password; email verification required before login
- Protected routes (user): `/dashboard`, `/builder`, `/order-summary`, `GET /api/auth/me`, `GET/POST /api/orders/mine`, `/api/orders`, `/api/payment/*`
- Admin routes: `/admin/*`, `GET /api/orders`, `PATCH /api/orders/:id/status`, `/api/inventory`, `PATCH /api/inventory/:id` — gated by `role === 'admin'`
- Public routes: landing, menu, about, contact, locations, register, login, verify, forgot/reset
- Session handling: JWT stored client-side (localStorage or httpOnly cookie), attached via Axios interceptor; `verifyJWT` middleware guards server routes
- On login → redirect to `/dashboard` (user) or `/admin/inventory` (admin)

---

## Client / SDK Patterns

```js
// server/src/config/db.js — Mongoose singleton
mongoose.connect(process.env.MONGO_URI)

// server/src/config/razorpay.js
new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

// server/src/config/mailer.js — Nodemailer transport
nodemailer.createTransport({ host: SMTP_HOST, port: SMTP_PORT, auth: { user: SMTP_USER, pass: SMTP_PASS } })

// client/src/api/index.js — Axios instance with token interceptor
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
api.interceptors.request.use(cfg => { const t = getToken(); if (t) cfg.headers.Authorization = `Bearer ${t}`; return cfg })
```

---

## Invariants

- Routes contain no business logic. Controllers contain no route wiring. Components contain no direct DB/API logic beyond the `api/` layer.
- `client/pages` never imports Mongoose or server code; `server/routes` never imports React.
- All DB writes go through Mongoose models in controllers/services — never from client.
- Never trust client-supplied price — always recompute `totalAmount` server-side.
- Always verify the Razorpay signature (HMAC SHA256) server-side before creating an order.
- Block login until `isVerified === true`.
- Inventory decrement on order create must be atomic (`$inc`).
- Every external/async op (DB, Razorpay, mail) wrapped in try/catch and logged with a `[area/name]` prefix.
- Always scope order queries to the current user (`req.user._id`) — never return another user's orders.
- No hardcoded colors or magic values in components — use tokens from ui-tokens.md.
- CORS locked to `CLIENT_URL`; auth routes rate-limited.
