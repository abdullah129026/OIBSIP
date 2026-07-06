# UI Rules

Rules for building the PizzaCrave UI. The design spec is the source of truth for visual decisions. Reference tokens from ui-tokens.md — never hardcode hex.

> **Strict color rule:** dark red / maroon / brown / orange in any mockup → render as `--color-primary` (warm orange `#FF9800`). Gold and cream stay as-is.

---

## Font

Load via a web font loader (Google Fonts). Three families exposed as CSS variables in the global stylesheet:

- `--font-heading-serif`: **Playfair Display** — editorial section titles ("Welcome to the Future of Pizza!", "What Our Customers Say")
- `--font-heading-sans`: **Poppins** — hero H1, product/section headers, buttons, price
- `--font-body`: **Inter / Poppins** — body text

Never use a bare system font as primary.

---

## Layout

- Page max-width: ~1140–1200px, centered
- Section vertical padding: 64–80px
- Gap between grid items: 24–32px
- Navbar: transparent over hero image, full width, sits above content
- Navigation model: top navbar with centered white pill of links
- Soft shadow on raised surfaces: `var(--shadow)`

---

## Navigation

Nav items: Home ▾ · Menu ▾ · Locations ▾ · About Us ▾ · Contact ▾.

- Center links live in a white rounded **pill** container
- Active item: orange pill background (`--color-primary`), white text
- Inactive item: `--color-text`, no fill
- Left: **PizzaCrave** logo, `--color-primary` text
- Right: circular search button + circular account/avatar button (white)
- Below 900px: collapse to hamburger → drawer

---

## Cards

Every content section lives in a card.

```
background: var(--color-white)         /* product/favorites cards use var(--color-card-cream) */
border: 1px solid var(--color-border)  /* accent to orange or gold per section */
border-radius: var(--radius-card)      /* 12–16px */
padding: 24–32px
box-shadow: var(--shadow)
```

Product cards: round pizza image overlaps the top edge; green leaf badge top-corner; title, star rating + reviews, description, bold price, outline "Order Now" pill.

---

## Typography Hierarchy

**Hero H1** — 56–64px / 700 / `--font-heading-sans` / `--color-primary`
**Section heading (editorial)** — 40–52px / 700 / `--font-heading-serif` / `--color-primary`
**Section heading (sans)** — 40–48px / 700 / `--font-heading-sans` / `--color-primary`
**Card title** — 20–24px / 600 / `--font-heading-sans` / `--color-text`
**Body / primary text** — 15–16px / 400 / `--font-body` / `--color-text`
**Secondary / muted** — 15px / 400 / `--font-body` / `--color-text-muted`
**Price** — 20–22px / 700 / `--color-primary`

---

## Badges

Pill shape, small horizontal padding.

- Veg / popularity ("Most Popular", "New", "Top Pick"): `--color-leaf-green` bg, white text, leaf icon
- Soft badge: `--color-primary-soft` bg, `--color-primary` text
- Rating: star glyphs in `--color-star` + numeric score

---

## Buttons

**Primary:** `--color-primary` bg, white text, `--radius-pill`. Order Now, Submit, Place Order, Proceed to Checkout.
**Secondary:** white/cream bg, `--color-primary` border + text, pill. View Menu, How It Works, Explore all.
**Gold CTA:** `--gradient-gold-btn` bg, dark text, pill. Learn More, Order Pizza, Subscribe.

Hover on primary → `--color-primary-hover`.

---

## Form Inputs

```
background: var(--color-white)
border: 1px solid var(--color-border)
border-radius: var(--radius-btn)
color: var(--color-text)
placeholder: var(--color-text-muted)
focus: border-color var(--color-primary)
```

Used in: register/login/reset forms, contact form, checkout, coupon, newsletter.

---

## Order Status Badge

StatusBadge reflects order state with a colored pill:

- Received → `--color-primary-soft` bg / `--color-primary` text
- In Kitchen → `--color-gold-light` bg / `--color-text` text
- Out for Delivery → `--color-primary` bg / white text
- Delivered → `--color-leaf-green` bg / white text

---

## Empty States

Every section that can be empty needs a minimal empty state:

- Short descriptive text in `--color-text-muted`
- Optional icon above
- CTA button if there's a logical next action (e.g. empty cart → "View Menu")

---

## Footer (two variants)

**Variant A (big brand, landing + checkout):** orange bg, gold-gradient PizzaCrave wordmark + tagline, quick links, contact, "Order Pizza" gold button, social list, "Stay in the Loop!" newsletter, bottom copyright bar.

**Variant B (compact, about/menu/contact/location):** orange strip; left floating action circles, center wordmark + social icons, right copyright + Our Story | Careers | FAQs | T&Cs.

---

## Styling System Note

Plain CSS with CSS custom properties (tokens) defined in a global stylesheet, plus per-component CSS files under `client/src/styles/`. Add every new token through the token system — never inline hex.

---

## Responsive Notes

- Nav collapses to hamburger < 900px; center pill becomes a drawer
- Multi-column card grids → single-column stack on mobile
- Hero 2×2 mini-cards move below H1 on mobile
- Checkout / contact two-column layouts → stacked

---

## Do Nots

- Never use red / maroon / brown — always `--color-primary` (warm orange)
- Never hardcode hex in components — use tokens from ui-tokens.md
- Never add gradients to plain card backgrounds (gold/deals banners are the intended exceptions)
- Never use more than one font weight in a single UI element
- Never show raw error messages to users — always human-readable text
- Never use a system font as the primary font
