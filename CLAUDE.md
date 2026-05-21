# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static HTML e-commerce site for **Rouge Intime** — an Argentine intimate apparel brand. No build system, no package manager, no framework. Two production-ready HTML files with all CSS and JS inlined.

## Files

- `index.html` — main landing page (hero, categories, products, how-it-works, payments, CTA, footer)
- `guia-de-talles.html` — standalone size guide page (linked from every "Guía de talles" button)

## Running locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or open the `.html` files directly in the browser via `file://` — all assets are external CDN only.

## Screenshotting with Playwright

Playwright Python is installed. Use it to visually verify changes:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("file:///Users/juldenarocur/Repositorios/rouge-web/index.html")
    page.wait_for_load_state("networkidle")
    # Force fade-in animations visible for headless screenshots:
    page.evaluate("document.querySelectorAll('.fade-in').forEach(el=>el.classList.add('visible'));")
    page.wait_for_timeout(500)
    page.screenshot(path="/tmp/check.png", full_page=True)
    browser.close()
```

## Design system

UI/UX decisions are driven by the **ui-ux-pro-max** skill (`https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`). Before adding new pages, components, or visual styles, invoke the skill to get a consistent design system recommendation:

```
/ui-ux-pro-max build <description of what you're building>
```

The skill provides: style (currently **Liquid Glass**), color palette, font pairing, UX rules, and anti-patterns to avoid.

All design tokens live in `:root` at the top of each file:

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

All product and category images are served from the tiendanube CDN:

```
https://acdn-us.mitiendanube.com/stores/004/099/592/products/{filename}-1024-1024.webp?w=480
https://acdn-us.mitiendanube.com/stores/004/099/592/categories/{filename}-1920-1920.webp?w=360
```

Use `?w=360` for category thumbnails, `?w=480` for product cards, `?w=640` for the hero image.

## Key patterns

**Scroll fade-in:** Add class `fade-in` to any element. JS at bottom of each file wires IntersectionObserver. Elements start at `opacity:0; transform:translateY(22px)` and transition to visible on scroll.

**Glass card:** `background: var(--color-surface); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.85); border-radius: var(--radius-lg); box-shadow: var(--shadow-card);`

**Primary button:**
```html
<a href="..." class="btn-primary">Label <svg>→</svg></a>
```

**WhatsApp links:** Always use `https://wa.me/+541158861214?text=...` with URL-encoded pre-filled message.

## Navigation between pages

`index.html` links to `guia-de-talles.html` (relative path). The size guide links back to `index.html`. Keep all internal hrefs as relative paths.

## Live site pages — rougeintime.ar

These are the real pages on the live Tiendanube store. Links in `index.html` point to these URLs.

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
