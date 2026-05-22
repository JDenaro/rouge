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

type SearchParams = {
  cat?: string
  orden?: string
}

const SORT_LABELS: Record<string, string> = {
  '': 'Más recientes',
  name: 'Nombre',
  'price-asc': 'Precio: menor a mayor',
  'price-desc': 'Precio: mayor a menor',
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
      <header style={{ marginBottom: '2.5rem' }}>
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
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-fg)', opacity: 0.6, marginTop: '0.5rem' }}>
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
          {cat ? '' : ` · ${total} en total`}
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '2.5rem',
          alignItems: 'flex-start',
        }}
        className="rouge-catalog-layout"
      >
        <aside className="rouge-catalog-aside">
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={asideTitle}>Categorías</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li>
                <Link href={`/productos${sort ? `?orden=${sort}` : ''}`} style={asideLink(!cat)}>
                  Todas <span style={asideCount}>({total})</span>
                </Link>
              </li>
              {VALID_CATEGORIES.map((c) => {
                const count = counts[c] ?? 0
                if (!count) return null
                const isActive = cat === c
                const href = `/productos?cat=${c}${sort ? `&orden=${sort}` : ''}`
                return (
                  <li key={c}>
                    <Link href={href} style={asideLink(isActive)}>
                      {CATEGORY_META[c].label} <span style={asideCount}>({count})</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h3 style={asideTitle}>Ordenar por</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {Object.entries(SORT_LABELS).map(([key, label]) => {
                const isActive = (sort ?? '') === key
                const params = new URLSearchParams()
                if (cat) params.set('cat', cat)
                if (key) params.set('orden', key)
                const href = `/productos${params.toString() ? `?${params}` : ''}`
                return (
                  <li key={key}>
                    <Link href={href} style={asideLink(isActive)}>
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        <section>
          <ProductGrid products={products} />
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .rouge-catalog-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .rouge-catalog-aside {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(192, 68, 90, 0.12);
          }
          .rouge-catalog-aside ul {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .rouge-catalog-aside li a {
            padding: 0.625rem 0.875rem !important;
            min-height: 40px;
            display: inline-flex !important;
            align-items: center;
            border-radius: 999px;
            background: rgba(192, 68, 90, 0.06);
            font-size: 0.8125rem !important;
          }
        }
      `}</style>
    </div>
  )
}

const asideTitle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-primary)',
  margin: 0,
  marginBottom: '0.875rem',
}

function asideLink(active: boolean): React.CSSProperties {
  return {
    display: 'block',
    padding: '0.5rem 0',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    color: active ? 'var(--color-primary)' : 'var(--color-fg)',
    fontWeight: active ? 600 : 400,
    textDecoration: 'none',
  }
}

const asideCount: React.CSSProperties = {
  fontSize: '0.75rem',
  opacity: 0.5,
  marginLeft: '0.25rem',
}
