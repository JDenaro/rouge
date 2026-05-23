# Design: Rouge Intime — FAQ section + dedicated /faq page

**Date:** 2026-05-22
**Scope:** Add a FAQ section to the home (top 6) and a dedicated `/faq` page (all 13, grouped by category, with FAQPage JSON-LD schema for SEO).

---

## Context

The home audit (skill `ui-ux-pro-max`) flagged the lack of a self-serve answer surface as a friction point. Users currently land on WhatsApp for trivial questions (lead time, sizing, payment methods), which drains the brand's response capacity and slows conversion. A FAQ section addresses this directly while also opening an SEO opportunity (rich-snippet FAQ results in Google).

We initially scoped 4 home improvements (brand story, Instagram feed, FAQ, newsletter). The first three were deferred. **This spec covers FAQ only.**

The outcome: a 6-question accordion on the home (between `HowItWorks` and the footer) with a "Ver todas" link, plus a dedicated `/faq` page with all 12 questions grouped by category and a `FAQPage` JSON-LD schema embedded.

---

## Content — 13 questions, 4 categories

The 13 Q&A are authored by us based on existing project context (made-to-order workflow, `/politica-de-cambios`, `/guia-de-talles`, `/contacto`, 12% transferencia discount, MP up to 3 cuotas).

### Hechas a medida (4)
1. **¿Cuánto demora una prenda hecha a medida?** → Cada pieza se confecciona en 15-20 días hábiles desde que se confirma el pago.
2. **¿Puedo elegir telas y colores?** → Sí, en cada producto se muestran las opciones disponibles. Para variaciones específicas escribinos por WhatsApp.
3. **¿Hacen modelos personalizados?** → Sí, adaptamos cualquier modelo a tu talla y preferencias. Consultanos por WhatsApp con la idea.
4. **¿Vienen con packaging especial?** → Sí, todas las prendas se envían en empaque Rouge Intime listo para regalo.

### Talles y medidas (3)
5. **¿Cómo me tomo las medidas?** → Seguí nuestra [guía de talles](/guia-de-talles) paso a paso. Si tenés dudas, contactanos por WhatsApp.
6. **¿Atienden talles grandes?** → Sí, trabajamos desde el 85 hasta el 140+ en corpiños y desde S hasta 5XL en bombachas.
7. **¿Qué pasa si la prenda no me queda?** → Por ser hecha a medida no aceptamos cambios por talle salvo defecto de confección. Por eso es clave [medirse bien antes de pedir](/politica-de-cambios).

### Envíos (3)
8. **¿Hacen envíos a todo el país?** → Sí, enviamos a todo el país por Andreani / Correo Argentino con tracking.
9. **¿Cuánto demora el envío?** → 3-7 días hábiles desde que despachamos (luego de los 15-20 días de confección).
10. **¿Hacen envíos al exterior?** → Por el momento solo enviamos dentro de Argentina.

### Pagos (3)
11. **¿Qué medios de pago aceptan?** → Transferencia bancaria (12% OFF), tarjeta de crédito hasta 3 cuotas sin interés, y Mercado Pago.
12. **¿Cuándo se confirma mi pago?** → Las transferencias se confirman en horas hábiles tras recibir el comprobante. Mercado Pago y tarjeta son inmediatos.
13. **¿Es seguro pagar online?** → Sí, los pagos con tarjeta se procesan por Mercado Pago. La transferencia es a cuenta bancaria a nombre de la marca.

**Total: 13 preguntas (4 + 3 + 3 + 3).**

### Top-6 for home

The home shows 6 questions chosen to remove the most common pre-purchase friction: **#1** (lead time), **#5** (cómo medirse), **#6** (talles grandes), **#8** (envíos al país), **#11** (medios de pago), **#7** (qué pasa si no queda).

---

## Architecture

### New files
```
lib/faq.ts                          — typed FAQ data + helpers
components/store/FAQ.tsx            — reusable accordion component
app/(store)/faq/page.tsx            — dedicated /faq page + JSON-LD
```

### Modified files
```
app/(store)/page.tsx                — add <FAQ items={topSix} /> + cta link
components/store/Footer.tsx         — add "Preguntas frecuentes" link to /faq
                                       (alongside existing Guía de talles / Política de cambios)
```

### `lib/faq.ts` shape

```ts
export type FAQCategory = 'made-to-order' | 'sizing' | 'shipping' | 'payments'

export type FAQItem = {
  id: number                          // stable ID, also used as the JSON-LD position
  category: FAQCategory
  question: string
  answer: string                      // plain text; may contain markdown-style links rendered manually
  featured: boolean                   // true → shown on home
}

export const FAQ_ITEMS: readonly FAQItem[] = [ /* 12 entries */ ]

export const FAQ_CATEGORY_LABELS: Record<FAQCategory, string> = {
  'made-to-order': 'Hechas a medida',
  sizing: 'Talles y medidas',
  shipping: 'Envíos',
  payments: 'Pagos',
}

export function getFeaturedFAQ(): FAQItem[]
export function groupFAQByCategory(): Record<FAQCategory, FAQItem[]>
```

Keeping answer as plain string + manual link rendering avoids pulling in a markdown lib. Links in answers (e.g. `/guia-de-talles`) are inlined as JSX in the component using a simple `parseAnswer` helper that recognizes `[text](url)` patterns. Two items currently need links (Q5, Q7); if we grow past ~5 we'll reconsider.

### `components/store/FAQ.tsx`

Reusable accordion component. Used by both the home section and the `/faq` page.

```tsx
type FAQProps = {
  items: FAQItem[]
  showCta?: boolean        // home variant: shows "Ver todas las preguntas →" link
  groupByCategory?: boolean // /faq variant: render category headings between groups
}
```

Implementation notes:
- Uses native HTML `<details>` / `<summary>` — zero JS, accessible by default, indexable by Google. Keyboard nav (Tab + Enter) works without a single line of code.
- A `+` icon in `<summary>::after` rotates 45° on `[open]` via CSS sibling selector — the only animation needed.
- Plain-text answers with link parsing: a tiny `parseAnswer(text)` returns React children, splitting on `[text](url)` and emitting `<Link>` for internal paths.
- The component is **server-rendered** (no `'use client'`). Native `<details>` provides interactivity browser-side.

### `app/(store)/faq/page.tsx`

```tsx
export const metadata: Metadata = {
  title: 'Preguntas frecuentes | Rouge Intime',
  description: 'Plazos de producción, talles, envíos y pagos — todo lo que necesitás saber antes de pedir tu prenda a medida.',
}

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildFAQPageSchema(FAQ_ITEMS))
      }} />
      <main>
        <header>…</header>
        <FAQ items={FAQ_ITEMS} groupByCategory />
      </main>
    </>
  )
}
```

The JSON-LD schema follows [Google's FAQPage spec](https://developers.google.com/search/docs/appearance/structured-data/faqpage) — each Q is a `Question` with an `acceptedAnswer` of type `Answer`. A `buildFAQPageSchema(items)` helper in `lib/faq.ts` produces the object; the page stringifies and injects it via `<script type="application/ld+json">`.

---

## Visual style

Aligned with the existing design tokens (`@theme` in `app/globals.css`):

- **Container:** centered, `max-w-3xl` (narrower than other sections — FAQ reads better in a single column).
- **Item:** vertical stack divided by 1px rose-tinted bottom border (`border-b border-[rgba(192,68,90,0.12)]`).
- **Summary (question):** Cormorant 1.125rem, weight 500, padded `1.25rem 0`, cursor pointer. `+` icon on the right, rotates to `×` when open. Hover: question color shifts to `--color-primary`.
- **Answer body:** Montserrat 0.9375rem, line-height 1.6, opacity 0.85, padded `0 0 1.25rem`. Inline links use `--color-primary` with hover underline.
- **CTA link (home variant):** "Ver todas las preguntas →" with the same chevron-arrow treatment used elsewhere, centered below the accordion.

No glass-card here — the FAQ is utilitarian content, not decorative. The visual rhythm comes from the borders and the typography contrast (serif Q / sans-serif A).

On mobile the layout is identical (single column already). The summary keeps the same padding for finger-friendly tap targets (≥44px effective).

---

## Placement on the home

Insertion order between `HowItWorks` and the closing of `<main>`:

```
Hero → TrustStrip → CategoriesGrid → FeaturedProducts
  → Testimonials → HowItWorks → FAQ (home variant) → Footer
```

Rationale: a user who scrolled the full page without converting is either uncertain or hesitant. FAQ at the end resolves their last objections; the "Ver todas" link absorbs anyone whose question isn't in the top 6.

---

## SEO

- `/faq` page sets explicit `metadata` (title, description).
- JSON-LD `FAQPage` schema with all 12 Q/A embedded.
- Footer gets a "Preguntas frecuentes" link to `/faq` so the page is crawlable from every route.
- No sitemap update needed in this spec — sitemap generation isn't currently in the codebase; if we add one later, `/faq` will be included automatically.

---

## Testing

Two Vitest tests covering the riskiest parts:

1. **`__tests__/faq.test.ts`** — unit tests:
   - `getFeaturedFAQ()` returns exactly 6 items, all with `featured: true`.
   - `groupFAQByCategory()` produces 4 keys with the correct counts (4 / 3 / 3 / 3).
   - `buildFAQPageSchema(items)` shape matches the FAQPage spec for an arbitrary input.

2. **`__tests__/FAQ.test.tsx`** — component test:
   - Renders all provided items.
   - Each `<details>` toggles on summary click.
   - When `groupByCategory` is true, category headings appear before their items.
   - When `showCta` is true, the "Ver todas" link is rendered with `href="/faq"`.

No e2e/Playwright tests for this — the existing screenshot habit is enough for visual verification.

---

## Out of scope (deferred)

- Brand story section
- Instagram / UGC feed
- Newsletter signup
- Search/filter inside the FAQ — unnecessary at 13 questions
- Loading FAQ content from Supabase — content is static here; if we grow past ~20 questions or want admin editing we can revisit

---

## Verification checklist

- [ ] `npm test` passes (new + existing tests)
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` clean
- [ ] Home renders the 6-item FAQ between HowItWorks and Footer, with "Ver todas" linking to `/faq`
- [ ] `/faq` page renders all 13 questions grouped by 4 categories
- [ ] View source shows `<script type="application/ld+json">` with valid FAQPage schema
- [ ] Footer has a "Preguntas frecuentes" link
- [ ] Playwright screenshots on desktop (1440×900) and mobile (390×844) look right
- [ ] Native keyboard nav works: Tab moves between summaries, Enter toggles
