# Rouge Intime — Remaining Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 15 remaining HTML pages for the Rouge Intime static site (12 category pages + productos + contacto + politica-de-cambios), using real product images scraped from rougeintime.ar.

**Architecture:** Individual standalone HTML files, matching the pattern of index.html and guia-de-talles.html. Each file is self-contained with inlined CSS (sharing the same design tokens). Index.html nav links updated from `/slug` to `slug.html`.

**Tech Stack:** Static HTML, CSS (Liquid Glass design system), Vanilla JS (IntersectionObserver fade-in), Google Fonts (Cormorant + Montserrat), Playwright for visual verification.

---

## Constants (used across all tasks)

**CDN Base:** `https://acdn-us.mitiendanube.com/stores/004/099/592/products/`  
**WhatsApp:** `https://wa.me/+541158861214`  
**Font CDN:** `https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap`

**Product data by category** (name → image filename for CDN):

### sets
| Name | Image filename |
|------|---------------|
| ENAMORADA | `aeb221d5-6cdd-4048-bb7e-daf221c191f1-361faac88494a13abb17046137568746-1024-1024.webp` |
| DAKOTA | `227ca488-542f-4db2-8f4e-640ba29495a0-8c72eaed24ab2e2ef817056874275124-1024-1024.webp` |
| NINA | `5d7d266b-149d-4965-804b-cb0a8e163ff5-00a4d215aaa87e5afa17441643969913-1024-1024.webp` |
| RUFLE | `a33fe1ed-4cf1-4e04-83ad-a5ee139e4a35-4eda047ff4afb78cba17116348205167-1024-1024.webp` |
| TURÍN | `0e09f922-2b39-4c2c-90b1-626ce6e90528-e9e37dadb18259de9617137183278061-1024-1024.webp` |
| HARLEY | `3664a95e-907d-439d-ad58-8f257dd63adb-9a3f0d8bab9b024cf917049302032147-1024-1024.webp` |
| MIENTEME | `56103424-8eaa-4d0c-aa1c-a57a40887e46-6db364630efffc4d6717233021116078-1024-1024.webp` |
| INQUIETA | `661c5777-d224-4579-af6a-fdc9a233d594-3fe7aea3b62edca46117114619251622-1024-1024.webp` |

### baby-doll
| Name | Image filename |
|------|---------------|
| BADGIRL | `35c21dbf-688d-4279-8f92-8a72b07c2eda-045d4cf1fd7019354317169231601594-1024-1024.webp` |
| EXTASIS | `72158582-b682-43ae-b60e-da513508d2ce-c147f5d4a82a5f54f417046062642063-1024-1024.webp` |
| ASI SOY YO | `f81ea240-c2dc-4b80-8939-c6ea000df330-3530f714fbdfa57e6317046065711543-1024-1024.webp` |
| INNOCENT DESIRE | `843b6fde-f42f-4445-927f-b377719e9afa-fe9335ec2b9195093b17157756545693-1024-1024.webp` |
| GATUBELA 2 | `a7ba69e4-09e8-4386-bc4d-41c996bb7d80-2a256c5acc5b4ea71617046068366769-1024-1024.webp` |
| TORONTO | `3bb8c87a-9d92-44e4-8e97-2699edee5c43-fe93a6ed4f97d0999117417989158006-1024-1024.webp` |
| ROSE | `140aab4a-dafe-41fc-8c20-bcafcc2783dc-fd9bc7048b8d965d7d17114615474647-1024-1024.webp` |
| GATUBELA 3 | `6a478cd3-16c8-4469-9ad6-f99fe10885c8-6e62f587de9461a2ba17362600620830-1024-1024.webp` |

### conjuntos
| Name | Image filename |
|------|---------------|
| MEDUSA | `631c77ee-aef2-4f7e-ab39-bd82654c5e60-6bc4469b812a837b9017038844322122-1024-1024.webp` |
| RACHEL | `15e347b1-bd92-4293-9724-92c6867f800a-9047a9042b4810cb1017073175193289-1024-1024.webp` |
| AITANA | `cdb955a4-0c84-4332-b8c6-abc84f6de0e1-6782840375f073e79d17046094303444-1024-1024.webp` |
| URSULA | `4f9167f4-71d3-4631-9cb1-edf44e269c7f-a207713f31b561ba1b17473254232977-1024-1024.webp` |
| LONDON | `67c3a02c-d9d7-4468-84b7-7d388309cf57-e24f916b4ec417c17c17416111136916-1024-1024.webp` |
| SENSUALITE | `e8828bf6-706a-4737-b71a-2135ba3d9aa5-5dfc4a079fb23f04bc17046139320137-1024-1024.webp` |
| CONJUNTO SOY TU PUT | `ce638ad8-7f5c-4e18-8a71-72714940ea34-6649712793a0a67a5d17368845309020-1024-1024.webp` |
| TWO LOVE | `509a04f4-4fe4-4367-832c-7f9d389ebc89-f9cfece85af791c19c17052501521376-1024-1024.webp` |

### body
| Name | Image filename |
|------|---------------|
| EXTASIS | `35c21dbf-688d-4279-8f92-8a72b07c2eda-045d4cf1fd7019354317169231601594-1024-1024.webp` |
| PIZZO SEDUCENTE | `3c2fe3ed-514b-4945-8257-92c5999a42b1-3707dbb8b31dc90ed617038836838488-1024-1024.webp` |
| AMAME EN ENCAJE | `e98364f6-790a-4b4c-80d5-e4157708f16b-df4f3dbc4ea386fa5617038807655321-1024-1024.webp` |
| ATRACCION IRRESISTIBLE | `6094a66c-a424-4df8-b8d2-67a378b82f75-0f599b62f5c1ddbe9317149450227942-1024-1024.webp` |
| YORK | `3c5d021a-d070-4984-a08c-0964ce85c003-23b9d4f3de3f18c10617308995334745-1024-1024.webp` |
| SCARLET | `2f05cf95-ac1d-401c-a959-3c7103b4914a-9abea3315d0878442a17038830209978-1024-1024.webp` |
| WANDA | `6f9a4acd-3376-4652-87d7-7c2657d610bb-2b1fb278f28669b8e417049032553393-1024-1024.webp` |
| AQUA | `d7337288-435c-4ca0-a941-fbf0a4179aeb-bd197d3cd3922abb5e17046090239280-1024-1024.webp` |

### bata
| Name | Image filename |
|------|---------------|
| BATA ROUGE | `912115c5-9b8d-45e6-a5d0-bf49c144a5cc-948c885fe0202a70d717162914059902-1024-1024.webp` |
| BATA LARGA ROUGE 2 | `captura-de-pantalla-2025-01-13-090341-bd7d15b27980d0b31117367701658158-1024-1024.webp` |
| SET BABY DOLL + BATA | `captura-de-pantalla-2025-02-24-001033-7f741bbec0fb1c1fab17403666937521-1024-1024.webp` |
| PIJAMAS PARA PAREJA | `captura-de-pantalla-2025-02-24-001748-425d0c42b3526c9d6617403673488006-1024-1024.webp` |
| BOX ROUGE ELEGANTE | `captura-de-pantalla-2025-02-24-003656-7af59b1a15fd77821c17403682900739-1024-1024.webp` |
| DAME UN GR | `captura-de-pantalla-2025-02-24-004756-44308b94ee3834f51f17403688856209-1024-1024.webp` |
| SET PIJAMA & BABY DOLL | `captura-de-pantalla-2025-02-24-005226-596c156fe305d42f8517403691854750-1024-1024.webp` |
| BATA EXCLUSIVA | `captura-de-pantalla-2025-02-24-011346-d06ba672ca6805886d17403704449963-1024-1024.webp` |

### catsuit
| Name | Image filename |
|------|---------------|
| DIOSA DE FUEGO | `captura-de-pantalla-2025-10-02-130907-80413c236be6a2306417594214744265-1024-1024.webp` |
| MOTOR | `captura-de-pantalla-2025-10-02-131419-3b9a388b61385901e917594217103832-1024-1024.webp` |
| ICON | `captura-de-pantalla-2025-10-02-132124-03795c39055852274e17594222146938-1024-1024.webp` |
| LUZ PROHIBIDA | `captura-de-pantalla-2025-10-02-132652-259703f7bd6406e8ba17594225333891-1024-1024.webp` |
| DIAMANTE PROHIBIDO | `captura-de-pantalla-2025-10-02-133126-df375c08d60da5bedd17594227422911-1024-1024.webp` |

### corsets
| Name | Image filename |
|------|---------------|
| KIT PASION | `4564abc5-c86f-4a41-bcba-0cdb8a951978-e5e8eda572d1c760fc17250263565655-1024-1024.webp` |
| SEXIACTIVA | `captura-de-pantalla-2024-09-12-165158-7992be7460b9f9755c17261709878862-1024-1024.webp` |
| TOQUE PROHIBIDO | `captura-de-pantalla-2024-09-30-103459-2cd42dc1920e3253e917277033476595-1024-1024.webp` |
| MORS | `captura-de-pantalla-2025-01-13-090341-bd7d15b27980d0b31117367701658158-1024-1024.webp` |
| DOMINIA | `captura-de-pantalla-2026-01-14-093647-697fa865e6998e7e6217683943265101-1024-1024.webp` |
| MYSTIQUE | `captura-de-pantalla-2026-04-13-091322-597f1cec8f29d7d13917760824684917-1024-1024.webp` |

### pijamas
| Name | Image filename |
|------|---------------|
| ANITA | `3a481bcb-f3af-4625-b3cc-dd66dafa1c05-a00a0a8830d20994d117424915920733-1024-1024.webp` |
| SET 3 PIEZAS ROUGE | `captura-de-pantalla-2025-02-24-001748-425d0c42b3526c9d6617403673488006-1024-1024.webp` |
| SHORT ROUGE | `captura-de-pantalla-2025-02-24-005949-28f68dbcc7fc4d41c817403696529982-1024-1024.webp` |
| SET PIJAMA & BABY DOLL | `captura-de-pantalla-2025-02-24-010414-42d4b69abc91eafa0d17403698967498-1024-1024.webp` |
| BELGIRL | `captura-de-pantalla-2025-02-24-010939-5694667235d558e65117403702590017-1024-1024.webp` |
| COMBO FAMILIA | `captura-de-pantalla-2025-02-24-011346-d06ba672ca6805886d17403704449963-1024-1024.webp` |
| PIJAMA ROUGE | `captura-de-pantalla-2025-02-24-011948-f63d60d706e6b0c2af17403708018320-1024-1024.webp` |
| REMERA ROUGE | `captura-de-pantalla-2025-02-24-012542-57aedf8c303c1d33b817403714210914-1024-1024.webp` |

### disfraces
| Name | Image filename |
|------|---------------|
| MUCAMA | `captura-de-pantalla-2024-07-29-100300-eeeebf11ee1f0a19fa17222593428353-1024-1024.webp` |
| COLEGIALA | `captura-de-pantalla-2024-09-12-083423-310339b3e99c08cf8d17261412943943-1024-1024.webp` |
| POLICIA | `captura-de-pantalla-2024-09-12-085141-c7dd9aafd1191be38217261419691781-1024-1024.webp` |
| MUCAMA 3 | `captura-de-pantalla-2024-09-12-085629-ed48e83a4f7883dc4717261422248344-1024-1024.webp` |
| SECRETARIA | `captura-de-pantalla-2024-09-12-090020-f9c40da3ae8bb016e717261425398767-1024-1024.webp` |
| EMPERATRIZ DEL ENCAJE | `captura-de-pantalla-2024-10-01-173918-e13d30c30fb61af73b17278153735202-1024-1024.webp` |
| MONJA | `captura-de-pantalla-2024-10-01-174107-9e2e80c34a64ee7fb217278153001237-1024-1024.webp` |
| CONEJITA | `captura-de-pantalla-2025-09-10-141827-9920799441402ca41517575347142807-1024-1024.webp` |

### sexshop
| Name | Image filename |
|------|---------------|
| PERFUME HOT INEVITABLE SO EXCITED | `13a5df64-a9bf-4195-9062-11cafac364c2-5bb4dbb8796dfb425217424924874828-1024-1024.webp` |
| SET VIBRO +7 PIEZAS | `94a1a3af-b1c0-46c5-82b4-eafdb07816c8-4d344702f6ee6ce9bb17424922824395-1024-1024.webp` |
| LUBRICANTE LUBE | `b30116bb-693e-4143-8575-09d9ade8cff6-b6700a3fa882bb01f717424920007435-1024-1024.webp` |
| WET GEL LUBRICANTE | `captura-de-pantalla-2023-11-16-100930-c5fd6b9da64e40341a17183710897053-1024-1024.webp` |
| CREMA INTENSIFICANTE BLACK DRAGON | `captura-de-pantalla-2023-11-16-101028-3857a095bf01aba35917183708401332-1024-1024.webp` |
| KIT EXCLUSIVO BADGIRL | `captura-de-pantalla-2023-11-16-101148-4095cd5fe2d24c7b8317183712625735-1024-1024.webp` |
| PINK SEXY PILL MUJER | `captura-de-pantalla-2023-11-16-104330-33a4a0e6e49a62a03717183716424723-1024-1024.webp` |
| KIT SEDUCCION IRRESISTIBLE | `captura-de-pantalla-2023-11-16-104400-c2c5660df5929ea3e017183705614914-1024-1024.webp` |

### perfume-feromonas
| Name | Image filename |
|------|---------------|
| HOT INEVITABLE SO EXCITED | `captura-de-pantalla-2025-07-17-091848-c4ce00108efe346ed417527547504909-1024-1024.webp` |
| HOT INEVITABLE | `captura-de-pantalla-2025-07-17-091945-ade1b11747d2b815f217527548055944-1024-1024.webp` |
| HOTEL FOR MAGIC LOVERS ROOM SPRAY | `captura-de-pantalla-2025-07-17-092058-f3eef544f72f49e23617527548861963-1024-1024.webp` |
| HOTEL ATMOSPHERE ROOM SPRAY | `captura-de-pantalla-2025-07-17-092223-489e30c84758815f1e17527549602786-1024-1024.webp` |
| BODY SPLASH PETIT MORT | `captura-de-pantalla-2025-07-17-092442-ce6302e3c8ab26ceb717527550990712-1024-1024.webp` |
| BODY SPLASH HOT INEVITABLE | `captura-de-pantalla-2025-07-17-092544-560f257b488b84f78f17527551714831-1024-1024.webp` |
| BODY SPLASH LOVE | `captura-de-pantalla-2025-07-17-092646-005c51b43b5ee9a31517527552234536-1024-1024.webp` |
| BODY SPLASH CRAZY GIRL | `captura-de-pantalla-2025-07-17-092852-93e32efe960d5415da17527553523816-1024-1024.webp` |

### panty-vedetina-culotte
| Name | Image filename |
|------|---------------|
| CULOTTE | `2a2c3756-785b-4482-b9dd-723b4320d74e-4d940b4fbee6dd69bc17046084214389-1024-1024.webp` |
| SOY TU PUT4 | `54363ff1-ed18-4899-b612-f3912339aecc-b90768ca2b21eb2faf17136350149067-1024-1024.webp` |
| MEDIAS DE LYCRA | `507b13af-5a3c-49b7-b5b0-d6b641f60383-5b37c01dbb120eb21f17087062019742-1024-1024.webp` |
| BLACK RITUAL | `ce638ad8-7f5c-4e18-8a71-72714940ea34-6649712793a0a67a5d17368845309020-1024-1024.webp` |

---

## HTML Page Template

Every category page uses this structure. The CSS block is identical across all pages; only `<title>`, page-hero content, and product grid data change.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{CATEGORY_TITLE}} — Rouge Intime</title>
  <meta name="description" content="{{META_DESC}}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    /* [FULL CSS BLOCK — copy from guia-de-talles.html :root through end of <style>] */
    /* Plus product grid CSS below */

    /* ─── Product Grid ───────────────────────────────── */
    .products-section {
      padding: clamp(3rem, 6vw, 5rem) clamp(1.25rem, 5vw, 3.5rem);
      max-width: 1280px; margin: 0 auto;
    }
    .products-section-title {
      font-family: var(--font-heading); font-size: clamp(1.8rem, 3vw, 2.5rem);
      font-weight: 600; color: var(--color-fg); margin-bottom: 2.5rem;
      letter-spacing: 0.04em;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: var(--color-surface);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.85);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
      overflow: hidden;
      transition: transform var(--dur-mid) var(--ease-out), box-shadow var(--dur-mid) var(--ease-out);
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(192,68,90,0.15);
    }
    .product-card-img {
      width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block;
    }
    .product-card-body { padding: 1.25rem; }
    .product-card-name {
      font-family: var(--font-heading); font-size: 1.15rem; font-weight: 600;
      letter-spacing: 0.08em; color: var(--color-fg); margin-bottom: 0.75rem;
    }
    .product-card-cta {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: var(--color-primary); color: #fff;
      padding: 0.55rem 1.1rem; border-radius: var(--radius-pill);
      font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em;
      text-transform: uppercase; text-decoration: none;
      transition: background var(--dur-fast), transform var(--dur-fast);
    }
    .product-card-cta:hover { background: var(--color-secondary); transform: scale(1.03); }
    .product-card-cta svg { flex-shrink: 0; }
  </style>
</head>
<body>

<!-- NAV — identical to index.html nav, with links updated to .html -->
<nav class="nav" id="nav" role="navigation" aria-label="Navegación principal">
  <a href="index.html" class="nav-logo" aria-label="Rouge Intime — inicio">
    Rouge Intime
    <span>lencería argentina</span>
  </a>
  <ul class="nav-links">
    <li><a href="productos.html">Productos</a></li>
    <li><a href="sets.html">Sets</a></li>
    <li><a href="conjuntos.html">Conjuntos</a></li>
    <li><a href="baby-doll.html">Baby Doll</a></li>
    <li><a href="corsets.html">Corsets</a></li>
    <li><a href="guia-de-talles.html">Guía de talles</a></li>
    <li><a href="contacto.html">Contacto</a></li>
  </ul>
  <div class="nav-actions">
    <a href="https://wa.me/+541158861214" class="nav-icon-btn" aria-label="WhatsApp" target="_blank" rel="noopener">
      <!-- WhatsApp SVG from index.html -->
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>
    <button class="nav-icon-btn nav-hamburger" aria-label="Abrir menú" aria-expanded="false">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  </div>
</nav>

<!-- PROMO BAR — identical to index.html -->
<div class="promo-bar" aria-label="Promociones vigentes">
  <div class="promo-track" aria-hidden="true">
    <span class="promo-item">Envío gratis en 2 conjuntos o más con el código #ENVIOGRATIS <span class="promo-sep"></span></span>
    <span class="promo-item">3 cuotas sin interés con tarjeta de crédito y Go Cuotas <span class="promo-sep"></span></span>
    <span class="promo-item">10% de descuento pagando por transferencia <span class="promo-sep"></span></span>
    <span class="promo-item">Todos los productos a pedido — 15 a 20 días de demora <span class="promo-sep"></span></span>
    <span class="promo-item">Envío gratis en 2 conjuntos o más con el código #ENVIOGRATIS <span class="promo-sep"></span></span>
    <span class="promo-item">3 cuotas sin interés con tarjeta de crédito y Go Cuotas <span class="promo-sep"></span></span>
    <span class="promo-item">10% de descuento pagando por transferencia <span class="promo-sep"></span></span>
    <span class="promo-item">Todos los productos a pedido — 15 a 20 días de demora <span class="promo-sep"></span></span>
  </div>
</div>

<!-- PAGE HERO -->
<section class="page-hero" aria-labelledby="page-title">
  <div class="page-hero-inner">
    <div class="page-hero-breadcrumb">
      <a href="index.html">Inicio</a>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
      <span>{{CATEGORY_NAME}}</span>
    </div>
    <h1 class="page-hero-title" id="page-title">{{CATEGORY_HEADING}}</h1>
    <p class="page-hero-subtitle">{{CATEGORY_SUBTITLE}}</p>
  </div>
</section>

<!-- PRODUCT GRID -->
<section class="products-section">
  <h2 class="products-section-title">Todos los diseños</h2>
  <div class="products-grid">
    <!-- REPEAT per product: -->
    <div class="product-card fade-in">
      <img
        class="product-card-img"
        src="https://acdn-us.mitiendanube.com/stores/004/099/592/products/{{IMAGE_FILENAME}}?w=480"
        alt="{{PRODUCT_NAME}} — Rouge Intime"
        loading="lazy"
      />
      <div class="product-card-body">
        <div class="product-card-name">{{PRODUCT_NAME}}</div>
        <a
          href="https://wa.me/+541158861214?text=Hola!%20Me%20interesa%20el%20modelo%20{{PRODUCT_NAME_ENCODED}}%20de%20la%20categor%C3%ADa%20{{CATEGORY_ENCODED}}"
          class="product-card-cta"
          target="_blank"
          rel="noopener"
          aria-label="Consultar por WhatsApp"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Consultar
        </a>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER — copy footer section verbatim from index.html, updating all href="/..." to href="....html" -->

<script>
  /* Fade-in observer */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

  /* Mobile nav */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? '' : 'flex';
      navLinks.style.flexDirection = open ? '' : 'column';
      navLinks.style.position = open ? '' : 'absolute';
      navLinks.style.top = open ? '' : '68px';
      navLinks.style.left = open ? '' : '0';
      navLinks.style.right = open ? '' : '0';
      navLinks.style.background = open ? '' : 'rgba(253,248,248,0.97)';
      navLinks.style.padding = open ? '' : '1rem clamp(1.25rem,5vw,3.5rem)';
      navLinks.style.borderBottom = open ? '' : '1px solid #F2E0E4';
      hamburger.setAttribute('aria-expanded', String(!open));
    });
  }

  /* Nav scroll effect */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(192,68,90,0.08)' : '';
  }, { passive: true });
</script>
</body>
</html>
```

---

## Category-specific content

For each category page, use these values in the template:

| Category | File | `CATEGORY_TITLE` | `CATEGORY_HEADING` | `CATEGORY_SUBTITLE` |
|---|---|---|---|---|
| sets | `sets.html` | `Sets de Lencería` | `Sets 3 y 4 Piezas` | `Conjuntos completos diseñados en Argentina. Tres y cuatro piezas a pedido, personalizables en color y talle.` |
| baby-doll | `baby-doll.html` | `Baby Doll` | `Baby Doll` | `Diseños delicados y sensuales. Cada modelo es único, confeccionado a pedido en 15 a 20 días.` |
| conjuntos | `conjuntos.html` | `Conjuntos de Lencería` | `Conjuntos` | `Lencería clásica argentina. Corpiño y bombacha a juego en encaje, satén y microfibra.` |
| body | `body.html` | `Body de Lencería` | `Body` | `Siluetas que abrazan el cuerpo. Bodies con encaje y straps, disponibles en talles S a 5XL.` |
| bata | `bata.html` | `Batas y Ropa de Dormir` | `Bata` | `Batas largas y cortas para regalar o darse un capricho. Incluye gift boxes y sets regalo.` |
| catsuit | `catsuit.html` | `Catsuit` | `Catsuit` | `Catsuits de encaje con straps regulables. Disponibles hasta talle 140 en múltiples colores.` |
| corsets | `corsets.html` | `Corsets` | `Corsets` | `Corsets estructurados y kits especiales. Diseños que realzan la figura con detalle de lujo.` |
| pijamas | `pijamas.html` | `Pijamas Rouge` | `Pijama Rouge` | `Pijamas de diseño propio, completamente personalizables en tela, estampa y bordado.` |
| disfraces | `disfraces.html` | `Disfraces` | `Disfraces` | `Colección de roles y fantasías: mucama, colegiala, policía, enfermera, conejita y más.` |
| sexshop | `sexshop.html` | `Sexshop` | `Sexshop` | `Vibradores, lubricantes, cremas y kits para potenciar tu intimidad. Envío discreto.` |
| perfume-feromonas | `perfume-feromonas.html` | `Perfumes con Feromonas` | `Perfumes con Feromonas` | `Colecciones Hot Inevitable, Hotel y Body Splash. Fragancias diseñadas para seducir.` |
| panty-vedetina-culotte | `panty-vedetina-culotte.html` | `Complementos` | `Complementos` | `Panties, culottes, medias y accesorios para completar tu look de lencería.` |

---

## Task 1: Update index.html nav links

**Files:**
- Modify: `index.html` (nav section ~lines 815–822, hero links ~line 879, category cards ~lines 940–1017, product CTA ~lines 1103–1206, footer links ~lines 1348–1356)

- [ ] **Step 1: Replace all absolute nav/href paths with .html relative paths**

In `index.html`, replace every internal link using these exact substitutions:
- `href="/"` → `href="index.html"` (nav-logo only)
- `href="/productos"` → `href="productos.html"`
- `href="/sets"` → `href="sets.html"`
- `href="/conjuntos"` → `href="conjuntos.html"`
- `href="/baby-doll"` → `href="baby-doll.html"`
- `href="/corsets"` → `href="corsets.html"`
- `href="/contacto"` → `href="contacto.html"`
- `href="/sets/3-piezas"` → `href="sets.html"`
- `href="/pijamas"` → `href="pijamas.html"`
- `href="/catsuit"` → `href="catsuit.html"`
- `href="/body"` → `href="body.html"`
- `href="/bata"` → `href="bata.html"`
- `href="/disfraces"` → `href="disfraces.html"`
- `href="/perfume-feromonas"` → `href="perfume-feromonas.html"`
- `href="/sexshop"` → `href="sexshop.html"`
- `href="/panty-vedetina-culotte"` → `href="panty-vedetina-culotte.html"`

- [ ] **Step 2: Verify server**

```bash
python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/index.html | grep 'href="sets.html"' | head -3
kill %1
```

Expected: at least one match.

---

## Task 2: Update guia-de-talles.html links

**Files:**
- Modify: `guia-de-talles.html` (back link to index, nav links)

- [ ] **Step 1: Update back link and nav links**

In `guia-de-talles.html`:
- Change `href="index.html"` — already correct (just verify it exists)
- Update any `/productos`, `/sets`, etc. nav links to `.html` form same as Task 1

---

## Task 3: Create sets.html

**Files:**
- Create: `sets.html`

- [ ] **Step 1: Create sets.html using the HTML template**

Use the template above with:
- `CATEGORY_TITLE` = `Sets de Lencería`
- `CATEGORY_HEADING` = `Sets 3 y 4 Piezas`
- `CATEGORY_SUBTITLE` = `Conjuntos completos diseñados en Argentina. Tres y cuatro piezas a pedido, personalizables en color y talle.`
- `CATEGORY_NAME` = `Sets`
- `CATEGORY_ENCODED` = `Sets`

Add an intro note after the page-hero with two sub-sections: "3 Piezas" and "4 Piezas" (use `<h3>` headings inside products-section). List all 8 products from the **sets** product table in this plan.

WhatsApp text template: `Hola!%20Me%20interesa%20el%20modelo%20[NAME_ENCODED]%20de%20la%20categor%C3%ADa%20Sets`

Use FULL CSS from guia-de-talles.html `:root {...}` block, then add the product grid CSS from the template above.

Include the FULL footer from index.html (copy the `<footer>` element verbatim, updating internal `/...` links to `.html`).

- [ ] **Step 2: Screenshot to verify**

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("file:///Users/juldenarocur/Repositorios/rouge-web/sets.html")
    page.wait_for_load_state("networkidle")
    page.evaluate("document.querySelectorAll('.fade-in').forEach(el=>el.classList.add('visible'));")
    page.wait_for_timeout(500)
    page.screenshot(path="/tmp/sets.png", full_page=True)
    browser.close()
```

View `/tmp/sets.png`. Verify: nav visible, product grid renders, images load (some may be lazy), no broken layout.

---

## Task 4: Create baby-doll.html

**Files:**
- Create: `baby-doll.html`

- [ ] **Step 1: Create baby-doll.html**

Same as Task 3 but with:
- `CATEGORY_TITLE` = `Baby Doll`
- `CATEGORY_HEADING` = `Baby Doll`
- `CATEGORY_SUBTITLE` = `Diseños delicados y sensuales. Cada modelo es único, confeccionado a pedido en 15 a 20 días.`
- Products from the **baby-doll** table in this plan (8 products)
- WhatsApp category: `Baby%20Doll`

- [ ] **Step 2: Screenshot**

```python
# Same Playwright script, replace URL with:
page.goto("file:///Users/juldenarocur/Repositorios/rouge-web/baby-doll.html")
# save to /tmp/baby-doll.png
```

---

## Task 5: Create conjuntos.html

**Files:**
- Create: `conjuntos.html`

- [ ] **Step 1: Create conjuntos.html**

- `CATEGORY_TITLE` = `Conjuntos de Lencería`
- `CATEGORY_HEADING` = `Conjuntos`
- `CATEGORY_SUBTITLE` = `Lencería clásica argentina. Corpiño y bombacha a juego en encaje, satén y microfibra.`
- Products from **conjuntos** table (8 products)
- WhatsApp category: `Conjuntos`

- [ ] **Step 2: Screenshot** — save to `/tmp/conjuntos.png`

---

## Task 6: Create body.html

**Files:**
- Create: `body.html`

- [ ] **Step 1: Create body.html**

- `CATEGORY_TITLE` = `Body de Lencería`
- `CATEGORY_HEADING` = `Body`
- `CATEGORY_SUBTITLE` = `Siluetas que abrazan el cuerpo. Bodies con encaje y straps, disponibles en talles S a 5XL.`
- Products from **body** table (8 products)
- WhatsApp category: `Body`

- [ ] **Step 2: Screenshot** — save to `/tmp/body.png`

---

## Task 7: Create bata.html

**Files:**
- Create: `bata.html`

- [ ] **Step 1: Create bata.html**

- `CATEGORY_TITLE` = `Batas y Ropa de Dormir`
- `CATEGORY_HEADING` = `Bata`
- `CATEGORY_SUBTITLE` = `Batas largas y cortas para regalar o darse un capricho. Incluye gift boxes y sets regalo.`
- Products from **bata** table (8 products)
- WhatsApp category: `Bata`

- [ ] **Step 2: Screenshot** — save to `/tmp/bata.png`

---

## Task 8: Create catsuit.html

**Files:**
- Create: `catsuit.html`

- [ ] **Step 1: Create catsuit.html**

- `CATEGORY_TITLE` = `Catsuit`
- `CATEGORY_HEADING` = `Catsuit`
- `CATEGORY_SUBTITLE` = `Catsuits de encaje con straps regulables. Disponibles hasta talle 140 en múltiples colores.`
- Products from **catsuit** table (5 products)
- WhatsApp category: `Catsuit`

- [ ] **Step 2: Screenshot** — save to `/tmp/catsuit.png`

---

## Task 9: Create corsets.html

**Files:**
- Create: `corsets.html`

- [ ] **Step 1: Create corsets.html**

- `CATEGORY_TITLE` = `Corsets`
- `CATEGORY_HEADING` = `Corsets`
- `CATEGORY_SUBTITLE` = `Corsets estructurados y kits especiales. Diseños que realzan la figura con detalle de lujo.`
- Products from **corsets** table (6 products)
- WhatsApp category: `Corsets`

- [ ] **Step 2: Screenshot** — save to `/tmp/corsets.png`

---

## Task 10: Create pijamas.html

**Files:**
- Create: `pijamas.html`

- [ ] **Step 1: Create pijamas.html**

- `CATEGORY_TITLE` = `Pijamas Rouge`
- `CATEGORY_HEADING` = `Pijama Rouge`
- `CATEGORY_SUBTITLE` = `Pijamas de diseño propio, completamente personalizables en tela, estampa y bordado.`
- Products from **pijamas** table (8 products)
- WhatsApp category: `Pijamas`

- [ ] **Step 2: Screenshot** — save to `/tmp/pijamas.png`

---

## Task 11: Create disfraces.html

**Files:**
- Create: `disfraces.html`

- [ ] **Step 1: Create disfraces.html**

- `CATEGORY_TITLE` = `Disfraces`
- `CATEGORY_HEADING` = `Disfraces`
- `CATEGORY_SUBTITLE` = `Colección de roles y fantasías: mucama, colegiala, policía, enfermera, conejita y más.`
- Products from **disfraces** table (8 products)
- WhatsApp category: `Disfraces`

- [ ] **Step 2: Screenshot** — save to `/tmp/disfraces.png`

---

## Task 12: Create sexshop.html

**Files:**
- Create: `sexshop.html`

- [ ] **Step 1: Create sexshop.html**

- `CATEGORY_TITLE` = `Sexshop`
- `CATEGORY_HEADING` = `Sexshop`
- `CATEGORY_SUBTITLE` = `Vibradores, lubricantes, cremas y kits para potenciar tu intimidad. Envío discreto.`
- Products from **sexshop** table (8 products)
- WhatsApp category: `Sexshop`

- [ ] **Step 2: Screenshot** — save to `/tmp/sexshop.png`

---

## Task 13: Create perfume-feromonas.html

**Files:**
- Create: `perfume-feromonas.html`

- [ ] **Step 1: Create perfume-feromonas.html**

- `CATEGORY_TITLE` = `Perfumes con Feromonas`
- `CATEGORY_HEADING` = `Perfumes con Feromonas`
- `CATEGORY_SUBTITLE` = `Colecciones Hot Inevitable, Hotel y Body Splash. Fragancias diseñadas para seducir.`
- Products from **perfume-feromonas** table (8 products)
- WhatsApp category: `Perfumes`

- [ ] **Step 2: Screenshot** — save to `/tmp/perfume.png`

---

## Task 14: Create panty-vedetina-culotte.html

**Files:**
- Create: `panty-vedetina-culotte.html`

- [ ] **Step 1: Create panty-vedetina-culotte.html**

- `CATEGORY_TITLE` = `Complementos`
- `CATEGORY_HEADING` = `Complementos`
- `CATEGORY_SUBTITLE` = `Panties, culottes, medias y accesorios para completar tu look de lencería.`
- Products from **panty-vedetina-culotte** table (4 products)
- WhatsApp category: `Complementos`

- [ ] **Step 2: Screenshot** — save to `/tmp/panty.png`

---

## Task 15: Create productos.html

**Files:**
- Create: `productos.html`

- [ ] **Step 1: Create productos.html**

`productos.html` is a category-index page, not a product grid. Structure:

```html
<!-- Same nav + promo + page-hero as template -->
<!-- page-hero: "Todos los productos" / subtitle: "Explorar toda la colección Rouge Intime" -->

<!-- CATEGORIES GRID -->
<section class="products-section">
  <h2 class="products-section-title">Explorar por categoría</h2>
  <div class="products-grid">
    <!-- One card per category, linking to that category page -->
    <!-- Use first product image from each category as card image -->
    <!-- Card shows category name + "Ver colección →" link -->
  </div>
</section>
```

Categories to include (12 total), using first image from each category's table in this plan:

| Category | Link | Hero image |
|---|---|---|
| Sets | `sets.html` | `aeb221d5-6cdd-4048-bb7e-daf221c191f1-361faac88494a13abb17046137568746-1024-1024.webp` |
| Baby Doll | `baby-doll.html` | `35c21dbf-688d-4279-8f92-8a72b07c2eda-045d4cf1fd7019354317169231601594-1024-1024.webp` |
| Conjuntos | `conjuntos.html` | `631c77ee-aef2-4f7e-ab39-bd82654c5e60-6bc4469b812a837b9017038844322122-1024-1024.webp` |
| Body | `body.html` | `35c21dbf-688d-4279-8f92-8a72b07c2eda-045d4cf1fd7019354317169231601594-1024-1024.webp` |
| Bata | `bata.html` | `912115c5-9b8d-45e6-a5d0-bf49c144a5cc-948c885fe0202a70d717162914059902-1024-1024.webp` |
| Catsuit | `catsuit.html` | `captura-de-pantalla-2025-10-02-130907-80413c236be6a2306417594214744265-1024-1024.webp` |
| Corsets | `corsets.html` | `4564abc5-c86f-4a41-bcba-0cdb8a951978-e5e8eda572d1c760fc17250263565655-1024-1024.webp` |
| Pijama Rouge | `pijamas.html` | `3a481bcb-f3af-4625-b3cc-dd66dafa1c05-a00a0a8830d20994d117424915920733-1024-1024.webp` |
| Disfraces | `disfraces.html` | `captura-de-pantalla-2024-07-29-100300-eeeebf11ee1f0a19fa17222593428353-1024-1024.webp` |
| Sexshop | `sexshop.html` | `13a5df64-a9bf-4195-9062-11cafac364c2-5bb4dbb8796dfb425217424924874828-1024-1024.webp` |
| Perfume Feromonas | `perfume-feromonas.html` | `captura-de-pantalla-2025-07-17-091848-c4ce00108efe346ed417527547504909-1024-1024.webp` |
| Complementos | `panty-vedetina-culotte.html` | `2a2c3756-785b-4482-b9dd-723b4320d74e-4d940b4fbee6dd69bc17046084214389-1024-1024.webp` |

Category card HTML (repeat per row in table):
```html
<a href="{{CATEGORY_LINK}}" class="product-card fade-in" style="text-decoration:none; display:block;">
  <img class="product-card-img"
    src="https://acdn-us.mitiendanube.com/stores/004/099/592/products/{{IMAGE_FILENAME}}?w=480"
    alt="{{CATEGORY_NAME}} — Rouge Intime" loading="lazy" />
  <div class="product-card-body">
    <div class="product-card-name">{{CATEGORY_NAME}}</div>
    <span class="product-card-cta" style="pointer-events:none;">
      Ver colección
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </span>
  </div>
</a>
```

- [ ] **Step 2: Screenshot** — save to `/tmp/productos.png`

---

## Task 16: Create contacto.html

**Files:**
- Create: `contacto.html`

- [ ] **Step 1: Create contacto.html**

Use the page template (nav, promo, footer). Page-hero: title "Contacto", subtitle "Estamos para ayudarte. Escribinos por WhatsApp o por email."

Contact section HTML (add after page-hero, before footer):

```html
<section class="products-section" style="max-width:680px;">
  <div style="display:grid; gap:1.5rem;">

    <!-- WhatsApp card -->
    <div class="product-card" style="padding:0;">
      <div class="product-card-body" style="padding:2rem;">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
          <div style="width:48px;height:48px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
          <div>
            <div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:600;">WhatsApp</div>
            <div style="font-size:0.85rem;opacity:0.6;">Respuesta rápida</div>
          </div>
        </div>
        <p style="font-size:0.9rem;opacity:0.75;margin-bottom:1.25rem;">Consultá por talles, colores, tiempo de entrega y personalización. Respondemos en el día.</p>
        <a href="https://wa.me/+541158861214?text=Hola!%20Quiero%20consultar%20sobre%20sus%20productos" class="product-card-cta" target="_blank" rel="noopener">Escribir por WhatsApp</a>
      </div>
    </div>

    <!-- Email card -->
    <div class="product-card" style="padding:0;">
      <div class="product-card-body" style="padding:2rem;">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
          <div style="width:48px;height:48px;background:var(--color-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div>
            <div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:600;">Email</div>
            <div style="font-size:0.85rem;opacity:0.6;">rougeintimelenceria@gmail.com</div>
          </div>
        </div>
        <p style="font-size:0.9rem;opacity:0.75;margin-bottom:1.25rem;">Para consultas formales, pedidos especiales o devoluciones.</p>
        <a href="mailto:rougeintimelenceria@gmail.com" class="product-card-cta">Enviar email</a>
      </div>
    </div>

    <!-- Instagram card -->
    <div class="product-card" style="padding:0;">
      <div class="product-card-body" style="padding:2rem;">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
          <div style="width:48px;height:48px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </div>
          <div>
            <div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:600;">Instagram</div>
            <div style="font-size:0.85rem;opacity:0.6;">@rougeintime.ar</div>
          </div>
        </div>
        <p style="font-size:0.9rem;opacity:0.75;margin-bottom:1.25rem;">Seguinos para ver los últimos diseños, novedades y ofertas.</p>
        <a href="https://www.instagram.com/rougeintime.ar" class="product-card-cta" target="_blank" rel="noopener">Ir al Instagram</a>
      </div>
    </div>

  </div>
</section>
```

- [ ] **Step 2: Screenshot** — save to `/tmp/contacto.png`

---

## Task 17: Create politica-de-cambios.html

**Files:**
- Create: `politica-de-cambios.html`

- [ ] **Step 1: Create politica-de-cambios.html**

Page-hero: title "Política de Cambios", subtitle "Información sobre cambios, devoluciones y condiciones de compra."

Content section HTML:

```html
<section class="products-section" style="max-width:740px;">
  <div class="product-card" style="padding:0;">
    <div class="product-card-body" style="padding:2rem 2.5rem; line-height:1.8;">

      <h2 style="font-family:var(--font-heading);font-size:1.5rem;font-weight:600;margin-bottom:1.5rem;color:var(--color-primary);">Producción a Pedido</h2>
      <p style="font-size:0.95rem;opacity:0.85;margin-bottom:1.5rem;">
        Todos nuestros productos son <strong>confeccionados a pedido</strong>. El tiempo de demora es de <strong>15 a 20 días hábiles</strong> desde la confirmación del pago.
      </p>

      <h2 style="font-family:var(--font-heading);font-size:1.5rem;font-weight:600;margin-bottom:1.5rem;color:var(--color-primary);">Cambios y Devoluciones</h2>
      <p style="font-size:0.95rem;opacity:0.85;margin-bottom:1rem;">
        <strong>Por defectos de fabricación:</strong> Realizamos el cambio o reposición del artículo sin cargo adicional. Es necesario enviar fotos del defecto dentro de las 48 hs de recibido el pedido.
      </p>
      <p style="font-size:0.95rem;opacity:0.85;margin-bottom:1.5rem;">
        <strong>Por arrepentimiento de compra:</strong> Se aplica una deducción del <strong>45%</strong> sobre el valor del producto para cubrir los costos de confección. No se aceptan cambios por talle incorrecto si el talle fue confirmado por la compradora al momento del pedido.
      </p>

      <h2 style="font-family:var(--font-heading);font-size:1.5rem;font-weight:600;margin-bottom:1.5rem;color:var(--color-primary);">Personalización</h2>
      <p style="font-size:0.95rem;opacity:0.85;margin-bottom:1.5rem;">
        Los productos personalizados (con nombre, bordado o modificaciones de diseño) <strong>no tienen cambio ni devolución</strong> excepto por defecto de fabricación.
      </p>

      <h2 style="font-family:var(--font-heading);font-size:1.5rem;font-weight:600;margin-bottom:1.5rem;color:var(--color-primary);">Talles</h2>
      <p style="font-size:0.95rem;opacity:0.85;margin-bottom:1.5rem;">
        Contamos con 10 talles estándar y también realizamos prendas <strong>a medida</strong>. Consultá nuestra <a href="guia-de-talles.html" style="color:var(--color-primary);text-decoration:underline;">Guía de Talles</a> antes de confirmar tu pedido.
      </p>

      <h2 style="font-family:var(--font-heading);font-size:1.5rem;font-weight:600;margin-bottom:1.5rem;color:var(--color-primary);">Consultas</h2>
      <p style="font-size:0.95rem;opacity:0.85;margin-bottom:1.5rem;">
        Ante cualquier duda escribinos por <a href="https://wa.me/+541158861214?text=Hola!%20Quiero%20consultar%20sobre%20cambios%20y%20devoluciones" style="color:var(--color-primary);text-decoration:underline;" target="_blank" rel="noopener">WhatsApp</a> o por email a <a href="mailto:rougeintimelenceria@gmail.com" style="color:var(--color-primary);text-decoration:underline;">rougeintimelenceria@gmail.com</a>.
      </p>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Screenshot** — save to `/tmp/politica.png`

---

## Task 18: Final verification

- [ ] **Step 1: Start local server and check all pages load**

```bash
python3 -m http.server 8000 &
SERVER_PID=$!
for page in index products sets baby-doll conjuntos body bata catsuit corsets pijamas disfraces sexshop perfume-feromonas panty-vedetina-culotte contacto politica-de-cambios guia-de-talles; do
  FILE="${page}.html"
  [ "$page" = "products" ] && FILE="productos.html"
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000/${FILE}")
  echo "$FILE: $STATUS"
done
kill $SERVER_PID
```

Expected: all return `200`.

- [ ] **Step 2: Verify no broken internal links in index.html**

```bash
grep -n 'href="/' /Users/juldenarocur/Repositorios/rouge-web/index.html | grep -v 'http'
```

Expected: zero results (all internal links should be relative `.html`).

- [ ] **Step 3: Screenshot full scroll of products page**

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("file:///Users/juldenarocur/Repositorios/rouge-web/productos.html")
    page.wait_for_load_state("networkidle")
    page.evaluate("document.querySelectorAll('.fade-in').forEach(el=>el.classList.add('visible'));")
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/final-check.png", full_page=True)
    browser.close()
```

View `/tmp/final-check.png` — verify all 12 category cards render with real images.
