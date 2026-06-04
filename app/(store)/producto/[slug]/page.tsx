import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { AddToCart } from '@/components/store/AddToCart'
import { ProductGrid } from '@/components/store/ProductGrid'
import { ProductGallery } from '@/components/store/ProductGallery'
import {
  CATEGORY_META,
  getProductBySlug,
  getRelatedProducts,
  isValidCategory,
  transferPrice,
} from '@/lib/products'
import { formatARS } from '@/lib/mock-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: `${product.name} — Rouge Intime`,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images?.length ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = await getRelatedProducts(product.category, product.slug, 4)
  const tPrice = transferPrice(product.price)
  const image = product.images?.[0] ?? ''
  const colors = product.colors

  const categoryMeta = isValidCategory(product.category)
    ? CATEGORY_META[product.category]
    : { label: product.category, description: '' }

  return (
    <div style={{ padding: '7rem 1.5rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav
        aria-label="Breadcrumb"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-fg)',
          opacity: 0.65,
          marginBottom: '1.5rem',
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
          href={`/${product.category}`}
          style={{ color: 'inherit', textDecoration: 'none', padding: '0.5rem 0', display: 'inline-block', lineHeight: 1.4 }}
        >
          {categoryMeta.label}
        </Link>
        {' / '}
        <span>{product.name}</span>
      </nav>

      <div
        className="rouge-product-detail"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '3rem',
          alignItems: 'stretch',
        }}
      >
        <ProductGallery
          images={product.images ?? []}
          productName={product.name}
        />

        <div className="rouge-product-info">
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
            {categoryMeta.label}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 500,
              margin: 0,
              marginBottom: '0.75rem',
              lineHeight: 1.1,
              color: 'var(--color-fg)',
            }}
          >
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.625rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
              }}
            >
              {formatARS(tPrice)}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--color-fg)',
                opacity: 0.5,
                textDecoration: 'line-through',
              }}
            >
              {formatARS(product.price)}
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-fg)',
              opacity: 0.65,
              marginTop: 0,
              marginBottom: '1rem',
            }}
          >
            Pagando por transferencia. O hasta 3 cuotas sin interés con MercadoPago.
          </p>

          {product.description && (
            <div style={{ marginBottom: '1rem' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-fg)',
                  opacity: 0.6,
                  margin: 0,
                  marginBottom: '0.625rem',
                }}
              >
                Descripción
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  color: 'var(--color-fg)',
                  opacity: 0.85,
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {product.description}
              </p>
            </div>
          )}

          <div
            style={{
              marginBottom: '1.25rem',
              padding: '0.875rem 1.25rem',
              background: 'rgba(192, 68, 90, 0.04)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '2px solid var(--color-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              color: 'var(--color-fg)',
              opacity: 0.85,
            }}
          >
            <strong style={{ color: 'var(--color-primary)' }}>⏱ Tiempo de producción: 15–20 días hábiles.</strong>{' '}
            Cada pieza se confecciona luego de tu compra.{' '}
            <Link href="/guia-de-talles" style={{ color: 'var(--color-primary)' }}>
              Ver guía de talles →
            </Link>
          </div>

          <AddToCart
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={image}
            category={product.category}
            colors={colors}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ marginTop: '5rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 500,
              marginBottom: '2rem',
              color: 'var(--color-fg)',
              lineHeight: 1.1,
            }}
          >
            Te puede interesar
          </h2>
          <ProductGrid products={related} />
        </section>
      )}

      <style>{`
        @media (max-width: 880px) {
          .rouge-product-detail {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            align-items: flex-start !important;
          }
          .rouge-product-detail > div:first-child {
            min-height: 320px !important;
          }
        }
      `}</style>
    </div>
  )
}
