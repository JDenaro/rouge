import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/store/ProductGrid'
import {
  CATEGORY_META,
  VALID_CATEGORIES,
  getCatalog,
  isValidCategory,
} from '@/lib/products'
import type { ProductCategory } from '@/lib/supabase/types'

const RESERVED = new Set([
  'productos',
  'producto',
  'checkout',
  'carrito',
  'admin',
  'api',
  'guia-de-talles',
  'politica-de-cambios',
  'contacto',
])

export const dynamicParams = true

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((c) => ({ category: c }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  if (RESERVED.has(category)) notFound()
  if (!isValidCategory(category)) notFound()

  const cat = category as ProductCategory
  const products = await getCatalog({ category: cat })
  const meta = CATEGORY_META[cat]

  return (
    <div style={{ padding: '7rem 1.5rem 4rem', maxWidth: '1280px', margin: '0 auto' }}>
      <nav
        aria-label="Breadcrumb"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-fg)',
          opacity: 0.65,
          marginBottom: '1rem',
        }}
      >
        <Link
          href="/"
          style={{ color: 'inherit', textDecoration: 'none', padding: '0.5rem 0', display: 'inline-block', lineHeight: 1.4 }}
        >
          Inicio
        </Link>
        {' / '}
        <Link
          href="/productos"
          style={{ color: 'inherit', textDecoration: 'none', padding: '0.5rem 0', display: 'inline-block', lineHeight: 1.4 }}
        >
          Catálogo
        </Link>
        {' / '}
        <span>{meta.label}</span>
      </nav>

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
          {meta.description}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 500,
            color: 'var(--color-fg)',
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}
        >
          {meta.label}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-fg)',
            opacity: 0.6,
            marginTop: '0.5rem',
          }}
        >
          {products.length} {products.length === 1 ? 'producto' : 'productos'}
        </p>
      </header>

      <ProductGrid products={products} />
    </div>
  )
}
