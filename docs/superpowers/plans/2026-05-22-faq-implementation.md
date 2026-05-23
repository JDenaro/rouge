# FAQ Section + /faq Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a FAQ section on the home (top 6 questions) and a dedicated `/faq` page (all 13, grouped by category) with FAQPage JSON-LD schema for SEO.

**Architecture:** A typed static data module (`lib/faq.ts`) feeds a reusable, server-rendered accordion (`components/store/FAQ.tsx`) using native HTML `<details>`/`<summary>` (zero JS, accessible by default). The home renders a 6-item variant; `/faq` renders all 13 grouped by category and injects a JSON-LD `FAQPage` schema. The Footer gets a new "Preguntas frecuentes" link.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Vitest + @testing-library/react · existing design tokens in `app/globals.css` `@theme`.

**Spec:** `docs/superpowers/specs/2026-05-22-faq-design.md`

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `lib/faq.ts` | Typed FAQ data, helpers, JSON-LD schema builder | Create |
| `__tests__/faq.test.ts` | Unit tests for data + helpers + schema builder | Create |
| `components/store/FAQ.tsx` | Reusable accordion (home + page variants), `parseAnswer` link helper | Create |
| `__tests__/FAQ.test.tsx` | Component tests | Create |
| `app/(store)/faq/page.tsx` | Dedicated `/faq` page with metadata + JSON-LD + grouped FAQ | Create |
| `app/(store)/page.tsx` | Insert `<FAQ items={getFeaturedFAQ()} showCta />` between HowItWorks and Footer | Modify |
| `components/store/Footer.tsx` | Add "Preguntas frecuentes" link in Información column | Modify |

---

## Task 1: FAQ data module + tests

**Files:**
- Create: `lib/faq.ts`
- Create: `__tests__/faq.test.ts`

- [ ] **Step 1.1: Write the failing tests**

Create `__tests__/faq.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  FAQ_ITEMS,
  FAQ_CATEGORY_LABELS,
  getFeaturedFAQ,
  groupFAQByCategory,
} from '@/lib/faq'

describe('FAQ data', () => {
  it('has 13 items total', () => {
    expect(FAQ_ITEMS).toHaveLength(13)
  })

  it('every item has a unique numeric id', () => {
    const ids = FAQ_ITEMS.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach((id) => expect(typeof id).toBe('number'))
  })

  it('has 4 category labels', () => {
    expect(Object.keys(FAQ_CATEGORY_LABELS)).toHaveLength(4)
  })

  it('getFeaturedFAQ returns exactly 6 items, all featured', () => {
    const featured = getFeaturedFAQ()
    expect(featured).toHaveLength(6)
    expect(featured.every((i) => i.featured)).toBe(true)
  })

  it('groupFAQByCategory groups by 4 categories with counts 4/3/3/3', () => {
    const grouped = groupFAQByCategory()
    expect(grouped['made-to-order']).toHaveLength(4)
    expect(grouped['sizing']).toHaveLength(3)
    expect(grouped['shipping']).toHaveLength(3)
    expect(grouped['payments']).toHaveLength(3)
  })

  it('every answer is a non-empty string', () => {
    FAQ_ITEMS.forEach((i) => {
      expect(i.answer.length).toBeGreaterThan(10)
    })
  })
})
```

- [ ] **Step 1.2: Run test → expect FAIL**

Run: `npm test -- faq.test.ts`
Expected: FAIL with "Cannot find module '@/lib/faq'"

- [ ] **Step 1.3: Create `lib/faq.ts` with data + helpers**

```ts
export type FAQCategory = 'made-to-order' | 'sizing' | 'shipping' | 'payments'

export type FAQItem = {
  id: number
  category: FAQCategory
  question: string
  answer: string
  featured: boolean
}

export const FAQ_CATEGORY_LABELS: Record<FAQCategory, string> = {
  'made-to-order': 'Hechas a medida',
  sizing: 'Talles y medidas',
  shipping: 'Envíos',
  payments: 'Pagos',
}

export const FAQ_ITEMS: readonly FAQItem[] = [
  {
    id: 1,
    category: 'made-to-order',
    question: '¿Cuánto demora una prenda hecha a medida?',
    answer:
      'Cada pieza se confecciona en 15-20 días hábiles desde que se confirma el pago.',
    featured: true,
  },
  {
    id: 2,
    category: 'made-to-order',
    question: '¿Puedo elegir telas y colores?',
    answer:
      'Sí, en cada producto se muestran las opciones disponibles. Para variaciones específicas, escribinos por WhatsApp.',
    featured: false,
  },
  {
    id: 3,
    category: 'made-to-order',
    question: '¿Hacen modelos personalizados?',
    answer:
      'Sí, adaptamos cualquier modelo a tu talla y preferencias. Consultanos por WhatsApp con la idea.',
    featured: false,
  },
  {
    id: 4,
    category: 'made-to-order',
    question: '¿Vienen con packaging especial?',
    answer:
      'Sí, todas las prendas se envían en empaque Rouge Intime listo para regalo.',
    featured: false,
  },
  {
    id: 5,
    category: 'sizing',
    question: '¿Cómo me tomo las medidas?',
    answer:
      'Seguí nuestra [guía de talles](/guia-de-talles) paso a paso. Si tenés dudas, contactanos por WhatsApp.',
    featured: true,
  },
  {
    id: 6,
    category: 'sizing',
    question: '¿Atienden talles grandes?',
    answer:
      'Sí, trabajamos desde el 85 hasta el 140+ en corpiños y desde S hasta 5XL en bombachas.',
    featured: true,
  },
  {
    id: 7,
    category: 'sizing',
    question: '¿Qué pasa si la prenda no me queda?',
    answer:
      'Por ser hecha a medida no aceptamos cambios por talle salvo defecto de confección. Por eso es clave [medirse bien antes de pedir](/politica-de-cambios).',
    featured: true,
  },
  {
    id: 8,
    category: 'shipping',
    question: '¿Hacen envíos a todo el país?',
    answer:
      'Sí, enviamos a todo el país por Andreani / Correo Argentino con tracking.',
    featured: true,
  },
  {
    id: 9,
    category: 'shipping',
    question: '¿Cuánto demora el envío?',
    answer:
      '3-7 días hábiles desde que despachamos (luego de los 15-20 días de confección).',
    featured: false,
  },
  {
    id: 10,
    category: 'shipping',
    question: '¿Hacen envíos al exterior?',
    answer: 'Por el momento solo enviamos dentro de Argentina.',
    featured: false,
  },
  {
    id: 11,
    category: 'payments',
    question: '¿Qué medios de pago aceptan?',
    answer:
      'Transferencia bancaria (12% OFF), tarjeta de crédito hasta 3 cuotas sin interés, y Mercado Pago.',
    featured: true,
  },
  {
    id: 12,
    category: 'payments',
    question: '¿Cuándo se confirma mi pago?',
    answer:
      'Las transferencias se confirman en horas hábiles tras recibir el comprobante. Mercado Pago y tarjeta son inmediatos.',
    featured: false,
  },
  {
    id: 13,
    category: 'payments',
    question: '¿Es seguro pagar online?',
    answer:
      'Sí, los pagos con tarjeta se procesan por Mercado Pago. La transferencia es a cuenta bancaria a nombre de la marca.',
    featured: false,
  },
]

export function getFeaturedFAQ(): FAQItem[] {
  return FAQ_ITEMS.filter((i) => i.featured)
}

export function groupFAQByCategory(): Record<FAQCategory, FAQItem[]> {
  const groups: Record<FAQCategory, FAQItem[]> = {
    'made-to-order': [],
    sizing: [],
    shipping: [],
    payments: [],
  }
  for (const item of FAQ_ITEMS) {
    groups[item.category].push(item)
  }
  return groups
}
```

- [ ] **Step 1.4: Run tests → expect PASS**

Run: `npm test -- faq.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 1.5: Commit**

```bash
git add lib/faq.ts __tests__/faq.test.ts
git commit -m "feat(faq): add typed FAQ data module with 13 Q&A and helpers"
```

---

## Task 2: JSON-LD FAQPage schema builder

**Files:**
- Modify: `lib/faq.ts` (add `buildFAQPageSchema` export)
- Modify: `__tests__/faq.test.ts` (add schema tests)

- [ ] **Step 2.1: Add the failing tests**

Append to `__tests__/faq.test.ts`:

```ts
import { buildFAQPageSchema } from '@/lib/faq'

describe('buildFAQPageSchema', () => {
  it('returns a FAQPage object with mainEntity array', () => {
    const schema = buildFAQPageSchema(FAQ_ITEMS)
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(FAQ_ITEMS.length)
  })

  it('each mainEntity item has name and acceptedAnswer.text', () => {
    const schema = buildFAQPageSchema(FAQ_ITEMS.slice(0, 3))
    schema.mainEntity.forEach((entity, i) => {
      expect(entity['@type']).toBe('Question')
      expect(entity.name).toBe(FAQ_ITEMS[i].question)
      expect(entity.acceptedAnswer['@type']).toBe('Answer')
      expect(typeof entity.acceptedAnswer.text).toBe('string')
      expect(entity.acceptedAnswer.text.length).toBeGreaterThan(0)
    })
  })

  it('strips markdown-style links from answer text in schema', () => {
    const items = [FAQ_ITEMS.find((i) => i.id === 5)!]
    const schema = buildFAQPageSchema(items)
    const text = schema.mainEntity[0].acceptedAnswer.text
    expect(text).not.toMatch(/\[.*\]\(.*\)/)
    expect(text).toContain('guía de talles')
  })
})
```

- [ ] **Step 2.2: Run tests → expect FAIL**

Run: `npm test -- faq.test.ts`
Expected: FAIL with "buildFAQPageSchema is not a function".

- [ ] **Step 2.3: Add `buildFAQPageSchema` to `lib/faq.ts`**

Append to `lib/faq.ts`:

```ts
type FAQPageSchema = {
  '@context': 'https://schema.org'
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

// Strip markdown-style [text](url) links from a string, leaving just the text.
function stripMarkdownLinks(input: string): string {
  return input.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

export function buildFAQPageSchema(items: readonly FAQItem[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripMarkdownLinks(item.answer),
      },
    })),
  }
}
```

- [ ] **Step 2.4: Run tests → expect PASS**

Run: `npm test -- faq.test.ts`
Expected: PASS (9 tests total).

- [ ] **Step 2.5: Commit**

```bash
git add lib/faq.ts __tests__/faq.test.ts
git commit -m "feat(faq): add buildFAQPageSchema helper for JSON-LD"
```

---

## Task 3: FAQ accordion component + tests

**Files:**
- Create: `components/store/FAQ.tsx`
- Create: `__tests__/FAQ.test.tsx`

- [ ] **Step 3.1: Write the failing component tests**

Create `__tests__/FAQ.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FAQ } from '@/components/store/FAQ'
import { FAQ_ITEMS, getFeaturedFAQ } from '@/lib/faq'

describe('FAQ component', () => {
  it('renders all provided items as <details>', () => {
    const items = FAQ_ITEMS.slice(0, 3)
    const { container } = render(<FAQ items={items} />)
    const details = container.querySelectorAll('details')
    expect(details).toHaveLength(3)
  })

  it('shows the question in each <summary>', () => {
    const items = getFeaturedFAQ()
    render(<FAQ items={items} />)
    items.forEach((item) => {
      expect(screen.getByText(item.question)).toBeTruthy()
    })
  })

  it('renders category headings when groupByCategory is true', () => {
    render(<FAQ items={FAQ_ITEMS} groupByCategory />)
    expect(screen.getByText('Hechas a medida')).toBeTruthy()
    expect(screen.getByText('Talles y medidas')).toBeTruthy()
    expect(screen.getByText('Envíos')).toBeTruthy()
    expect(screen.getByText('Pagos')).toBeTruthy()
  })

  it('does not render category headings when groupByCategory is false', () => {
    render(<FAQ items={FAQ_ITEMS} />)
    expect(screen.queryByText('Hechas a medida')).toBeNull()
  })

  it('renders the CTA link when showCta is true', () => {
    render(<FAQ items={getFeaturedFAQ()} showCta />)
    const cta = screen.getByRole('link', { name: /ver todas las preguntas/i })
    expect(cta.getAttribute('href')).toBe('/faq')
  })

  it('parses markdown links in answers into anchor elements', () => {
    const items = [FAQ_ITEMS.find((i) => i.id === 5)!] // contains /guia-de-talles link
    const { container } = render(<FAQ items={items} />)
    const link = container.querySelector('a[href="/guia-de-talles"]')
    expect(link).toBeTruthy()
    expect(link?.textContent).toBe('guía de talles')
  })
})
```

- [ ] **Step 3.2: Run tests → expect FAIL**

Run: `npm test -- FAQ.test.tsx`
Expected: FAIL with "Cannot find module '@/components/store/FAQ'".

- [ ] **Step 3.3: Implement `components/store/FAQ.tsx`**

```tsx
import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  type FAQItem,
  FAQ_CATEGORY_LABELS,
  groupFAQByCategory,
} from '@/lib/faq'

type FAQProps = {
  items: FAQItem[]
  showCta?: boolean
  groupByCategory?: boolean
}

// Convert "text with [label](url) inline" to ReactNodes — links become <Link> for
// internal hrefs, <a> for external. Only one helper handles the whole answer body.
function parseAnswer(text: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g
  const out: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push(text.slice(lastIndex, match.index))
    }
    const [, label, href] = match
    const isInternal = href.startsWith('/')
    if (isInternal) {
      out.push(
        <Link
          key={key++}
          href={href}
          style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
        >
          {label}
        </Link>,
      )
    } else {
      out.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}
        >
          {label}
        </a>,
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex))
  }
  return out
}

function FAQList({ items }: { items: FAQItem[] }) {
  return (
    <div>
      {items.map((item) => (
        <details key={item.id} className="rouge-faq-item">
          <summary>{item.question}</summary>
          <div className="rouge-faq-answer">{parseAnswer(item.answer)}</div>
        </details>
      ))}
    </div>
  )
}

export function FAQ({ items, showCta, groupByCategory }: FAQProps) {
  const grouped = groupByCategory ? groupFAQByCategory() : null

  return (
    <section className="rouge-faq-section">
      <div className="rouge-faq-container">
        {grouped ? (
          (Object.keys(grouped) as Array<keyof typeof grouped>).map((cat) => {
            const list = grouped[cat]
            if (list.length === 0) return null
            return (
              <div key={cat} className="rouge-faq-group">
                <h3 className="rouge-faq-cat">{FAQ_CATEGORY_LABELS[cat]}</h3>
                <FAQList items={list} />
              </div>
            )
          })
        ) : (
          <FAQList items={items} />
        )}

        {showCta && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link
              href="/faq"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              Ver todas las preguntas
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .rouge-faq-section {
          padding: 5rem 1.5rem;
        }
        .rouge-faq-container {
          max-width: 720px;
          margin: 0 auto;
        }
        .rouge-faq-group + .rouge-faq-group {
          margin-top: 2.5rem;
        }
        .rouge-faq-cat {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--color-primary);
          margin: 0 0 1rem;
        }
        .rouge-faq-item {
          border-bottom: 1px solid rgba(192, 68, 90, 0.12);
        }
        .rouge-faq-item > summary {
          list-style: none;
          cursor: pointer;
          padding: 1.25rem 2.5rem 1.25rem 0;
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 500;
          color: var(--color-fg);
          position: relative;
          transition: color var(--dur-fast) var(--ease-out);
        }
        .rouge-faq-item > summary::-webkit-details-marker {
          display: none;
        }
        .rouge-faq-item > summary::after {
          content: '+';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-body);
          font-size: 1.5rem;
          font-weight: 300;
          color: var(--color-primary);
          transition: transform var(--dur-mid) var(--ease-out);
        }
        .rouge-faq-item[open] > summary::after {
          transform: translateY(-50%) rotate(45deg);
        }
        .rouge-faq-item > summary:hover {
          color: var(--color-primary);
        }
        .rouge-faq-answer {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--color-fg);
          opacity: 0.85;
          padding: 0 0 1.25rem;
        }
      `}</style>
    </section>
  )
}
```

- [ ] **Step 3.4: Run tests → expect PASS**

Run: `npm test -- FAQ.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 3.5: Verify type checking is clean**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 3.6: Commit**

```bash
git add components/store/FAQ.tsx __tests__/FAQ.test.tsx
git commit -m "feat(faq): add reusable FAQ accordion component with link parsing"
```

---

## Task 4: Wire FAQ into home page

**Files:**
- Modify: `app/(store)/page.tsx`

- [ ] **Step 4.1: Add import + section**

Edit `app/(store)/page.tsx`:

1. Add to the imports block:

```tsx
import { FAQ } from '@/components/store/FAQ'
import { getFeaturedFAQ } from '@/lib/faq'
```

2. Inside the returned JSX, insert `<FAQ ... />` between `<HowItWorks />` and the closing fragment:

```tsx
      <HowItWorks />
      <FAQ items={getFeaturedFAQ()} showCta />
    </>
```

3. Add a section header above the FAQ. Wrap the inserted call:

Replace the inserted line with:

```tsx
      <HowItWorks />
      <section style={{ padding: '4rem 1.5rem 0', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-primary)',
          marginBottom: '0.75rem',
        }}>
          ¿Tenés dudas?
        </p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 500,
          color: 'var(--color-fg)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Preguntas frecuentes
        </h2>
      </section>
      <FAQ items={getFeaturedFAQ()} showCta />
    </>
```

- [ ] **Step 4.2: Start dev server (if not running) and verify visually**

Check dev server: `curl -sf http://localhost:3000 >/dev/null && echo OK || npm run dev &`

Run Playwright check:

```bash
python3 - <<'EOF'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(800)
    page.evaluate("document.querySelector('.rouge-faq-section').scrollIntoView()")
    page.wait_for_timeout(400)
    page.screenshot(path='/tmp/faq-home-desktop.png')
    m = b.new_page(viewport={'width': 393, 'height': 851})
    m.goto('http://localhost:3000')
    m.wait_for_load_state('networkidle')
    m.wait_for_timeout(800)
    m.evaluate("document.querySelector('.rouge-faq-section').scrollIntoView()")
    m.wait_for_timeout(400)
    m.screenshot(path='/tmp/faq-home-mobile.png')
    b.close()
EOF
```

Open `/tmp/faq-home-desktop.png` and `/tmp/faq-home-mobile.png`. Expected: 6 accordion items + "¿Tenés dudas? / Preguntas frecuentes" header above + "Ver todas las preguntas →" CTA below. Clicking a `<summary>` expands it.

- [ ] **Step 4.3: Verify accordion toggles**

In Playwright, click the first summary, screenshot, confirm it expanded:

```bash
python3 - <<'EOF'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    page.evaluate("document.querySelector('.rouge-faq-section').scrollIntoView()")
    page.wait_for_timeout(300)
    page.click('.rouge-faq-item summary >> nth=0')
    page.wait_for_timeout(300)
    page.screenshot(path='/tmp/faq-home-expanded.png')
    b.close()
EOF
```

Open `/tmp/faq-home-expanded.png`. First item should be expanded showing the answer text.

- [ ] **Step 4.4: Commit**

```bash
git add "app/(store)/page.tsx"
git commit -m "feat(home): add FAQ section with top 6 questions between HowItWorks and Footer"
```

---

## Task 5: Dedicated /faq page with JSON-LD schema

**Files:**
- Create: `app/(store)/faq/page.tsx`

- [ ] **Step 5.1: Create the page**

Create `app/(store)/faq/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { FAQ } from '@/components/store/FAQ'
import { FAQ_ITEMS, buildFAQPageSchema } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes | Rouge Intime',
  description:
    'Plazos de producción, talles, envíos y pagos — todo lo que necesitás saber antes de pedir tu prenda a medida.',
}

export default function FAQPage() {
  const schema = buildFAQPageSchema(FAQ_ITEMS)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main>
        <header
          style={{
            padding: '8rem 1.5rem 3rem',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              marginBottom: '0.75rem',
            }}
          >
            Ayuda
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 500,
              color: 'var(--color-fg)',
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            Preguntas frecuentes
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--color-fg)',
              opacity: 0.75,
              marginTop: '1.25rem',
            }}
          >
            Plazos, talles, envíos y pagos. Si no encontrás tu pregunta, escribinos por WhatsApp.
          </p>
        </header>
        <FAQ items={FAQ_ITEMS} groupByCategory />
      </main>
    </>
  )
}
```

- [ ] **Step 5.2: Verify the page renders**

Make sure dev server is running, then:

```bash
curl -s http://localhost:3000/faq | grep -c 'application/ld+json'
```

Expected: `1` (the schema script tag is present).

```bash
curl -s http://localhost:3000/faq | grep -o 'FAQPage' | head -1
```

Expected: `FAQPage`.

- [ ] **Step 5.3: Take screenshots**

```bash
python3 - <<'EOF'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:3000/faq')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)
    page.screenshot(path='/tmp/faq-page-desktop.png', full_page=True)
    m = b.new_page(viewport={'width': 393, 'height': 851})
    m.goto('http://localhost:3000/faq')
    m.wait_for_load_state('networkidle')
    m.wait_for_timeout(500)
    m.screenshot(path='/tmp/faq-page-mobile.png', full_page=True)
    b.close()
EOF
```

Open both screenshots. Expected:
- Header "Ayuda / Preguntas frecuentes" + intro paragraph
- 4 category sections (Hechas a medida, Talles y medidas, Envíos, Pagos) each with their items
- All items are collapsed by default

- [ ] **Step 5.4: Verify schema validity**

Print the embedded JSON-LD and parse it:

```bash
curl -s http://localhost:3000/faq | python3 -c "
import sys, re, json
m = re.search(r'<script type=\"application/ld\+json\">(.+?)</script>', sys.stdin.read(), re.DOTALL)
schema = json.loads(m.group(1))
assert schema['@context'] == 'https://schema.org'
assert schema['@type'] == 'FAQPage'
assert len(schema['mainEntity']) == 13
print('schema OK, 13 entries')
"
```

Expected: `schema OK, 13 entries`.

- [ ] **Step 5.5: Commit**

```bash
git add "app/(store)/faq/page.tsx"
git commit -m "feat(faq): add /faq page with grouped questions and JSON-LD schema"
```

---

## Task 6: Footer link

**Files:**
- Modify: `components/store/Footer.tsx`

- [ ] **Step 6.1: Add the "Preguntas frecuentes" link**

In `components/store/Footer.tsx`, locate the "Información" column (around line 60):

```tsx
          <div>
            <h4 style={footerHeading}>Información</h4>
            <ul style={footerList}>
              <li><Link href="/guia-de-talles" style={footerLink}>Guía de talles</Link></li>
              <li><Link href="/politica-de-cambios" style={footerLink}>Política de cambios</Link></li>
              <li><Link href="/contacto" style={footerLink}>Contacto</Link></li>
            </ul>
          </div>
```

Add a new `<li>` for FAQ as the second entry (after Guía de talles, before Política):

```tsx
          <div>
            <h4 style={footerHeading}>Información</h4>
            <ul style={footerList}>
              <li><Link href="/guia-de-talles" style={footerLink}>Guía de talles</Link></li>
              <li><Link href="/faq" style={footerLink}>Preguntas frecuentes</Link></li>
              <li><Link href="/politica-de-cambios" style={footerLink}>Política de cambios</Link></li>
              <li><Link href="/contacto" style={footerLink}>Contacto</Link></li>
            </ul>
          </div>
```

- [ ] **Step 6.2: Verify the link renders**

```bash
curl -s http://localhost:3000 | grep -c 'href="/faq"'
```

Expected: at least `1` (the footer link appears on every store page).

- [ ] **Step 6.3: Commit**

```bash
git add components/store/Footer.tsx
git commit -m "feat(footer): add Preguntas frecuentes link to Información column"
```

---

## Task 7: Final verification

**Files:** (none — verification only)

- [ ] **Step 7.1: Run the full test suite**

Run: `npm test`
Expected: all tests pass (existing + new). The new file expectations: `__tests__/faq.test.ts` (9 tests) + `__tests__/FAQ.test.tsx` (6 tests).

- [ ] **Step 7.2: Run lint**

Run: `npm run lint`
Expected: no errors. If any warnings reference the new files, fix them; otherwise leave preexisting warnings as-is.

- [ ] **Step 7.3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: no output (clean).

- [ ] **Step 7.4: Run production build**

Run: `npm run build`
Expected: build succeeds. The `/faq` route appears in the build output as a static route.

- [ ] **Step 7.5: Final visual verification**

```bash
python3 - <<'EOF'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    # Home — desktop and mobile
    for w,h,name in [(1440,900,'desktop'),(393,851,'mobile')]:
        page = b.new_page(viewport={'width': w, 'height': h})
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(600)
        page.screenshot(path=f'/tmp/final-home-{name}.png', full_page=True)
        # /faq
        page.goto('http://localhost:3000/faq')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(600)
        page.screenshot(path=f'/tmp/final-faq-{name}.png', full_page=True)
    b.close()
EOF
```

Open all 4 screenshots and confirm:
- `final-home-desktop.png`, `final-home-mobile.png`: FAQ section after HowItWorks, with header + 6 items + CTA. Footer has Preguntas frecuentes link.
- `final-faq-desktop.png`, `final-faq-mobile.png`: Page header + 4 grouped sections + 13 items, all collapsed.

- [ ] **Step 7.6: Keyboard accessibility spot check**

```bash
python3 - <<'EOF'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:3000/faq')
    page.wait_for_load_state('networkidle')
    # Tab to first summary, press Enter to expand
    page.keyboard.press('Tab')
    for _ in range(10):
        page.keyboard.press('Tab')
    page.keyboard.press('Enter')
    page.wait_for_timeout(300)
    expanded = page.evaluate("document.querySelectorAll('details[open]').length")
    print(f'expanded details count: {expanded}')
    b.close()
EOF
```

Expected: prints `expanded details count: 1` (or higher — at least one item opened via keyboard).

- [ ] **Step 7.7: No additional commit needed unless cleanup**

If any of the above steps required fixes, commit them individually as encountered. If everything was already clean, end here. Optionally push:

```bash
git push
```

---

## Self-Review Notes

Spec coverage check (against `2026-05-22-faq-design.md`):
- ✓ 13 Q&A in 4 categories — Task 1
- ✓ Top 6 on home — Task 1 (data flags) + Task 4 (rendering)
- ✓ Reusable accordion using native `<details>` — Task 3
- ✓ `parseAnswer` for markdown-style links — Task 3
- ✓ `/faq` dedicated page — Task 5
- ✓ JSON-LD FAQPage schema — Task 2 (builder) + Task 5 (injection)
- ✓ Footer link — Task 6
- ✓ Tests: data + helpers + component — Tasks 1, 2, 3
- ✓ Metadata for `/faq` — Task 5
- ✓ Visual style matches design tokens — Task 3 (CSS classes)
- ✓ Placement between HowItWorks and Footer — Task 4
- ✓ Keyboard accessibility (native `<details>`) — Task 7

No placeholders, no TODOs, no "similar to Task N". All code is shown inline. Types and function signatures stay consistent across tasks (`FAQItem`, `getFeaturedFAQ()`, `buildFAQPageSchema()`, `parseAnswer()`).
