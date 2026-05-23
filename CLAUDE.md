# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js e-commerce site for **Rouge Intime** — an Argentine intimate apparel brand. Built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, and Supabase (PostgreSQL).

> **Important:** Read `AGENTS.md` before writing any Next.js code. This version has breaking changes from standard Next.js — APIs and conventions differ from training data.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| UI | React 19 + TypeScript |
| Styles | Tailwind CSS v4 (`globals.css` `@theme`) |
| Database | Supabase (PostgreSQL) |
| Auth | JWT cookie guard via `middleware.ts` (admin only) |
| Tests | Vitest + `@testing-library/react` |

## Project structure

```
app/
  (store)/          # customer-facing routes
    layout.tsx
    page.tsx          → / (home)
    [category]/       → /:category
    producto/[slug]/  → /producto/:slug
    productos/        → /productos
    checkout/
    contacto/
    guia-de-talles/
    politica-de-cambios/
  (admin)/          # protected by middleware
    layout.tsx
  globals.css
  layout.tsx

components/
  store/            # Nav, Hero, CategoriesGrid, FeaturedProducts,
                    # ProductCard, ProductGrid, Footer, HowItWorks,
                    # Testimonials, AddToCart, CartContext, CartDrawer
  admin/            # AdminShell

lib/
  products.ts       # getFeaturedProducts, getCategoryThumbnails, CATEGORY_META
  auth.ts           # verifyAdminToken, ADMIN_COOKIE_NAME
  mock-data.ts      # mock data for tests
  admin-data.ts
  supabase/
    client.ts       # browser client (anon key)
    server.ts       # server client (service role key)
    types.ts        # Product, ProductCategory, OrderStatus, …

supabase/migrations/
middleware.ts       # redirects unauthenticated requests from /admin/** to /admin/login
```

## Running locally

```bash
npm run dev       # → http://localhost:3000
npm run build     # production build
npm test          # Vitest test suite
npm run lint      # ESLint
```

Requires a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Screenshotting with Playwright

Playwright Python is installed. **The dev server must be running** before taking screenshots.

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:3000")
    page.wait_for_load_state("networkidle")
    page.screenshot(path="/tmp/check.png", full_page=True)
    browser.close()
```

For mobile viewports use `{"width": 390, "height": 844}` (iPhone 14).

## Design system

UI/UX decisions are driven by the **ui-ux-pro-max** skill. Before adding new pages, components, or visual styles, invoke it for a consistent design system recommendation:

```
/ui-ux-pro-max build <description of what you're building>
```

The skill provides: style (currently **Liquid Glass**), color palette, font pairing, UX rules, and anti-patterns to avoid.

All design tokens are declared in `app/globals.css` under `@theme` (Tailwind v4 syntax):

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#C0445A` | Rose — CTAs, accents, headings |
| `--color-secondary` | `#EC4899` | Pink — hover states |
| `--color-accent` | `#D97706` | Gold — star ratings, highlights |
| `--color-bg` | `#FDF8F8` | Page background |
| `--color-fg` | `#1A0A0D` | Body text |
| `--color-surface` | `rgba(255,255,255,0.6)` | Glass cards |
| `--font-heading` | Cormorant | Serif — titles |
| `--font-body` | Montserrat | Sans — body text |

Animations use `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` and durations `--dur-fast: 180ms` / `--dur-mid: 320ms` / `--dur-slow: 500ms`.

## Product images

All product and category images are served from the Tiendanube CDN:

```
https://acdn-us.mitiendanube.com/stores/004/099/592/products/{filename}-1024-1024.webp?w=480
https://acdn-us.mitiendanube.com/stores/004/099/592/categories/{filename}-1920-1920.webp?w=360
```

Use `?w=360` for category thumbnails, `?w=480` for product cards, `?w=640` for the hero image.

## Key patterns

**WhatsApp links:** Always use `https://wa.me/+541158861214?text=...` with URL-encoded pre-filled message.

**Glass card (Tailwind):**
```tsx
<div className="bg-surface backdrop-blur-md border border-white/85 rounded-lg shadow-card">
```

**Scroll fade-in:** Apply the `fade-in` class. `globals.css` wires an IntersectionObserver — elements start at `opacity:0 translateY(22px)` and transition to visible on scroll.

**Server vs. client Supabase:** Use `lib/supabase/server.ts` in Server Components and route handlers. Use `lib/supabase/client.ts` in Client Components.

## Live site pages — rougeintime.ar

These are the real pages on the live Tiendanube store. The app links out to these URLs for purchase flows.

### Product categories

| URL | What it shows |
|-----|---------------|
| `/productos` | Full product catalog — all items across categories with prices and ordering info |
| `/sets` | All lingerie sets (parent category) |
| `/sets/3-piezas` | 3-piece sets — images, ARS pricing, "Comprar" buttons |
| `/sets/4-piezas` | 4-piece sets — same layout as 3-piece |
| `/baby-doll` | Baby doll styles (~$49,500–$67,491 ARS, transfer discount shown) |
| `/conjuntos` | Ensembles / basic sets grid |
| `/body` | Body styles (typically 12% OFF with transfer) |
| `/bata` | Robes and sleepwear, including gift box bundles |
| `/catsuit` | Catsuit styles up to size 140, multiple color options |
| `/corsets` | Corsets (7 items, including bundles like "Kit Pasion") |
| `/pijamas` | Tailored pajama line — fully custom sizing, $60,000–$250,000 ARS |
| `/disfraces` | Costume outfits (maid, schoolgirl, police, nurse, bunny, etc.) |
| `/sexshop` | Intimate wellness products — fragrances, vibrators, lubricants |
| `/perfume-feromonas` | Pheromone perfumes and body sprays (collections: Hot Inevitable, For Him, Hotel) |
| `/panty-vedetina-culotte` | Accessories — panties, hosiery, multi-piece sets |

### Information pages

| URL | What it shows |
|-----|---------------|
| `/guia-de-talles` | Size guide — measurement tables for bras (85B–140G) and underwear (S–5XL), how-to-measure tips |
| `/contacto` | Contact form + WhatsApp / phone / email |
| `/politica-de-cambios` | Return policy — made-to-order (15–20 day lead time), 45% deduction for buyer's remorse, exchanges only for defects |

## Contact details

- WhatsApp: `+541158861214`
- Email: `rougeintimelenceria@gmail.com`
- Instagram: `rougeintime.ar`
