# Rouge Intime — E-commerce Architecture

## Decisions summary

| Decision | Choice |
|---|---|
| Platform | Custom (replacing Tiendanube) |
| Hosting | Vercel + Supabase |
| Framework | Next.js (App Router, TypeScript) |
| Storefront | Rebuilt in Next.js (from static HTML) |
| Admin panel | Full CRUD (products, orders, stock) |
| Admin auth | Hardcoded single admin via env vars |
| Image hosting | Supabase Storage |
| Payments | MercadoPago Checkout Bricks (embedded) |

---

## Project structure

```
rouge-web/                        ← existing repo
  app/
    (store)/                      ← public storefront (no auth)
      page.tsx                    ← home (replaces index.html)
      guia-de-talles/page.tsx     ← size guide
      politica-de-cambios/page.tsx
      productos/page.tsx          ← full catalog
      [category]/page.tsx         ← category pages
      [category]/[slug]/page.tsx  ← product detail
      cart/page.tsx               ← cart (client-side state)
      checkout/page.tsx           ← initiates MP payment
      checkout/success/page.tsx   ← post-payment confirmation
      checkout/failure/page.tsx   ← post-payment failure
    (admin)/                      ← protected by session cookie
      admin/login/page.tsx
      admin/page.tsx              ← dashboard (orders overview)
      admin/products/page.tsx     ← product list
      admin/products/new/page.tsx
      admin/products/[id]/page.tsx
      admin/orders/page.tsx
      admin/orders/[id]/page.tsx
    api/
      auth/login/route.ts         ← sets admin session cookie
      auth/logout/route.ts
      checkout/route.ts           ← creates MP preference, returns init_point
      webhooks/mp/route.ts        ← receives MercadoPago IPN notifications
      admin/products/route.ts     ← GET list, POST create
      admin/products/[id]/route.ts ← GET, PUT, DELETE
      admin/orders/route.ts       ← GET list
      admin/orders/[id]/route.ts  ← GET detail, PUT (update status)
  components/
    store/                        ← ProductCard, CategoryGrid, CartDrawer, etc.
    admin/                        ← DataTable, ImageUpload, OrderStatusBadge, etc.
  lib/
    supabase.ts                   ← Supabase client (server + browser)
    mp.ts                         ← MercadoPago SDK wrapper
    auth.ts                       ← session cookie helpers
    cart.ts                       ← cart state (Zustand or localStorage)
  public/
    (static assets — fonts cached, no product images)
```

---

## Database schema (Supabase / PostgreSQL)

```sql
-- Products
create table products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  price       numeric(10,2) not null,
  category    text not null,           -- sets, baby-doll, body, catsuit, etc.
  images      text[] not null default '{}',  -- Supabase Storage public URLs
  sizes       text[] not null default '{}',  -- ['S','M','L','XL'] or ['85B','90C']
  colors      text[] not null default '{}',
  stock       int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz default now()
);

-- Orders
create table orders (
  id                uuid primary key default gen_random_uuid(),
  status            text not null default 'pending',
                    -- pending | paid | processing | shipped | delivered | cancelled
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text,
  items             jsonb not null,     -- snapshot of items at purchase time
  subtotal          numeric(10,2) not null,
  total             numeric(10,2) not null,
  mp_preference_id  text,              -- MP preference id (before payment)
  mp_payment_id     text,              -- MP payment id (after payment confirmed)
  mp_status         text,              -- approved | pending | rejected
  notes             text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- items column shape (stored as JSONB):
-- [{ product_id, name, price, quantity, size, color, image }]
```

---

## MercadoPago payment flow

Checkout Bricks renders an embedded payment form on your `/checkout` page —
the customer never leaves the site.

```
1. Customer fills cart → navigates to /checkout
2. POST /api/checkout/preference
   body: { items, customer: { name, email, phone } }
3. Server creates order row (status: 'pending') in Supabase
4. Server calls MP API: create preference
   - items: [{ title, quantity, unit_price }]
   - notification_url: https://rouge.vercel.app/api/webhooks/mp
   - external_reference: order.id
5. Server returns { preference_id, order_id } to frontend
6. Frontend initialises MP Bricks SDK with preference_id + public key:
   mp.bricks().create('cardPayment', 'bricks-container', {
     initialization: { amount: total, preferenceId: preference_id },
     callbacks: {
       onSubmit: async ({ formData }) => {
         // formData contains the tokenized card + installments
         await fetch('/api/checkout/process', {
           method: 'POST',
           body: JSON.stringify({ ...formData, order_id })
         })
       },
       onError: (error) => { /* show error UI */ }
     }
   })
7. Customer fills card details in the Brick form (MP tokenizes, you never see raw card data)
8. Brick calls onSubmit → POST /api/checkout/process
   body: { token, payment_method_id, installments, issuer_id, order_id }
9. Server calls MP Payments API with the token → payment is processed
10. If approved: update order status → 'paid', store mp_payment_id, redirect to /checkout/success
    If rejected: return error to frontend, Brick shows rejection message, order stays 'pending'
11. MP also fires IPN webhook → POST /api/webhooks/mp (backup confirmation)
12. Webhook handler:
    a. Verifies X-Signature header
    b. Fetches payment from MP API
    c. Reconciles order status in Supabase (idempotent)
```

**API routes needed (vs Checkout Pro):**
- `/api/checkout/preference` — create preference + pending order (same as before)
- `/api/checkout/process` — NEW: receives Brick formData, calls MP Payments API, returns result
- `/api/webhooks/mp` — backup IPN handler (same as before)

**Extra frontend setup:**
```html
<!-- Load MP Bricks SDK on checkout page -->
<script src="https://sdk.mercadopago.com/js/v2"></script>
```
```tsx
// checkout/page.tsx
const mp = new MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY)
// render Brick into a div with id="bricks-container"
```

---

## Admin authentication

```typescript
// lib/auth.ts
const COOKIE_NAME = 'rouge_admin_session'
const SESSION_SECRET = process.env.ADMIN_SECRET!  // random 32-char string

// Login: POST /api/auth/login
// - Verifies body.email === process.env.ADMIN_EMAIL
//           body.password === process.env.ADMIN_PASSWORD
// - Signs a JWT with SESSION_SECRET, sets HttpOnly cookie (7 day expiry)

// Middleware: app/(admin)/**
// - Reads cookie, verifies JWT
// - If invalid: redirect to /admin/login
```

---

## Environment variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-side only, never exposed to browser

# Admin
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SECRET=                     # random string for JWT signing

# MercadoPago
MP_ACCESS_TOKEN=                  # secret, server-side only
NEXT_PUBLIC_MP_PUBLIC_KEY=        # safe to expose to browser
MP_WEBHOOK_SECRET=                # for verifying IPN signature

# App
NEXT_PUBLIC_APP_URL=https://rouge.vercel.app
```

---

## Design system continuity

The existing design tokens carry over into Tailwind + CSS custom properties:

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#C0445A` | CTAs, accents, headings |
| `--color-secondary` | `#EC4899` | Hover states |
| `--color-accent` | `#D97706` | Star ratings, highlights |
| Font heading | Cormorant | Titles |
| Font body | Montserrat | Body text |

Glass card, fade-in scroll, and button patterns from `index.html` become reusable components.

---

## Implementation phases

### Phase 1 — Foundation
- [ ] Initialize Next.js + TypeScript project in `/app`
- [ ] Configure Supabase (create project, run schema migrations)
- [ ] Set up Tailwind with design tokens from existing CSS
- [ ] Configure Vercel deployment + env vars

### Phase 2 — Admin panel
- [ ] Admin login (hardcoded auth + JWT session cookie)
- [ ] Product management (CRUD + Supabase Storage image upload)
- [ ] Order list + order detail view

### Phase 3 — Storefront
- [ ] Migrate home page (`index.html` → Next.js)
- [ ] Product catalog + category pages (data from Supabase)
- [ ] Product detail page
- [ ] Size guide + policy pages
- [ ] Cart (client-side, Zustand or localStorage)

### Phase 4 — Checkout
- [ ] POST /api/checkout (create order + MP preference)
- [ ] POST /api/webhooks/mp (IPN handler)
- [ ] Success / failure pages

### Phase 5 — Polish
- [ ] Migrate product images from Tiendanube CDN to Supabase Storage
- [ ] SEO metadata (Open Graph, title tags)
- [ ] WhatsApp fallback on product pages
- [ ] Mobile QA
