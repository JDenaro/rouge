import Link from 'next/link'
import type { Product } from '@/lib/supabase/types'
import { transferPrice } from '@/lib/products'
import { formatARS } from '@/lib/mock-data'

export function ProductCard({ product }: { product: Product }) {
  const image = product.images?.[0] ?? ''
  const tPrice = transferPrice(product.price)

  return (
    <article
      className="rouge-prod-card"
      style={{
        position: 'relative',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform var(--dur-mid) var(--ease-out), box-shadow var(--dur-mid) var(--ease-out)',
      }}
    >
      <Link href={`/producto/${product.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            background: 'rgba(192, 68, 90, 0.04)',
          }}
        >
          {image && (
            <img
              src={image}
              alt={product.name}
              className="rouge-prod-img"
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform var(--dur-slow) var(--ease-out)',
              }}
            />
          )}
          <span
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              padding: '0.25rem 0.625rem',
              borderRadius: '999px',
              background: 'var(--color-primary)',
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            -12% transfer
          </span>
        </div>

        <div style={{ padding: '1.125rem 1.25rem 1.25rem' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 500,
              margin: 0,
              marginBottom: '0.375rem',
              color: 'var(--color-fg)',
              letterSpacing: '0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
              }}
            >
              {formatARS(tPrice)}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'var(--color-fg)',
                opacity: 0.5,
                textDecoration: 'line-through',
              }}
            >
              {formatARS(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
