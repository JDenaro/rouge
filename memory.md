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
