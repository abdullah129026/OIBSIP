# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, in progress, and next.

---

## Current Status

**Phase:** Phase 5 — Polish
**Last completed:** 14 Polish. Audited client for loading/error/empty-state + responsive gaps (via investigator) — all pages/CSS already covered, navbar drawer < 900px present. Only gap: client-side form validation. Added shared `client/src/utils/validate.js` (`validateEmail`, `validatePassword`, `validateRequired`, `validateNonNegativeInt`) and wired pre-submit guards into Register, Login, Forgot, AdminLogin, Inventory (`handleSave`) and Contact. Made Contact a stateful component (was static, no submission) with validation + success/error alerts (front-end only — contact backend out of scope). Wrote root `README.md` (setup, env tables, tech stack, test flow, security notes). Client build passes clean.
**Prev completed:** 13 Stock Cron + Low-Stock Email. Server: Created `jobs/stockWatcher.js` using `node-cron` to scan inventory items where stock < threshold and `alertedAt` is null. Wired it into `server.js` on startup.

**Prev (12):** 12 Admin Order Panel. Server: `getAllOrders` + `updateOrderStatus` in `orderController.js`, wired `GET /api/orders` + `PATCH /api/orders/:id/status`. Client: `fetchAllOrders` + `updateOrderStatus`, built `Orders.jsx`.

**Next:** Build complete — all 14 features done. Manual end-to-end QA + deploy config remain.

---

## Progress

### Phase 1 — Foundation

- [x] 01 Scaffold + App Shell
- [x] 02 Database Models + Seed
- [x] 03 Auth (backend)
- [x] 04 Frontend Auth Pages

### Phase 2 — Marketing Site

- [x] 05 Landing Page — Full UI
- [x] 06 Menu / About / Contact / Locations — Full UI

### Phase 3 — Ordering

- [x] 07 Dashboard + Pizza Builder — Full UI
- [x] 08 Builder + Pizzas — Logic
- [x] 09 Payment — Logic
- [x] 10 Order Tracking — Logic

### Phase 4 — Admin + Automation

- [x] 11 Admin Login + Inventory
- [x] 12 Admin Order Panel
- [x] 13 Stock Cron + Low-Stock Email

### Phase 5 — Polish

- [x] 14 Polish

---

## Decisions Made During Build

- Stack is JavaScript (ES modules), not TypeScript, on both client and server.
- Real-time order status uses polling (~5s) for v1; Socket.IO deferred (out of scope).
- Strict color rule: all red/maroon/brown/light-red in mockups render as `--color-primary` — warm orange `#FF9800` (changed from light red `#E4572E` per client request).

---

## Notes

- Builder/pizza prices are stored on Inventory in the same `$` scale the UI already shows (base $5, toppings <$3), not INR — keeps the existing UI unchanged. Razorpay currency handling deferred to 09.
- Inventory model gained a required `price` field (default 0). Re-run `node src/utils/seed.js` to repopulate with prices before testing the builder.
- Builder option emoji is a client concern (per-type map in PizzaBuilder), not stored on Inventory.
- Draft order (selection + priced rows) persists in sessionStorage via `utils/draftOrder.js`; OrderSummary reads it, redirects to /builder when absent. Payment (09) will recompute the authoritative total server-side from the selection — client price is display-only.
