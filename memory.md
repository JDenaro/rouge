# memory.md — Changelog de cambios en rouge-web

Registro cronológico de cambios significativos realizados con Claude Code. Cada entrada incluye fecha, archivo(s) afectado(s) y descripción del cambio.

---

## 2026-06-03

### UX P1 — Filtros de categoría y ordenamiento en /productos
**Archivos:** `app/(store)/productos/page.tsx`, `app/(store)/productos/SortSelect.tsx` (nuevo)
- Agregada fila de chips scrolleable con todas las categorías y sus counts (`?cat=sets`, etc.)
- Chip activo se rellena en `var(--color-primary)`; inactivos con borde y texto primario
- Dropdown de ordenamiento (Más recientes / Nombre / Precio ↑ / Precio ↓) como Client Component separado
- El backend de filtering vía `searchParams` ya existía; este cambio agrega la UI

### UX P1 — Estado activo en navbar
**Archivo:** `components/store/Nav.tsx`
- Agregado `usePathname()` de `next/navigation`
- Link activo resaltado con `color: var(--color-primary)`, `fontWeight: 600`, underline de 2px
- Aplica tanto en desktop nav como en el mobile drawer
- Lógica: `pathname === href` o `pathname.startsWith(href + '/')`. `/productos` solo hace match exacto.

### UX P1 — Imágenes de productos migradas a `<img>` con alt text
**Archivos:** `components/store/ProductCard.tsx`, `app/(store)/producto/[slug]/page.tsx`
- Reemplazado `<div aria-hidden style={{ backgroundImage: ... }}>` por `<img src alt loading="lazy">`
- Mismo aspecto visual con `objectFit: cover` + `objectPosition: center`
- Mejora SEO de imágenes (Google Images) y accesibilidad (lectores de pantalla)

### UX — Eliminado scrollbar interno en página de producto
**Archivo:** `app/(store)/producto/[slug]/page.tsx`
- Eliminado `height: calc(100vh - 10rem)` del grid de detalle
- Eliminado `overflowY: auto` del column `rouge-product-info`
- Agregado `minHeight: 520px` a la columna de imagen (desktop) y `320px` en mobile
- Ambas columnas ahora tienen la misma altura via `alignItems: stretch`

---

## 2026-06-04

### Security S1 — Auth guard en admin server actions
**Archivos:** `app/(admin)/admin/productos/actions.ts`, `app/(admin)/admin/ordenes/actions.ts`
- Agregado `requireAdmin()` al inicio de cada action: verifica cookie + JWT antes de ejecutar
- Protege `toggleProductActive`, `updateProductPrice`, `updateOrderStatus`
- El middleware solo protege navegación de páginas; las actions son endpoints POST independientes

### UX — Contacto: eliminado email, solo WhatsApp e Instagram
**Archivos:** `app/(store)/contacto/page.tsx`, `components/store/Footer.tsx`
- Removida tarjeta Email de la página de contacto
- Removido link `mailto:` del footer
- Handle de Instagram corregido a `@rougeintime` (sin `.ar`)
- Texto del subtítulo actualizado: "escribinos por WhatsApp o Instagram"

### UX — Tiempo de producción movido antes del CTA
**Archivo:** `app/(store)/producto/[slug]/page.tsx`
- Bloque "⏱ Tiempo de producción: 15–20 días hábiles" movido antes del AddToCart
- Texto actualizado: aplica a todos los productos, no solo "hecho a medida"
- Copy personalizado: "Cada pieza se confecciona para vos luego de tu compra"

### Feature — Galería de imágenes en página de producto
**Archivos:** `components/store/ProductGallery.tsx` (nuevo), `app/(store)/producto/[slug]/page.tsx`
- Nuevo Client Component con estado `activeIndex`
- Con 1 imagen: idéntico al comportamiento anterior (thumbnails no se renderizan)
- Con 2+ imágenes: strip de thumbnails 72×72px con borde primario en el activo
- La galería aparece automáticamente cuando se agreguen imágenes en Supabase

### Feature — Política de cambios en desktop nav + contenido expandido
**Archivos:** `components/store/Nav.tsx`, `app/(store)/politica-de-cambios/page.tsx`
- Link "Política de cambios" agregado a la derecha del desktop nav (opacidad 0.6, secundario)
- Mobile drawer y footer ya tenían el link
- Página expandida de 5 a 8 secciones con contenido completo del sitio real (Ley 24.240, logística, responsabilidad del comprador)

### UX — Testimonios con avatar
**Archivo:** `components/store/Testimonials.tsx`
- Círculo con inicial del nombre agregado al footer de cada card de reseña
- Gradientes de marca: rose (#C0445A→#d4697c), vino (#9B3A6E→#C0445A), dorado (#D97706→#C0445A)

### UX — Grid de catálogo: 4 col desktop, 3 tablet, 2 mobile
**Archivo:** `components/store/ProductGrid.tsx`
- Reemplazado `auto-fit, minmax(220px, 1fr)` por breakpoints explícitos
- ≥1024px: 4 columnas | 640–1023px: 3 columnas | <640px: 2 columnas

---

## 2026-05-30 / 2026-05-31

### Fix — Selector de talles rediseñado (category-aware)
**Archivos:** `components/store/AddToCart.tsx`
- Rediseño completo: selector de talla corpiño + talla pantalón según categoría
- Sistema "A Medida" para pijamas y otras categorías custom
- Corrección de bug silencioso en `buildSizeString()` para la rama `corpino-only`
- Commit: `d628ec1` en `feature/size-selector-redesign`, mergeado a `develop`

### Fix — Layout producto above-the-fold (estado final)
**Archivo:** `app/(store)/producto/[slug]/page.tsx`
- Historial de iteraciones: c289188 → revert → 04a2d4e (30% width) → revert → af7ffd5 (re-apply above-fold)
- Estado final activo: imagen llena la columna izquierda, info en columna derecha con scroll interno

### Fix — Instagram link URL
**Archivos:** `components/store/Footer.tsx`, `app/(store)/contacto/page.tsx`
- URL corregida a `https://www.instagram.com/rougeintime`
- Handle de display en contacto también actualizado
