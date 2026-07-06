# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes/tokens
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — record its name, file path, and the tokens/classes it uses.

---

## Planned Components

> Not yet built. These are the components the build plan requires; move each into "Components" below once implemented.

| Component      | Planned path                              | Purpose                                             |
| -------------- | ----------------------------------------- | --------------------------------------------------- |
| Navbar         | `client/src/components/Navbar.jsx`        | Transparent top nav, white center pill, active pill |
| Footer         | `client/src/components/Footer.jsx`        | Variants A (brand) and B (compact)                  |
| PizzaCard      | `client/src/components/PizzaCard.jsx`     | Product card — image overlap, badge, rating, price  |
| StepBuilder    | `client/src/components/StepBuilder.jsx`   | 4-step wizard shell (base/sauce/cheese/veggies)     |
| StatusBadge    | `client/src/components/StatusBadge.jsx`   | Order status pill (received → delivered)            |
| Button         | `client/src/components/Button.jsx`        | Primary / secondary / gold variants                 |
| Input          | `client/src/components/Input.jsx`         | Token-styled form field                             |
| Badge          | `client/src/components/Badge.jsx`         | Veg/popularity + soft badges                        |
| DealsBanner    | `client/src/components/DealsBanner.jsx`   | Orange marble banner + gold→orange offer rows    |
| ProtectedRoute | `client/src/routes/ProtectedRoute.jsx`    | User auth gate                                       |
| AdminRoute     | `client/src/routes/AdminRoute.jsx`        | Admin role gate                                      |

---

## Components

| Component   | Path                                    | Tokens / classes used                                                                 |
| ----------- | --------------------------------------- | ------------------------------------------------------------------------------------- |
| Navbar      | `client/src/components/Navbar.jsx`      | `.navbar`, `.navbar-pill`, `.navbar-link.active` (→ `--color-primary`), `.navbar-circle`; styles in `styles/navbar.css`. Transparent over hero, white center pill, active = orange pill, collapses < 900px. |
| Footer      | `client/src/components/Footer.jsx`      | Variants A (brand) + B (compact) via `variant` prop. `.footer` bg `--color-primary`, `.footer-wordmark` uses `--gradient-gold-btn` clip, `--gradient` newsletter; styles in `styles/footer.css`. |
| Layout      | `client/src/components/Layout.jsx`      | Route-level shell: Navbar + `<Outlet/>` + Footer. Props `footer` ('A'\|'B'), `hero` (spacer). |
| Placeholder | `client/src/components/Placeholder.jsx` | `.page-placeholder`, `.text-muted` via `styles/placeholder.css`. Scaffold-stage page body. |
| AuthShell   | `client/src/components/AuthShell.jsx`   | Centered auth card wrapper. Props `title`, `subtitle`, `footer`. `.auth-page`, `.auth-card` (uses `.card`), `.auth-subtitle`, `.auth-foot`; styles in `styles/auth.css`. Used by Register/Login/Verify/Forgot/Reset/AdminLogin. |
| PizzaCard   | `client/src/components/PizzaCard.jsx`   | Canonical product card. Props `name,image,badge,rating,reviews,description,price,onOrder`. Cream card (`--color-card-cream`), orange border, round image overlaps top edge, leaf `.badge-veg`, star rating (`--color-star`), `.price`, `.btn-secondary` Order Now. Styles in `styles/pizzacard.css`. Used in Customer Favorites (Landing); Dashboard "Order Again" grid. |
| StepBuilder | `client/src/components/StepBuilder.jsx` | 4-step wizard shell. Props `steps` (`[{key,title,type:'single'\|'multi',options:[{name,emoji,price}]}]`), `basePrice`, `onComplete({selection,total})`. Internal `useState` for current step + selection; stepper header (`.stepbuilder-step` active/done), option cards (`.stepbuilder-option.selected`), live running total, Back/Next w/ disabled gate on single-select. Styles in `styles/stepbuilder.css`. Used by PizzaBuilder. |
| StatusBadge | `client/src/components/StatusBadge.jsx` | Order-state pill. Prop `status` (`received\|in_kitchen\|out_for_delivery\|delivered`). Extends `.badge`; per-state tokens in `styles/statusbadge.css` (per ui-rules Order Status Badge). Used in Dashboard Active Orders; user tracking (Phase 3) later. |

### Routing / guards

| Component      | Path                                 | Notes                                              |
| -------------- | ------------------------------------ | -------------------------------------------------- |
| ProtectedRoute | `client/src/routes/ProtectedRoute.jsx` | User gate — waits for `ready`, redirects to `/login` when unauthenticated. Reads `useAuth()`. |
| AdminRoute     | `client/src/routes/AdminRoute.jsx`     | Admin gate — waits for `ready`; `/admin/login` if unauth, `/` if not admin. |

### Auth form pattern

Auth pages compose `AuthShell` + a `.auth-form` (`.auth-field` label+`.input`, `.auth-alert-error`/`.auth-alert-success`, full-width `.btn.btn-primary`). Reuse these classes for any future credential form. All API calls go through `api/index.js` auth fns returning `{ data, error }`.

### Form validation (Phase 5)

Shared client-side validators in `client/src/utils/validate.js`: `validateEmail`, `validatePassword({min=8})`, `validateRequired(value,label)`, `validateNonNegativeInt(value,label)` — each returns an error string or `null`. Forms run them pre-submit (first failure wins) and show the message via existing `.auth-alert-error` / status state before any API call. Wired into Register, Login, Forgot, AdminLogin, Inventory (`handleSave`, `alert`), Contact. Contact is now a stateful front-end-only form (validation + `.auth-alert-success`, no backend — out of scope). Reuse these validators for any new form.

### Landing sections (page-local)

Landing (`client/src/pages/user/Landing.jsx`, `styles/landing.css`) composes 9 sections with mock data, tokens only:
Hero (`.hero`, warm gradient bg under transparent navbar, H1 + 2 CTAs + 4 `.hero-mini` cards) · Today's Best Deals (`.deals-banner` `--gradient-deals-banner`, `.deals-offer` `--gradient-offer-bar`) · Customer Favorites (3× `PizzaCard`) · Welcome to the Future (`.future-*`, serif title, gold CTA) · Our Regular Flavoures (`.flavours-grid` 4-col `.flavour-card` circular image + name overlay) · Made with Love (`.love-inner` 2-col, gold-bordered image, gold CTA) · From Our Oven (`.oven-inner` 3-col feature list + scooter + How It Works) · Testimonials (`.testimonials-grid` 4× `.testimonial-card` on `.card`). Landing route uses `<Layout footer="A" />` (no hero spacer). Pizza cards/minis/hero use real photos in `client/public/pizzas/p1–p11.jpg` (served at `/pizzas/*`, `object-fit:cover`); scooter/avatars/feature icons remain emoji glyphs.

> Not yet built (moved out of Planned as-needed): Button, Input, Badge, DealsBanner (Landing deals built inline). StepBuilder + StatusBadge now built (see Components table).

### Ordering Pages (Phase 3)

| Component     | Path                                     | Notes                                                                                                          |
| ------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Dashboard     | `client/src/pages/user/Dashboard.jsx`    | `.dashboard-*`, `styles/dashboard.css`. Welcome hero, Active Orders list **live via `fetchMyOrders` (`GET /api/orders/mine`), polled every 5s** (`StatusBadge`, `formatPlaced`/`shortId` helpers, loading/error/empty states) + empty state, "Order Again" `PizzaCard` grid **fetched from `GET /api/pizzas`** (`fetchPizzas`, loading/error/empty states). `useNavigate` to /builder. |
| PizzaBuilder  | `client/src/pages/user/PizzaBuilder.jsx` | `.builder-*`, `.builder-state`, `styles/pizzabuilder.css`. **Fetches `GET /api/inventory/options`** (`fetchBuilderOptions`) → builds `<StepBuilder/>` steps (per-type emoji map, server prices); `onComplete` persists priced draft via `saveDraft` → /order-summary. Loading/error states. |
| OrderSummary  | `client/src/pages/user/OrderSummary.jsx` | `.summary-*`, `styles/ordersummary.css`. Two-col: item breakdown card + sticky total card (items/delivery/grand). **Reads sessionStorage draft via `getDraft`**, redirects to /builder if absent. → /checkout or /builder. |
| Checkout      | `client/src/pages/user/Checkout.jsx`     | `.checkout-*`, `styles/checkout.css`. Protected (moved under `ProtectedRoute`). Reads draft (redirect /builder if none). Two-col breakdown + sticky payment summary. `handlePay`: `loadRazorpay` (`utils/razorpay.js` dynamic checkout.js) → `createPaymentOrder(selection)` (server-priced) → Razorpay modal (`theme.color` read from `--color-primary` via getComputedStyle) → `handler` calls `verifyPayment` → `clearDraft` → /dashboard. Error/submitting states, `.checkout-error` uses `--color-primary-soft`. |

### Admin Pages (Phase 4)

| Component     | Path                                     | Notes                                                                                       |
| ------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| AdminLogin    | `client/src/pages/admin/AdminLogin.jsx`  | Uses `AuthShell`.                                                                           |
| Inventory     | `client/src/pages/admin/Inventory.jsx`   | `.admin-page`, `.admin-grid`, `.admin-card`. Styles in `styles/admin.css`. Grouped inventory list with edit forms. |
| Orders        | `client/src/pages/admin/Orders.jsx`      | `.admin-page`, `.admin-table`. Styles in `styles/admin.css`. All-orders list with status dropdown. |

### Marketing Pages (Phase 2)

| Component     | Path                                   | Notes                                                                                       |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| MenuPage      | `client/src/pages/user/Menu.jsx`       | `.menu-page`, `.menu-hero`, `.menu-tabs`. Styles in `styles/menu.css`. Uses `<PizzaCard/>`. |
| AboutPage     | `client/src/pages/user/About.jsx`      | `.about-page`, `.about-grid`, `.about-features-grid`. Styles in `styles/about.css`.         |
| ContactPage   | `client/src/pages/user/Contact.jsx`    | `.contact-page`, `.contact-grid`, `.contact-form`. Styles in `styles/contact.css`.          |
| LocationsPage | `client/src/pages/user/Locations.jsx`  | `.locations-page`, `.locations-layout`, `.location-card`. Styles in `styles/locations.css`. |
