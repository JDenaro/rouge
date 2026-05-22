import Link from 'next/link'
import { getFeaturedProducts, transferPrice } from '@/lib/products'
import { formatARS } from '@/lib/mock-data'

export async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (products.length === 0) {
    return null
  }

  return (
    <section
      style={{
        padding: '6rem 1.5rem',
        background: 'linear-gradient(180deg, rgba(192, 68, 90, 0.04) 0%, transparent 100%)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <div>
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
              Lo más buscado
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 500,
                color: 'var(--color-fg)',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Destacados
            </h2>
          </div>

          <Link
            href="/productos"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--color-primary)',
              paddingBottom: '2px',
            }}
          >
            Ver todo →
          </Link>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.map((p) => {
            const image = p.images?.[0] ?? ''
            const tPrice = transferPrice(p.price)
            return (
              <article
                key={p.slug}
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
                <Link href={`/producto/${p.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '3 / 4',
                      overflow: 'hidden',
                      background: 'rgba(192, 68, 90, 0.04)',
                    }}
                  >
                    <div
                      aria-hidden
                      className="rouge-prod-img"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url('${image}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform var(--dur-slow) var(--ease-out)',
                      }}
                    />
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

                  <div style={{ padding: '1.25rem' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.375rem',
                        fontWeight: 500,
                        margin: 0,
                        marginBottom: '0.5rem',
                        color: 'var(--color-fg)',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {p.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '1.0625rem',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                        }}
                      >
                        {formatARS(tPrice)}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8125rem',
                          color: 'var(--color-fg)',
                          opacity: 0.5,
                          textDecoration: 'line-through',
                        }}
                      >
                        {formatARS(p.price)}
                      </span>
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'var(--color-fg)',
                      }}
                    >
                      Comprar
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>

      <style>{`
        .rouge-prod-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(192, 68, 90, 0.18);
        }
        .rouge-prod-card:hover .rouge-prod-img {
          transform: scale(1.04);
        }
      `}</style>
    </section>
  )
}
