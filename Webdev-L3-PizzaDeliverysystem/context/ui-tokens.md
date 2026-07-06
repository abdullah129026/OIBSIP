# UI Tokens

Design tokens for **PizzaCrave**, extracted from the delivered design spec. Use these exact values throughout the codebase — never hardcode colors.

> **Color rule (strict):** Anywhere the mockups show dark red / maroon / brown / orange → render as `--color-primary` (warm orange `#FF9800`). Gold and cream stay as-is. There is no red hue in this project.

---

## How to Use

Tokens are defined once as CSS variables in the global stylesheet (`client/src/styles/tokens.css` or equivalent) and referenced everywhere:

```jsx
// Correct — CSS variable reference
style={{ color: 'var(--color-primary)' }}
className="btn-primary"        // class that internally uses var(--color-primary)

// Never — hardcoded hex
style={{ color: '#FF9800' }}
className="bg-[#fff]"
```

---

## Token Definition

```css
:root {
  /* Fonts */
  --font-heading-serif: 'Playfair Display', serif;   /* editorial section titles */
  --font-heading-sans: 'Poppins', sans-serif;        /* product/section headers, hero H1 */
  --font-body: 'Inter', 'Poppins', sans-serif;       /* body text */

  /* Brand — warm orange replaces ALL dark-red/maroon/brown/orange */
  --color-primary: #FF9800;
  --color-primary-hover: #FB8C00;
  --color-primary-soft: #FFE0B2;

  /* Gold accents */
  --color-gold: #C9A24B;
  --color-gold-light: #E8D9A8;

  /* Backgrounds */
  --color-cream: #FBF6EC;         /* page / section background */
  --color-card-cream: #FBEFC9;    /* product / favorites card fill */
  --color-white: #FFFFFF;         /* cards, nav pill, inputs */

  /* Text */
  --color-text: #2B2B2B;
  --color-text-muted: #6B6B6B;

  /* Semantic / decorative */
  --color-leaf-green: #5FA043;    /* veg + popularity badges */
  --color-star: #F4B400;          /* rating stars */
  --color-border: #E9DFC7;        /* card + input borders (light gold) */

  /* Radius */
  --radius: 14px;
  --radius-card: 12px;
  --radius-pill: 28px;
  --radius-btn: 8px;              /* rectangular CTAs */

  /* Shadow */
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
```

### Gradients

```css
--gradient-gold-btn: linear-gradient(180deg, #E8D9A8 0%, #C9A24B 100%);
--gradient-deals-banner: linear-gradient(135deg, #FFB74D, #FF9800);   /* orange marble */
--gradient-offer-bar: linear-gradient(90deg, #FF9800, #F0A500);        /* orange → gold */
```

---

## Color Usage Guide

### Page Layout

| Element                    | Token                  |
| -------------------------- | ---------------------- |
| Page background            | `--color-cream`        |
| Card / surface             | `--color-white`        |
| Product / favorites card   | `--color-card-cream`   |
| Default border             | `--color-border`       |
| Banner / footer background | `--color-primary`      |

### Typography

| Element                       | Token                |
| ----------------------------- | -------------------- |
| Headings, price text          | `--color-primary`    |
| Body / primary text           | `--color-text`       |
| Secondary text, descriptions  | `--color-text-muted` |

### Accent

Used for: primary buttons, banners, footers, active nav, price text (orange); premium CTAs, card borders, dividers (gold).

| Element                        | Token                 |
| ------------------------------ | --------------------- |
| Primary button background      | `--color-primary`     |
| Soft badge / tint background   | `--color-primary-soft`|
| Gold CTA background            | `--gradient-gold-btn` |

### Badges & Semantic

| Type                          | Background            | Text                 |
| ----------------------------- | -------------------- | -------------------- |
| Veg / popularity (Most Popular, New, Top Pick) | `--color-leaf-green` | `--color-white`      |
| Rating stars                  | —                    | `--color-star`       |
| Soft badge                    | `--color-primary-soft`| `--color-primary`    |

---

## Typography Scale

| Element                                        | Size (desktop) | Weight | Font                    | Color token          |
| ---------------------------------------------- | -------------- | ------ | ----------------------- | -------------------- |
| Hero H1                                         | 56–64px        | 700    | `--font-heading-sans`   | `--color-primary`    |
| Section title (editorial, e.g. "What Our Customers Say") | 40–52px | 700 | `--font-heading-serif`  | `--color-primary`    |
| Section title (sans, e.g. "Customer Favorites") | 40–48px       | 700    | `--font-heading-sans`   | `--color-primary`    |
| Card title                                      | 20–24px        | 600    | `--font-heading-sans`   | `--color-text`       |
| Body                                            | 15–16px        | 400    | `--font-body`           | `--color-text`       |
| Price                                           | 20–22px        | 700    | `--font-heading-sans`   | `--color-primary`    |
| Buttons                                         | 15–16px        | 600    | `--font-heading-sans`   | contextual           |

Two heading families mix: **serif** (Playfair) for editorial headers, **bold sans** (Poppins) for product/section headers — match per section.

---

## Spacing

- Max content width: ~1140–1200px, centered
- Section vertical padding: 64–80px
- Grid gaps: 24–32px
- Card padding: 24–32px

---

## Component Tokens

### Cards

```
background: var(--color-white)  /* or var(--color-card-cream) for product cards */
border: 1px solid var(--color-border)   /* orange or gold border per section */
border-radius: var(--radius-card)       /* 12–16px */
box-shadow: var(--shadow)
padding: 24–32px
```

### Buttons

- **Primary CTA:** `background: var(--color-primary)`, white text, `border-radius: var(--radius-pill)`. (Order Now, Submit, Place Order, Proceed to Checkout)
- **Secondary:** white/cream bg, `border: 1px solid var(--color-primary)`, `color: var(--color-primary)`, pill. (View Menu, How It Works, Explore all)
- **Gold CTA:** `background: var(--gradient-gold-btn)`, dark text, pill. (Learn More, Order Pizza, Subscribe)

### Input Fields

```
background: var(--color-white)
border: 1px solid var(--color-border)
border-radius: var(--radius-btn)
color: var(--color-text)
placeholder: var(--color-text-muted)
focus: border-color var(--color-primary)
```

### Badges

Pill shape, small padding. Veg/popularity = `--color-leaf-green` bg + white text. Soft = `--color-primary-soft` bg + `--color-primary` text.

---

## Invariants

- Never use hex values directly in components — always CSS variables / token classes
- Fonts: Playfair Display (serif headers), Poppins (sans headers/body), Inter (body) — load via web font loader, never a bare system font
- **No dark red / maroon / brown anywhere** — every such element in the mockups renders as `--color-primary`
- Gold and cream stay exactly as specified
- All borders default to `--color-border` (light gold) unless the section calls for a orange/gold accent border
- `--color-primary` is warm orange `#FF9800` — no red hue anywhere
