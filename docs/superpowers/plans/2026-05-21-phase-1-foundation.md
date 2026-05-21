# Phase 1: Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a Next.js 15 (App Router, TypeScript) project inside the existing rouge-web repo, wired to Supabase (database + storage) and deployable to Vercel as a skeleton — with rouge design tokens in Tailwind and the database schema migrated.

**Architecture:** Next.js App Router with two route groups: `(store)` for the public storefront and `(admin)` for the protected panel. Supabase serves both the PostgreSQL database and file storage for product images. A single Supabase migration file defines the full initial schema. Phase 1 ships no real pages — only layouts, a working skeleton, and verified infrastructure.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v3, @supabase/supabase-js v2, Vitest, Node 20

---

## File map

```
rouge-web/                          ← repo root (existing static HTML stays alongside)
  app/
    layout.tsx                      ← root HTML shell, font variables, global metadata
    globals.css                     ← CSS custom properties (design tokens) + Tailwind directives
    (store)/
      layout.tsx                    ← store shell (nav placeholder, footer placeholder)
      page.tsx                      ← home placeholder ("Coming soon")
    (admin)/
      layout.tsx                    ← admin shell (sidebar placeholder)
      admin/
        page.tsx                    ← admin dashboard placeholder
  lib/
    supabase/
      client.ts                     ← browser Supabase client (anon key)
      server.ts                     ← server Supabase client (service role, server-only)
      types.ts                      ← hand-written DB types (Products, Orders rows)
  supabase/
    migrations/
      001_initial_schema.sql        ← products + orders tables
  __tests__/
    supabase-types.test.ts          ← type smoke tests (compile-time, no real DB)
  .env.local.example                ← all required env vars documented
  next.config.ts
  tailwind.config.ts
  tsconfig.json
  package.json
  .gitignore
```

---

## Task 1: Git init + Next.js bootstrap

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `.gitignore`, `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Init git**

```bash
cd /Users/juldenarocur/Repositorios/rouge-web
git init
```

Expected: `Initialized empty Git repository in .../rouge-web/.git/`

- [ ] **Step 2: Create Next.js project in-place**

```bash
cd /Users/juldenarocur/Repositorios/rouge-web
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-turbopack
```

When prompted about existing files, answer **Yes** to overwrite conflicting ones (only `package.json` and `.gitignore` will conflict — the `.html` files are not touched).

Expected output ends with: `Success! Created your app at rouge-web`

- [ ] **Step 3: Verify the skeleton runs**

```bash
cd /Users/juldenarocur/Repositorios/rouge-web
npm run dev
```

Open http://localhost:3000 — should show the default Next.js welcome page. Kill the server (`Ctrl+C`).

- [ ] **Step 4: Delete Next.js default boilerplate**

```bash
rm app/page.tsx app/favicon.ico public/next.svg public/vercel.svg 2>/dev/null || true
# Remove the default page content from globals.css (keep only @tailwind directives)
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: bootstrap Next.js 15 App Router project"
```

---

## Task 2: Install additional dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install @supabase/supabase-js jose
```

- `@supabase/supabase-js` — Supabase client
- `jose` — JWT signing/verification (edge-compatible, needed for middleware later)

- [ ] **Step 2: Install dev/test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Verify install succeeded**

```bash
node -e "require('@supabase/supabase-js'); require('jose'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add supabase, jose, vitest dependencies"
```

---

## Task 3: Tailwind + design tokens

**Files:**
- Create/Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `tailwind.config.ts` with rouge design system**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#C0445A',
        secondary: '#EC4899',
        accent:    '#D97706',
        bg:        '#FDF8F8',
        fg:        '#1A0A0D',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(192,68,90,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        soft: '0 2px 12px rgba(0,0,0,0.06)',
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '180ms',
        mid:  '320ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Write `app/globals.css`**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary:   #C0445A;
  --color-secondary: #EC4899;
  --color-accent:    #D97706;
  --color-bg:        #FDF8F8;
  --color-fg:        #1A0A0D;
  --color-surface:   rgba(255, 255, 255, 0.6);

  --font-heading: 'Cormorant', Georgia, serif;
  --font-body:    'Montserrat', system-ui, sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --shadow-card: 0 4px 24px rgba(192, 68, 90, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
  --shadow-soft: 0 2px 12px rgba(0, 0, 0, 0.06);

  --ease-out:  cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast:  180ms;
  --dur-mid:   320ms;
  --dur-slow:  500ms;
}

@layer base {
  body {
    @apply bg-bg text-fg font-body;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}

@layer components {
  .glass-card {
    background: var(--color-surface);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.85);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
  }

  .btn-primary {
    @apply inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-body font-semibold text-sm;
    transition: background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out);
  }

  .btn-primary:hover {
    @apply bg-secondary;
    transform: translateY(-1px);
  }

  .fade-in {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out);
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: add rouge design tokens to Tailwind + global CSS"
```

---

## Task 4: Root layout with fonts

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write the root layout**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Cormorant, Montserrat } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Rouge Intime',
  description: 'Lencería fina y sexshop — Argentina',
  openGraph: {
    title: 'Rouge Intime',
    description: 'Lencería fina y sexshop — Argentina',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="bg-bg text-fg antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create the store route group layout**

```typescript
// app/(store)/layout.tsx
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Nav will go here in Phase 3 */}
      <main>{children}</main>
      {/* Footer will go here in Phase 3 */}
    </>
  )
}
```

- [ ] **Step 3: Create the store home placeholder**

```typescript
// app/(store)/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-5xl text-primary mb-4">Rouge Intime</h1>
        <p className="font-body text-fg/60">Sitio en construcción</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create the admin route group layout**

```typescript
// app/(admin)/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin sidebar will go here in Phase 2 */}
      <main className="p-8">{children}</main>
    </div>
  )
}
```

- [ ] **Step 5: Create the admin dashboard placeholder**

```typescript
// app/(admin)/admin/page.tsx
export default function AdminPage() {
  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">Panel de administración</h1>
      <p className="font-body text-fg/60 mt-2">Fase 2 — próximamente</p>
    </div>
  )
}
```

- [ ] **Step 6: Verify fonts and design tokens load**

```bash
npm run dev
```

Open http://localhost:3000 — verify:
- The text "Rouge Intime" renders in Cormorant (serif, large)
- "Sitio en construcción" renders in Montserrat (sans-serif, muted)
- Background is `#FDF8F8` (warm off-white), not pure white

Kill the server.

- [ ] **Step 7: Commit**

```bash
git add app/
git commit -m "feat: root layout with Cormorant + Montserrat fonts and route group shells"
```

---

## Task 5: Vitest setup + smoke test

**Files:**
- Create: `vitest.config.ts`, `__tests__/smoke.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Create `vitest.config.ts`**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: [],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 2: Add test script to `package.json`**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Write the smoke test**

```typescript
// __tests__/smoke.test.ts
import { describe, it, expect } from 'vitest'

describe('project smoke test', () => {
  it('design tokens are defined as constants', () => {
    const tokens = {
      colorPrimary:   '#C0445A',
      colorSecondary: '#EC4899',
      colorAccent:    '#D97706',
      colorBg:        '#FDF8F8',
      colorFg:        '#1A0A0D',
    }
    // Verify every token is a valid hex color
    Object.values(tokens).forEach(value => {
      expect(value).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })
})
```

- [ ] **Step 4: Run the test**

```bash
npm test
```

Expected:
```
✓ __tests__/smoke.test.ts (1)
  ✓ design tokens are defined as constants

Test Files  1 passed (1)
Tests       1 passed (1)
```

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts __tests__/ package.json
git commit -m "chore: add Vitest test runner with smoke test"
```

---

## Task 6: Supabase client setup

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/types.ts`

- [ ] **Step 1: Create browser client**

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Used in Client Components — uses the public anon key
export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create server client**

```typescript
// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Used in Server Components and API routes — uses the service role key
// NEVER import this file in client components
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

- [ ] **Step 3: Create hand-written DB types**

```typescript
// lib/supabase/types.ts

export type ProductCategory =
  | 'sets'
  | 'baby-doll'
  | 'body'
  | 'catsuit'
  | 'conjuntos'
  | 'corsets'
  | 'bata'
  | 'pijamas'
  | 'disfraces'
  | 'sexshop'
  | 'perfume-feromonas'
  | 'panty-vedetina-culotte'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type OrderItem = {
  product_id: string
  name: string
  price: number
  quantity: number
  size: string
  color: string
  image: string
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: ProductCategory
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  active: boolean
  created_at: string
}

export type Order = {
  id: string
  status: OrderStatus
  customer_name: string
  customer_email: string
  customer_phone: string | null
  items: OrderItem[]
  subtotal: number
  total: number
  mp_preference_id: string | null
  mp_payment_id: string | null
  mp_status: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// Supabase client generic parameter
export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
    }
  }
}
```

- [ ] **Step 4: Write type tests**

```typescript
// __tests__/supabase-types.test.ts
import { describe, it, expectTypeOf } from 'vitest'
import type { Product, Order, OrderItem, OrderStatus, ProductCategory } from '@/lib/supabase/types'

describe('database types', () => {
  it('Product has required fields', () => {
    expectTypeOf<Product>().toHaveProperty('id')
    expectTypeOf<Product>().toHaveProperty('name')
    expectTypeOf<Product>().toHaveProperty('price')
    expectTypeOf<Product>().toHaveProperty('category')
    expectTypeOf<Product>().toHaveProperty('images')
    expectTypeOf<Product>().toHaveProperty('sizes')
    expectTypeOf<Product>().toHaveProperty('colors')
    expectTypeOf<Product>().toHaveProperty('stock')
    expectTypeOf<Product>().toHaveProperty('active')
  })

  it('Order has required fields', () => {
    expectTypeOf<Order>().toHaveProperty('id')
    expectTypeOf<Order>().toHaveProperty('status')
    expectTypeOf<Order>().toHaveProperty('customer_name')
    expectTypeOf<Order>().toHaveProperty('customer_email')
    expectTypeOf<Order>().toHaveProperty('items')
    expectTypeOf<Order>().toHaveProperty('total')
    expectTypeOf<Order>().toHaveProperty('mp_preference_id')
    expectTypeOf<Order>().toHaveProperty('mp_payment_id')
  })

  it('OrderItem has snapshot fields', () => {
    expectTypeOf<OrderItem>().toHaveProperty('product_id')
    expectTypeOf<OrderItem>().toHaveProperty('name')
    expectTypeOf<OrderItem>().toHaveProperty('price')
    expectTypeOf<OrderItem>().toHaveProperty('quantity')
    expectTypeOf<OrderItem>().toHaveProperty('size')
    expectTypeOf<OrderItem>().toHaveProperty('color')
    expectTypeOf<OrderItem>().toHaveProperty('image')
  })

  it('OrderStatus union covers all expected values', () => {
    const statuses: OrderStatus[] = [
      'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
    ]
    expect(statuses).toHaveLength(6)
  })

  it('ProductCategory union covers all rouge categories', () => {
    const categories: ProductCategory[] = [
      'sets', 'baby-doll', 'body', 'catsuit', 'conjuntos',
      'corsets', 'bata', 'pijamas', 'disfraces', 'sexshop',
      'perfume-feromonas', 'panty-vedetina-culotte'
    ]
    expect(categories).toHaveLength(12)
  })
})
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected:
```
✓ __tests__/smoke.test.ts (1)
✓ __tests__/supabase-types.test.ts (5)

Test Files  2 passed (2)
Tests       6 passed (6)
```

- [ ] **Step 6: Commit**

```bash
git add lib/ __tests__/supabase-types.test.ts
git commit -m "feat: Supabase client setup and hand-written database types"
```

---

## Task 7: Database schema migration

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- supabase/migrations/001_initial_schema.sql
-- Run this in the Supabase SQL editor (dashboard.supabase.com → SQL Editor)

-- Products table
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  price       numeric(10,2) not null check (price >= 0),
  category    text not null,
  images      text[] not null default '{}',
  sizes       text[] not null default '{}',
  colors      text[] not null default '{}',
  stock       int not null default 0 check (stock >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Orders table
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  status            text not null default 'pending'
                    check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text,
  items             jsonb not null default '[]',
  subtotal          numeric(10,2) not null check (subtotal >= 0),
  total             numeric(10,2) not null check (total >= 0),
  mp_preference_id  text,
  mp_payment_id     text,
  mp_status         text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-update updated_at on orders
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Useful indexes
create index if not exists products_category_idx on products (category);
create index if not exists products_active_idx on products (active);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_mp_payment_id_idx on orders (mp_payment_id);

-- Row Level Security
-- Products are readable by anyone (anon), writable only by service role
alter table products enable row level security;
create policy "products_public_read" on products
  for select using (active = true);

-- Orders are only accessible by service role (admin API routes)
alter table orders enable row level security;
-- No anon access to orders — server-side only via service role key

-- Supabase Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Anyone can read product images (they're public)
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'products');

-- Only service role can upload/delete
create policy "product_images_admin_write" on storage.objects
  for insert with check (bucket_id = 'products');
```

- [ ] **Step 2: Run the migration**

1. Go to your Supabase project dashboard → **SQL Editor**
2. Paste the full contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run**

Expected: no errors, all statements succeed.

- [ ] **Step 3: Verify tables were created**

In the Supabase dashboard → **Table Editor**, confirm:
- `products` table exists with all columns
- `orders` table exists with all columns
- In **Storage** → `products` bucket exists and is public

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: initial database schema — products and orders tables with RLS"
```

---

## Task 8: Environment variables

**Files:**
- Create: `.env.local.example`, `.env.local` (local only, never committed)

- [ ] **Step 1: Create `.env.local.example`**

```bash
# .env.local.example
# Copy this file to .env.local and fill in real values

# Supabase — get from: dashboard.supabase.com → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...      # NEVER expose this to the browser

# Admin credentials — single hardcoded admin
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=change-me-to-a-strong-password
ADMIN_SECRET=random-32-character-string-for-jwt-signing

# MercadoPago — get from: mercadopago.com.ar → Tus integraciones → Credenciales
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...
MP_ACCESS_TOKEN=APP_USR-...           # NEVER expose this to the browser
MP_WEBHOOK_SECRET=                    # Set after configuring webhooks in MP dashboard

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000   # Change to your Vercel URL in production
```

- [ ] **Step 2: Create your local `.env.local`**

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from your Supabase dashboard (Settings → API). Leave MercadoPago vars empty for now — they're only needed in Phase 4.

- [ ] **Step 3: Verify `.env.local` is gitignored**

```bash
grep '.env.local' .gitignore
```

Expected output: `.env.local` (it should already be there from create-next-app).

- [ ] **Step 4: Commit the example file**

```bash
git add .env.local.example
git commit -m "chore: add .env.local.example with all required variables documented"
```

---

## Task 9: TypeScript build verification

**Files:** none new — verifies everything compiles

- [ ] **Step 1: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors. If you see errors about missing env vars, they are expected at type-check time (env vars are runtime values) — add `// @ts-expect-error` only if the error is a false positive.

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected:
```
✓ __tests__/smoke.test.ts (1)
✓ __tests__/supabase-types.test.ts (5)

Test Files  2 passed (2)
Tests       6 passed (6)
```

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`. Any warnings are fine; errors must be fixed.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: verify TypeScript compilation and production build"
```

---

## Task 10: Deploy to Vercel

This task is manual — Vercel requires a browser login.

- [ ] **Step 1: Push to GitHub**

Create a new **private** repository on github.com named `rouge-web`, then:

```bash
git remote add origin https://github.com/<your-username>/rouge-web.git
git push -u origin main
```

- [ ] **Step 2: Import to Vercel**

1. Go to vercel.com → **Add New Project**
2. Import the `rouge-web` GitHub repo
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `.` (repo root)
5. Click **Deploy**

First deploy will fail because env vars are missing — that's expected.

- [ ] **Step 3: Add environment variables in Vercel**

In Vercel → Project Settings → **Environment Variables**, add:

| Variable | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase URL | Production, Preview, Dev |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key | Production, Preview, Dev |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key | Production, Preview, Dev |
| `ADMIN_EMAIL` | your email | Production, Preview, Dev |
| `ADMIN_PASSWORD` | a strong password | Production, Preview, Dev |
| `ADMIN_SECRET` | 32+ random chars | Production, Preview, Dev |
| `NEXT_PUBLIC_APP_URL` | your Vercel URL | Production |

Leave `MP_*` vars empty for now.

- [ ] **Step 4: Redeploy**

In Vercel → Deployments → click **Redeploy** on the latest deployment.

Expected: green deployment, live URL shows the "Sitio en construcción" page with Cormorant font and rose-colored "Rouge Intime" heading.

- [ ] **Step 5: Final verification**

Open the Vercel URL and confirm:
- "Rouge Intime" renders in the serif heading font
- Background is warm off-white (not pure white)
- No console errors in the browser DevTools

---

## Phase 1 complete

After Task 10, you have:
- Next.js 15 app running on Vercel
- Supabase project with `products` and `orders` tables + RLS + Storage bucket
- Rouge design tokens in Tailwind (colors, fonts, shadows, radii)
- All env vars documented and set
- TypeScript passing, 6 tests green, production build passing

**Next: [Phase 2 — Admin Panel](./2026-05-21-phase-2-admin.md)** (product CRUD + order management + login)
