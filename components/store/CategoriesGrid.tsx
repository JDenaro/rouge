import Link from 'next/link'
import { categories } from '@/lib/mock-data'
import { getCategoryThumbnails } from '@/lib/products'

export async function CategoriesGrid() {
  const thumbnails = await getCategoryThumbnails(categories.map((c) => c.slug))
  return (
    <section
      style={{
        padding: '6rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
          Explorá
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
          Categorías
        </h2>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {categories.map((cat) => {
          const image = thumbnails[cat.slug] || cat.image
          return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            style={{
              position: 'relative',
              display: 'block',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '3 / 4',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-card)',
              transition: 'transform var(--dur-mid) var(--ease-out), box-shadow var(--dur-mid) var(--ease-out)',
            }}
            className="rouge-cat-card"
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform var(--dur-slow) var(--ease-out)',
              }}
              className="rouge-cat-img"
            />
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(26, 10, 13, 0) 40%, rgba(26, 10, 13, 0.75) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '1rem',
                right: '1rem',
                bottom: '1rem',
                color: 'white',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  margin: 0,
                  marginBottom: '0.25rem',
                  letterSpacing: '0.01em',
                }}
              >
                {cat.label}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  margin: 0,
                  opacity: 0.85,
                }}
              >
                {cat.description}
              </p>
            </div>
          </Link>
          )
        })}
      </div>

      <style>{`
        .rouge-cat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(192, 68, 90, 0.18);
        }
        .rouge-cat-card:hover .rouge-cat-img {
          transform: scale(1.06);
        }
      `}</style>
    </section>
  )
}
