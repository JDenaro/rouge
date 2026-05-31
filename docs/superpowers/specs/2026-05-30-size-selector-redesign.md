# Size Selector Redesign + "A Medida" Option

**Date:** 2026-05-30
**Status:** Approved

## Goal

Replace the current default size pills (a flat array of strings) with a category-aware two-selector system (corpiño + pantalón), and add an "A medida" option that reveals 5 custom measurement fields. No database schema changes required.

---

## Category Matrix

| Category | Corpiño (85–150) | Pantalón (36–56) | A medida |
|---|---|---|---|
| sets | ✅ | ✅ | ✅ |
| baby-doll | ✅ | ✅ | ✅ |
| body | ✅ | ✅ | ✅ |
| catsuit | ✅ | ✅ | ✅ |
| conjuntos | ✅ | ✅ | ✅ |
| corsets | ✅ | ✅ | ✅ |
| bata | ✅ | ✅ | ✅ |
| pijamas | ✅ | ✅ | ✅ |
| disfraces | ✅ | ✅ | ✅ |
| panty-vedetina-culotte | ❌ | ✅ | ✅ |
| sexshop | ❌ | ❌ | ❌ |
| perfume-feromonas | ❌ | ❌ | ❌ |

---

## Size Ranges

- **Corpiño:** 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150 (step 5)
- **Pantalón:** 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56 (step 2)

---

## UX Behavior

### Standard mode (default)

1. If category shows corpiño: render **"Talle corpiño"** section with pills 85–150.
2. If category shows pantalón: render **"Talle pantalón"** section with pills 36–56.
3. "A medida" pill appears at the end of the **last** size section.
4. Below the last section, render the legend:
   > *"Si necesitás un talle distinto, seleccioná la opción A medida."*
5. First pill of each selector is pre-selected by default.

### "A medida" mode (when "A medida" pill is selected)

1. Both size selectors are hidden.
2. Five labeled text inputs appear in order:
   - Bajo busto
   - Busto
   - Cadera
   - Cintura
   - Largo de bajo busto a pelvis
3. All five fields are required. If any is empty when the user clicks "Agregar al carrito", an error is shown and the item is not added.
4. Legend is hidden in this mode.

### No sizes (sexshop, perfume-feromonas)

No selectors, no "A medida", no legend. Only color selector (if any) + quantity + add-to-cart button.

---

## Serialization (cart `size` field — `string`, no schema change)

| Mode | Value stored in `size` |
|---|---|
| Both selectors | `"Corpiño: 95 / Pantalón: 42"` |
| Pantalón only | `"Pantalón: 42"` |
| A medida | `"A medida — BB: 85cm / B: 90cm / C: 70cm / Ci: 65cm / L: 30cm"` |

Field abbreviations: BB = Bajo busto, B = Busto, C = Cadera, Ci = Cintura, L = Largo.

---

## Architecture

### `lib/products.ts` — add `CATEGORY_SIZES`

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

### `components/store/AddToCart.tsx` — updated props

Replace `sizes: string[]` with `category: ProductCategory`.

### `app/(store)/producto/[slug]/page.tsx`

Pass `category={product.category}` instead of `sizes={sizes}`. Remove `DEFAULT_SIZES` constant.

---

## Files Changed

| File | Action |
|---|---|
| `lib/products.ts` | Add `CategorySizesConfig` type + `CATEGORY_SIZES` map |
| `components/store/AddToCart.tsx` | Replace size-pills logic with new two-selector + A medida system |
| `app/(store)/producto/[slug]/page.tsx` | Pass `category` instead of `sizes` to `AddToCart` |

---

## Out of Scope

- No Supabase schema changes.
- No changes to checkout flow — `size` is already a `string` there.
- No admin UI changes — admin renders `size` as plain text.
- `product.sizes` DB field is ignored going forward; presentation is category-driven.
