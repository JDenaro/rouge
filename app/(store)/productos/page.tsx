import Link from 'next/link'
import { ProductGrid } from '@/components/store/ProductGrid'
import {
  CATEGORY_META,
  VALID_CATEGORIES,
  getCatalog,
  getCategoryCounts,
  isValidCategory,
} from '@/lib/products'
import type { ProductCategory } from '@/lib/supabase/types'
import { SortSelect } from './SortSelect'

type SearchParams = {
  cat?: string
  orden?: string
}

export const dynamic = 'force-dynamic'

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const cat = sp.cat && isValidCategory(sp.cat) ? (sp.cat as ProductCategory) : undefined
  const sort =
    sp.orden === 'price-asc' || sp.orden === 'price-desc' || sp.orden === 'name'
      ? sp.orden
      : undefined

  const [products, counts] = await Promise.all([
    getCatalog({ category: cat, sort }),
    getCategoryCounts(),
  ])

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div style={{ padding: '7rem 1.5rem 4rem', maxWidth: '1280px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
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
          Catálogo
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 500,
            color: 'var(--color-fg)',
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          {cat ? CATEGORY_META[cat].label : 'Todo Rouge'}
        </h1>
      </header>

      {/* Category chips row */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '1.25rem',
          scrollbarWidth: 'none',
        }}
        className="rouge-chips-row"
      >
        {/* "Todos" chip */}
        <Link
          href={sort ? `/productos?orden=${sort}` : '/productos'}
          style={chipStyle(!cat)}
        >
          Todas{' '}
          <span style={{ opacity: 0.65, fontSize: '0.75rem' }}>{total}</span>
        </Link>

        {VALID_CATEGORIES.map((c) => {
          const count = counts[c] ?? 0
          if (!count) return null
          const isActive = cat === c
          const href = `/productos?cat=${c}${sort ? `&orden=${sort}` : ''}`
          return (
            <Link key={c} href={href} style={chipStyle(isActive)}>
              {CATEGORY_META[c].label}{' '}
              <span style={{ opacity: 0.65, fontSize: '0.75rem' }}>{count}</span>
            </Link>
          )
        })}
      </div>

      {/* Count + sort bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          gap: '1rem',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-fg)',
            opacity: 0.6,
            margin: 0,
          }}
        >
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
        </p>

        <SortSelect currentSort={sort ?? ''} currentCat={cat ?? ''} />
      </div>

      <ProductGrid products={products} />

      <style>{`
        .rouge-chips-row::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.875rem',
    borderRadius: '999px',
    border: '1.5px solid var(--color-primary)',
    background: active ? 'var(--color-primary)' : 'transparent',
    color: active ? 'white' : 'var(--color-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'all 180ms ease-out',
    flexShrink: 0,
  }
}
