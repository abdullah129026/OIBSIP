# Code Standards

Implementation rules and conventions for the entire project. Follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer:

- **Think before implementing** — understand what is being built and why before writing a line
- **Read context files first** — verify against architecture.md and project-overview.md, never assume
- **Scope is sacred** — build only what the current feature requires. See Features Out of Scope in project-overview.md
- **Every feature must be testable** — if it can't be verified right after implementation, it is incomplete
- **Clean over clever** — simple readable code a junior can follow beats clever abstractions
- **One thing at a time** — finish one feature fully before touching the next
- **Failures are expected** — wrap risky ops in try/catch, log failures, never let one failure crash everything

---

## Language

This project is **JavaScript (ES modules)** on both client (React/Vite) and server (Node/Express) — not TypeScript.

- Use `const` by default — `let` only when reassignment is necessary, never `var`
- Prefer async/await over raw promise chains
- All async functions must have error handling — never let a promise float unhandled
- Use destructuring for props and function params where it aids clarity
- Keep functions small and single-purpose

---

## React / Vite Conventions

- Function components with hooks only — no class components
- Data fetching lives in the `client/src/api/` layer; components call those functions, never `axios` directly
- Auth/session state via `AuthContext` — never prop-drill the token
- Route protection via `ProtectedRoute` (user) and `AdminRoute` (admin) wrappers
- One component per file
- Keep pages thin — compose from components in `client/src/components/`
- Read the current React Router / Vite docs before using a router or build API — APIs may differ from training data

---

## Express / Server Conventions

- Layering: `routes` → `middleware` → `controllers` → `models`/`services`. Never skip layers or leak logic upward
- Controllers hold business logic; routes only wire path + middleware + controller
- All third-party clients (Mongo, Razorpay, Nodemailer) init in `config/` and are imported, never re-created inline
- Auth-guarded routes use `verifyJWT`; admin routes add the `admin` middleware
- Read the current Razorpay / Mongoose / Nodemailer docs before using their APIs

---

## File and Folder Naming

- Folders: kebab-case
- React component files: PascalCase (`PizzaCard.jsx`)
- Utility / config / service files: camelCase (`emailService.js`, `token.js`)
- Mongoose model files: PascalCase singular (`User.js`, `Order.js`)
- One component per file — never export multiple components from one file

---

## Component Structure

Order: external imports → internal imports → component (state, derived values, handlers, return).

- Prefer named exports for components
- Props destructured at the top of the component
- No inline styles — all styling via tokens from ui-tokens.md (CSS variables / component CSS)

---

## Handlers / Controllers / Server Logic

- Every controller wrapped in try/catch
- Every controller validates its input before processing (express-validator on auth + order routes)
- Errors logged with a context prefix: `[area/name]` (e.g. `[auth/register]`)
- Return a consistent JSON shape: `{ success: boolean, data?, error? }`
- Never return raw data without the wrapper
- Never expose internal error details to the client — send a human-readable message
- Never trust client price — recompute `totalAmount` server-side
- Verify Razorpay signature server-side before creating an order

---

## Error Handling

- Never use empty catch blocks — always log or handle
- Console errors always include a context prefix: `[component/function name]`
- User-facing errors must be human readable — never expose raw error messages
- Background/cron/job errors go to logs — never surfaced raw to the UI

---

## Events / Analytics

No analytics/event tracking in this project (out of scope). If added later, list every allowed event name here first.

---

## Environment Variables

All server env vars defined in `server/.env` (see `.env.example`). Client env vars in `client/.env` with the `VITE_` prefix. Never hardcode any key, URL, or secret.

| Variable            | Used In                        |
| ------------------- | ------------------------------ |
| `PORT`              | `server.js`                    |
| `MONGO_URI`         | `config/db.js`                 |
| `JWT_SECRET`        | `middleware/auth.js`, token utils |
| `CLIENT_URL`        | CORS config, email links       |
| `RAZORPAY_KEY_ID`   | `config/razorpay.js`, client checkout |
| `RAZORPAY_KEY_SECRET` | `config/razorpay.js`, payment verify |
| `SMTP_HOST`         | `config/mailer.js`             |
| `SMTP_PORT`         | `config/mailer.js`             |
| `SMTP_USER`         | `config/mailer.js`             |
| `SMTP_PASS`         | `config/mailer.js`             |
| `ADMIN_EMAIL`       | `jobs/stockWatcher`, emailService |
| `STOCK_CRON`        | `jobs/stockWatcher`            |
| `VITE_API_URL`      | `client/src/api/index.js`      |
| `VITE_RAZORPAY_KEY_ID` | client Razorpay checkout     |

Only `VITE_`-prefixed vars are exposed to the browser. Never put a secret behind `VITE_` (Razorpay key_secret stays server-only).

---

## Shared Constants

Define magic values once, import everywhere. Examples for this project:

```js
// server/src/utils/constants.js
export const ORDER_STATUS = ['received', 'in_kitchen', 'out_for_delivery', 'delivered'];
export const PAYMENT_STATUS = ['pending', 'paid', 'failed'];
export const INVENTORY_TYPES = ['base', 'sauce', 'cheese', 'veggie'];
export const BCRYPT_ROUNDS = 10;
```

Import the constant everywhere — never hardcode the literal.

---

## Import Aliases

Client may use a `@/` alias to `client/src`. Never use relative imports that climb more than one level (`../../..`).

---

## Comments

- No comments explaining what the code does — code must be self-explanatory
- Comments only for why — a non-obvious decision
- Never leave TODO comments in committed code

---

## Dependencies

Never install a package without a clear reason. Before installing, check: does React/Express already provide it? Is there a simpler native solution?

Approved dependencies:

**Server:** `express`, `mongoose`, `jsonwebtoken`, `bcrypt`, `razorpay`, `nodemailer`, `node-cron`, `express-validator`, `dotenv`, `cors`, `express-rate-limit`

**Client:** `react`, `react-dom`, `react-router-dom`, `axios`

Do not install any other package without updating this list first.
