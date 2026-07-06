# Library Docs

Project-specific usage patterns for third-party libraries in PizzaCrave. Only how we use each library in *this* project.

Read the relevant section before implementing any feature that touches these libraries.

---

## Before Using Any Library

1. **Check AGENTS.md** at the project root for installed skills with up-to-date API docs.
2. **Check for a configured MCP server** for the library — use it before general knowledge.
3. **Read this file** for project-specific patterns that override general knowledge.

Order of authority:

```
MCP server (real-time docs) → Skills via AGENTS.md → This file (project rules) → General training knowledge
```

Never rely on general training knowledge alone for library APIs — they change frequently.

---

## Mongoose

### Initialisation

```js
// server/src/config/db.js
import mongoose from 'mongoose';
export const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
```

### Common Operation

```js
// Atomic stock decrement on order create
await Inventory.findByIdAndUpdate(id, { $inc: { stock: -1 } });
```

**Rules:**

- One model per file in `server/src/models/`, PascalCase singular
- Never trust client price — recompute totals from server-side pizza/inventory data
- Inventory decrement must use `$inc` (atomic), never read-modify-write
- Always scope order queries to `req.user._id`
- Always handle errors — never assume the query succeeds

---

## JWT (jsonwebtoken) + bcrypt

### Initialisation

```js
// sign
jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
// verify (middleware)
const payload = jwt.verify(token, process.env.JWT_SECRET);
```

**Rules:**

- Hash passwords with bcrypt, salt rounds ≥ 10 (`BCRYPT_ROUNDS` constant)
- Short access-token expiry; secret only from `JWT_SECRET` env
- `verifyJWT` middleware guards protected routes; `admin` middleware checks `role === 'admin'`
- Block login until `isVerified === true`
- Verify/reset tokens: generate with `crypto`, store the **hashed** token, email the raw token

---

## Razorpay (test mode)

**Check first:** use the Razorpay MCP/skill or current docs before implementing.

### Initialisation

```js
// server/src/config/razorpay.js
import Razorpay from 'razorpay';
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
```

### Flow

```js
// 1. create order (server, amount in paise, priced server-side)
const order = await razorpay.orders.create({ amount, currency: 'INR', receipt });
// 2. client opens Razorpay checkout with order.id + VITE_RAZORPAY_KEY_ID
// 3. verify signature (server)
const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
if (expected !== razorpay_signature) throw new Error('signature mismatch');
```

**Rules:**

- Compute the order amount server-side — never accept the amount from the client
- Always verify the HMAC SHA256 signature server-side before creating the Order + decrementing stock
- `key_secret` is server-only — never expose behind `VITE_`
- Test mode only for v1

---

## Nodemailer

### Initialisation

```js
// server/src/config/mailer.js
import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
```

### Usage

```js
// server/src/services/emailService.js — send verify, reset, low-stock emails
await transporter.sendMail({ from, to, subject, html });
```

**Rules:**

- All send logic lives in `emailService.js` — controllers/jobs call it, never build mail inline
- Verify/reset email links use `CLIENT_URL`
- Low-stock alerts go to `ADMIN_EMAIL`
- Wrap every send in try/catch; log failures with `[email/...]` prefix — a failed email must not crash the request
- Dev: Mailtrap or Gmail SMTP

---

## node-cron

### Usage

```js
// server/src/jobs/stockWatcher.js
import cron from 'node-cron';
cron.schedule(process.env.STOCK_CRON, async () => {
  // scan inventory for stock < threshold → emailService alert → set alertedAt
});
```

**Rules:**

- Schedule from `STOCK_CRON` env (default `0 * * * *`, hourly)
- Debounce with an `alertedAt` flag so the same low item isn't emailed every run
- Wrap the job body in try/catch; log errors — never let a job crash the server

---

## express-validator

**Rules:**

- Validate + sanitize inputs on auth routes (register/login/forgot/reset) and order/payment routes
- Reject invalid input before the controller runs; return the `{ success:false, error }` shape
- Never trust unvalidated client input into Mongoose queries
