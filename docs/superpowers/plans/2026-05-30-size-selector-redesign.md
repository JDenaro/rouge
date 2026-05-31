# Size Selector Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat size-pill array with a category-aware corpiño + pantalón two-selector system, plus an "A medida" mode with 5 required custom measurement fields.

**Architecture:** `CATEGORY_SIZES` config map in `lib/products.ts` drives which selectors `AddToCart` renders. `AddToCart` replaces its `sizes: string[]` prop with `category: ProductCategory` and handles all size state internally. Measurements serialize into the existing `size: string` cart field — no schema changes.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Vitest + @testing-library/react

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/products.ts` | Modify | Add `CategorySizesConfig` type + `CATEGORY_SIZES` map |
| `__tests__/size-selector.test.tsx` | Create | Unit tests for config + component |
| `components/store/AddToCart.tsx` | Rewrite | New two-selector + A medida UI, `category` prop replaces `sizes[]` |
| `app/(store)/producto/[slug]/page.tsx` | Modify | Pass `category` instead of `sizes` to `AddToCart`, remove `DEFAULT_SIZES` |

---

## Task 1: Add `CATEGORY_SIZES` to `lib/products.ts`

**Files:**
- Modify: `lib/products.ts`

- [ ] **Step 1: Add the type and map after the `CATEGORY_META` block**

Open `lib/products.ts`. After the closing `}` of `CATEGORY_META`, add:

```ts
export type CategorySizesConfig = {
  corpino: boolean
  pantalon: boolean
  aMedida: boolean
}

export const CATEGORY_SIZES: Record<ProductCategory, CategorySizesConfig> = {
  sets:                     { corpino: true,  pantalon: true,  aMedida: true  },
  'baby-doll':              { corpino: true,  pantalon: true,  aMedida: true  },
  body:                     { corpino: true,  pantalon: true,  aMedida: true  },
  catsuit:                  { corpino: true,  pantalon: true,  aMedida: true  },
  conjuntos:                { corpino: true,  pantalon: true,  aMedida: true  },
  corsets:                  { corpino: true,  pantalon: true,  aMedida: true  },
  bata:                     { corpino: true,  pantalon: true,  aMedida: true  },
  pijamas:                  { corpino: true,  pantalon: true,  aMedida: true  },
  disfraces:                { corpino: true,  pantalon: true,  aMedida: true  },
  'panty-vedetina-culotte': { corpino: false, pantalon: true,  aMedida: true  },
  sexshop:                  { corpino: false, pantalon: false, aMedida: false },
  'perfume-feromonas':      { corpino: false, pantalon: false, aMedida: false },
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

## Task 2: Write tests for `CATEGORY_SIZES` and the new `AddToCart`

**Files:**
- Create: `__tests__/size-selector.test.tsx`

- [ ] **Step 1: Create the test file**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CATEGORY_SIZES } from '@/lib/products'
import { AddToCart } from '@/components/store/AddToCart'

const mockAddItem = vi.fn()
vi.mock('@/components/store/CartContext', () => ({
  useCart: () => ({ addItem: mockAddItem }),
}))

beforeEach(() => { mockAddItem.mockClear() })

// ─── CATEGORY_SIZES config ───────────────────────────────────────────────────

describe('CATEGORY_SIZES', () => {
  it('sexshop has no selectors', () => {
    expect(CATEGORY_SIZES.sexshop).toEqual({ corpino: false, pantalon: false, aMedida: false })
  })

  it('perfume-feromonas has no selectors', () => {
    expect(CATEGORY_SIZES['perfume-feromonas']).toEqual({ corpino: false, pantalon: false, aMedida: false })
  })

  it('panty-vedetina-culotte has only pantalón + A medida', () => {
    expect(CATEGORY_SIZES['panty-vedetina-culotte']).toEqual({ corpino: false, pantalon: true, aMedida: true })
  })

  it('sets has all selectors', () => {
    expect(CATEGORY_SIZES.sets).toEqual({ corpino: true, pantalon: true, aMedida: true })
  })

  it('covers every ProductCategory', () => {
    const categories = [
      'sets', 'baby-doll', 'body', 'catsuit', 'conjuntos', 'corsets',
      'bata', 'pijamas', 'disfraces', 'sexshop', 'perfume-feromonas',
      'panty-vedetina-culotte',
    ] as const
    categories.forEach((cat) => {
      expect(CATEGORY_SIZES[cat]).toBeDefined()
    })
  })
})

// ─── AddToCart component ─────────────────────────────────────────────────────

const baseProps = {
  productId: 'p1',
  slug: 'test-product',
  name: 'Test Product',
  price: 10000,
  image: '',
  colors: [],
}

describe('AddToCart — standard category (sets)', () => {
  it('renders corpiño and pantalón selectors', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    expect(screen.getByText('Talle corpiño')).toBeTruthy()
    expect(screen.getByText('Talle pantalón')).toBeTruthy()
  })

  it('renders "A medida" pill', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    expect(screen.getByText('A medida')).toBeTruthy()
  })

  it('renders the legend about A medida', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    expect(screen.getByText(/Si necesitás un talle distinto/)).toBeTruthy()
  })

  it('clicking "A medida" hides selectors and shows measurement fields', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    fireEvent.click(screen.getByText('A medida'))
    expect(screen.queryByText('Talle corpiño')).toBeNull()
    expect(screen.queryByText('Talle pantalón')).toBeNull()
    expect(screen.getByText('Bajo busto')).toBeTruthy()
    expect(screen.getByText('Busto')).toBeTruthy()
    expect(screen.getByText('Cadera')).toBeTruthy()
    expect(screen.getByText('Cintura')).toBeTruthy()
    expect(screen.getByText('Largo de bajo busto a pelvis')).toBeTruthy()
  })

  it('blocks adding to cart when A medida fields are empty', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    fireEvent.click(screen.getByText('A medida'))
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).not.toHaveBeenCalled()
    expect(screen.getByText('Completá todas las medidas')).toBeTruthy()
  })

  it('adds to cart with serialized A medida string when all fields are filled', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    fireEvent.click(screen.getByText('A medida'))
    const inputs = document.querySelectorAll('input[type="text"]')
    const values = ['80', '90', '95', '68', '25']
    inputs.forEach((input, i) => fireEvent.change(input, { target: { value: values[i] } }))
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        size: 'A medida — BB: 80cm / B: 90cm / C: 95cm / Ci: 68cm / L: 25cm',
      }),
      1,
    )
  })

  it('adds to cart with corpiño/pantalón serialization in standard mode', () => {
    render(<AddToCart {...baseProps} category="sets" />)
    fireEvent.click(screen.getByText('95'))   // select corpiño 95
    fireEvent.click(screen.getByText('42'))   // select pantalón 42
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ size: 'Corpiño: 95 / Pantalón: 42' }),
      1,
    )
  })
})

describe('AddToCart — panty-vedetina-culotte', () => {
  it('does not render corpiño selector', () => {
    render(<AddToCart {...baseProps} category="panty-vedetina-culotte" />)
    expect(screen.queryByText('Talle corpiño')).toBeNull()
  })

  it('renders pantalón selector', () => {
    render(<AddToCart {...baseProps} category="panty-vedetina-culotte" />)
    expect(screen.getByText('Talle pantalón')).toBeTruthy()
  })

  it('serializes as Pantalón only', () => {
    render(<AddToCart {...baseProps} category="panty-vedetina-culotte" />)
    fireEvent.click(screen.getByText('40'))
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ size: 'Pantalón: 40' }),
      1,
    )
  })
})

describe('AddToCart — sexshop', () => {
  it('renders no size selectors', () => {
    render(<AddToCart {...baseProps} category="sexshop" />)
    expect(screen.queryByText('Talle corpiño')).toBeNull()
    expect(screen.queryByText('Talle pantalón')).toBeNull()
    expect(screen.queryByText('A medida')).toBeNull()
  })

  it('adds to cart with empty size string', () => {
    render(<AddToCart {...baseProps} category="sexshop" />)
    fireEvent.click(screen.getByText('Agregar al carrito'))
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({ size: '' }),
      1,
    )
  })
})
```

- [ ] **Step 2: Run tests — expect failures (AddToCart not yet updated)**

```bash
npm test -- __tests__/size-selector.test.tsx
```

Expected: `CATEGORY_SIZES` tests pass, `AddToCart` tests fail (component still uses old `sizes[]` prop).

---

## Task 3: Rewrite `components/store/AddToCart.tsx`

**Files:**
- Rewrite: `components/store/AddToCart.tsx`

- [ ] **Step 1: Replace the entire file with the new implementation**

```tsx
'use client'

import { useState } from 'react'
import { useCart } from '@/components/store/CartContext'
import { CATEGORY_SIZES } from '@/lib/products'
import type { ProductCategory } from '@/lib/supabase/types'

const CORPINO_SIZES = [85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150].map(String)
const PANTALON_SIZES = [36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56].map(String)

type Medidas = {
  bajoBusto: string
  busto: string
  cadera: string
  cintura: string
  largo: string
}

type Props = {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  category: ProductCategory
  colors: string[]
}

export function AddToCart({ productId, slug, name, price, image, category, colors }: Props) {
  const { addItem } = useCart()
  const cfg = CATEGORY_SIZES[category]

  const [corpino, setCorpino] = useState<string>(CORPINO_SIZES[0])
  const [pantalon, setPantalon] = useState<string>(PANTALON_SIZES[0])
  const [aMedida, setAMedida] = useState(false)
  const [medidas, setMedidas] = useState<Medidas>({
    bajoBusto: '', busto: '', cadera: '', cintura: '', largo: '',
  })
  const [color, setColor] = useState<string>(colors[0] ?? '')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  function buildSizeString(): string {
    if (aMedida) {
      return `A medida — BB: ${medidas.bajoBusto}cm / B: ${medidas.busto}cm / C: ${medidas.cadera}cm / Ci: ${medidas.cintura}cm / L: ${medidas.largo}cm`
    }
    if (cfg.corpino && cfg.pantalon) return `Corpiño: ${corpino} / Pantalón: ${pantalon}`
    if (cfg.pantalon) return `Pantalón: ${pantalon}`
    return ''
  }

  const handleAdd = () => {
    if (colors.length > 0 && !color) {
      setError('Elegí un color')
      return
    }
    if (aMedida && Object.values(medidas).some((v) => !v.trim())) {
      setError('Completá todas las medidas')
      return
    }
    setError(null)
    addItem({ productId, slug, name, price, image, size: buildSizeString(), color }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const resetAMedida = () => {
    setAMedida(false)
    setMedidas({ bajoBusto: '', busto: '', cadera: '', cintura: '', largo: '' })
  }

  const showSizes = cfg.corpino || cfg.pantalon

  return (
    <div>
      {showSizes && !aMedida && (
        <>
          {cfg.corpino && (
            <Section title="Talle corpiño">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {CORPINO_SIZES.map((s) => (
                  <button key={s} type="button" onClick={() => setCorpino(s)} style={pillStyle(s === corpino)}>
                    {s}
                  </button>
                ))}
                {!cfg.pantalon && cfg.aMedida && (
                  <button type="button" onClick={() => setAMedida(true)} style={pillStyle(false)}>
                    A medida
                  </button>
                )}
              </div>
            </Section>
          )}

          {cfg.pantalon && (
            <Section title="Talle pantalón">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {PANTALON_SIZES.map((s) => (
                  <button key={s} type="button" onClick={() => setPantalon(s)} style={pillStyle(s === pantalon)}>
                    {s}
                  </button>
                ))}
                {cfg.aMedida && (
                  <button type="button" onClick={() => setAMedida(true)} style={pillStyle(false)}>
                    A medida
                  </button>
                )}
              </div>
            </Section>
          )}

          {cfg.aMedida && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-fg)',
              opacity: 0.6,
              margin: 0,
              marginTop: '-0.5rem',
              marginBottom: '1.25rem',
            }}>
              Si necesitás un talle distinto, seleccioná la opción A medida.
            </p>
          )}
        </>
      )}

      {aMedida && (
        <Section title="Medidas personalizadas">
          {(
            [
              { key: 'bajoBusto', label: 'Bajo busto' },
              { key: 'busto', label: 'Busto' },
              { key: 'cadera', label: 'Cadera' },
              { key: 'cintura', label: 'Cintura' },
              { key: 'largo', label: 'Largo de bajo busto a pelvis' },
            ] as const
          ).map(({ key, label }) => (
            <MedidaInput
              key={key}
              label={label}
              value={medidas[key]}
              onChange={(v) => setMedidas((prev) => ({ ...prev, [key]: v }))}
            />
          ))}
          <button
            type="button"
            onClick={resetAMedida}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '1rem',
            }}
          >
            ← Volver a talles estándar
          </button>
        </Section>
      )}

      {colors.length > 0 && (
        <Section title="Color">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {colors.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)} style={pillStyle(c === color)}>
                {c}
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section title="Cantidad">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="button" aria-label="Disminuir" onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtnStyle}>
            −
          </button>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', minWidth: '32px', textAlign: 'center', fontWeight: 500 }}>
            {qty}
          </span>
          <button type="button" aria-label="Aumentar" onClick={() => setQty((q) => Math.min(10, q + 1))} style={qtyBtnStyle}>
            +
          </button>
        </div>
      </Section>

      {error && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-primary)', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '1rem 1.5rem', fontSize: '0.9375rem' }}
      >
        {added ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Agregado al carrito
          </>
        ) : (
          <>
            Agregar al carrito
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}

function MedidaInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--color-fg)',
        opacity: 0.7,
        marginBottom: '0.25rem',
      }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ej: 85"
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          background: 'white',
          border: '1px solid rgba(192, 68, 90, 0.18)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-fg)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h3 style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--color-fg)',
        opacity: 0.6,
        margin: 0,
        marginBottom: '0.625rem',
      }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: '0.5rem 0.875rem',
    border: active ? '1px solid var(--color-primary)' : '1px solid rgba(192, 68, 90, 0.18)',
    background: active ? 'rgba(192, 68, 90, 0.08)' : 'white',
    color: active ? 'var(--color-primary)' : 'var(--color-fg)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--dur-fast) var(--ease-out)',
  }
}

const qtyBtnStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-md)',
  background: 'rgba(192, 68, 90, 0.08)',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
}
```

- [ ] **Step 2: Run the tests**

```bash
npm test -- __tests__/size-selector.test.tsx
```

Expected: all tests pass.

- [ ] **Step 3: Run the full test suite**

```bash
npm test
```

Expected: all 29 existing tests + new tests pass. The `checkout-actions` test imports `CartLineInput` without a `size` constraint — it should be unaffected.

---

## Task 4: Update product page

**Files:**
- Modify: `app/(store)/producto/[slug]/page.tsx`

- [ ] **Step 1: Remove `DEFAULT_SIZES` and the `sizes` variable, pass `category` to `AddToCart`**

In `app/(store)/producto/[slug]/page.tsx`:

Remove this line near the top of the component:
```ts
const DEFAULT_SIZES = ['85', '90', '95', '100', '105', '110', '115', '120']
```

Remove this line inside the component body:
```ts
const sizes = product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES
```

Change the `AddToCart` usage from:
```tsx
<AddToCart
  productId={product.id}
  slug={product.slug}
  name={product.name}
  price={product.price}
  image={image}
  sizes={sizes}
  colors={colors}
/>
```

To:
```tsx
<AddToCart
  productId={product.id}
  slug={product.slug}
  name={product.name}
  price={product.price}
  image={image}
  category={product.category}
  colors={colors}
/>
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/products.ts components/store/AddToCart.tsx app/\(store\)/producto/\[slug\]/page.tsx __tests__/size-selector.test.tsx
git commit -m "feat(product): redesign size selector with corpiño/pantalón + A medida option"
```

---

## Self-Review

**Spec coverage:**
- ✅ Corpiño (85–150, step 5) and pantalón (36–56, step 2) selectors
- ✅ "A medida" pill at end of last size section
- ✅ 5 required measurement fields (bajo busto, busto, cadera, cintura, largo)
- ✅ All fields required before add-to-cart
- ✅ Legend: "Si necesitás un talle distinto, seleccioná la opción A medida"
- ✅ sexshop: no selectors
- ✅ perfume-feromonas: no selectors
- ✅ panty-vedetina-culotte: only pantalón
- ✅ Serialization tested for all three modes

**Placeholders:** None.

**Type consistency:** `category: ProductCategory` defined in Task 3 props, used in Task 4 product page. `CATEGORY_SIZES` defined in Task 1, imported in AddToCart in Task 3. `Medidas` type internal to AddToCart. All consistent.
