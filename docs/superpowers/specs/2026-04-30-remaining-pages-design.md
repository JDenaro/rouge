# Design: Rouge Intime — Remaining Pages

**Date:** 2026-04-30  
**Scope:** 15 new HTML pages for the rouge-web static site

---

## Architecture

**Approach:** Individual standalone HTML files, one per route. Matches existing pattern of `index.html` and `guia-de-talles.html`. Works with `file://` and `python3 -m http.server`.

**Also:** Update `index.html` nav links from absolute paths (`/sets`) to relative `.html` paths (`sets.html`).

---

## Pages

### Category pages (12)
| File | Category | Image source |
|------|----------|--------------|
| `sets.html` | Sets 3 y 4 piezas (inline, no sub-pages) | `/sets`, `/sets/3-piezas`, `/sets/4-piezas` CDN |
| `baby-doll.html` | Baby Doll | `/baby-doll` CDN |
| `conjuntos.html` | Conjuntos | `/conjuntos` CDN |
| `body.html` | Body | `/body` CDN |
| `bata.html` | Bata | `/bata` CDN |
| `catsuit.html` | Catsuit | `/catsuit` CDN |
| `corsets.html` | Corsets | `/corsets` CDN |
| `pijamas.html` | Pijama Rouge | `/pijamas` CDN |
| `disfraces.html` | Disfraces | `/disfraces` CDN |
| `sexshop.html` | Sexshop | `/sexshop` CDN |
| `perfume-feromonas.html` | Perfume Feromonas | `/perfume-feromonas` CDN |
| `panty-vedetina-culotte.html` | Complementos | `/panty-vedetina-culotte` CDN |

### Catalog page (1)
| File | Purpose |
|------|---------|
| `productos.html` | Full catalog — links to all 12 categories with hero image per category |

### Info pages (2)
| File | Content source |
|------|---------------|
| `contacto.html` | WhatsApp link, email, Instagram, contact form (static HTML, no backend) |
| `politica-de-cambios.html` | Return policy text from `/politica-de-cambios` on rougeintime.ar |

---

## Page structure (all category pages)

1. **Nav** — same as index.html, relative links
2. **Category hero** — full-width image, category name, subtitle
3. **Product grid** — glass cards, real CDN images, product name, WhatsApp CTA button
4. **Footer** — same as index.html

## Design tokens

Inherit from index.html `:root`. No changes to the design system.

## Image strategy

- Curl each category URL on rougeintime.ar
- Extract image filenames from the CDN pattern: `acdn-us.mitiendanube.com/stores/004/099/592/products/`
- Use only images from the corresponding section
- Product cards: `?w=480`, hero: `?w=640`

## WhatsApp CTA

Each product card: "Consultar por WhatsApp" → `https://wa.me/+541158861214?text=Hola!%20Me%20interesa%20[producto]`

## Link updates in index.html

All absolute-path nav links updated to relative `.html` paths.

---

## Out of scope

- Shopping cart or checkout
- Server-side rendering
- Search functionality
- Sub-pages for sets/3-piezas and sets/4-piezas (covered inline in sets.html)
