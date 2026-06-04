const TESTIMONIALS = [
  {
    name: 'Camila R.',
    detail: 'Talle 100C · Buenos Aires',
    quote:
      'Pedí un set a medida y me sorprendió la calidad de la tela y los detalles. Es la primera vez que un corpiño me queda perfecto.',
    avatarBg: 'linear-gradient(135deg, #C0445A, #d4697c)',
  },
  {
    name: 'Florencia M.',
    detail: 'Talle 95B · Córdoba',
    quote:
      'El proceso fue clarísimo, la atención por WhatsApp un mimo, y la prenda llegó impecable. Ya estoy planeando el segundo pedido.',
    avatarBg: 'linear-gradient(135deg, #9B3A6E, #C0445A)',
  },
  {
    name: 'Lucía D.',
    detail: 'Talle 110D · Rosario',
    quote:
      'Tenía dudas con el talle y desde Rouge me ayudaron a medirme paso a paso. La pieza final superó mis expectativas.',
    avatarBg: 'linear-gradient(135deg, #D97706, #C0445A)',
  },
]

export function Testimonials() {
  return (
    <section
      style={{
        padding: '5rem 1.5rem',
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
          Nuestras clientas
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
          Lo que dicen de Rouge
        </h2>
      </header>

      <div
        className="rouge-testimonials-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}
      >
        {TESTIMONIALS.map((t) => (
          <article
            key={t.name}
            className="glass-card"
            style={{
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div
              aria-hidden
              style={{
                display: 'flex',
                gap: '0.25rem',
                color: 'var(--color-accent)',
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: 'var(--color-fg)',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer
              style={{
                marginTop: 'auto',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(192, 68, 90, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
              }}
            >
              <div
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: t.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  color: 'white',
                  letterSpacing: 0,
                }}
              >
                {t.name[0]}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.0625rem',
                    fontWeight: 500,
                    color: 'var(--color-primary)',
                    margin: 0,
                  }}
                >
                  {t.name}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--color-fg)',
                    opacity: 0.6,
                    margin: '0.125rem 0 0',
                  }}
                >
                  {t.detail}
                </p>
              </div>
            </footer>
          </article>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .rouge-testimonials-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
