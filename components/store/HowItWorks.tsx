const STEPS = [
  {
    n: '01',
    title: 'Elegí tu prenda',
    body: 'Encontrá la pieza ideal en el catálogo. Cada modelo está disponible en talles del 85 al 140+.',
  },
  {
    n: '02',
    title: 'Hecho a tu medida',
    body: 'Confeccionamos cada pedido en 15 a 20 días con tela seleccionada y terminaciones artesanales.',
  },
  {
    n: '03',
    title: 'Llega a tu casa',
    body: 'Despachamos a todo el país con Andreani o Correo Argentino. Retiro gratis en Morón.',
  },
]

const PAYMENTS = [
  { label: 'MercadoPago', sub: 'Tarjetas y dinero en cuenta' },
  { label: 'Transferencia', sub: '12% OFF directo' },
  { label: 'Hasta 3 cuotas', sub: 'Sin interés' },
]

export function HowItWorks() {
  return (
    <section style={{ padding: '6rem 1.5rem', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
            Cómo funciona
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
            De nuestro taller, a tu cuerpo.
          </h2>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem',
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                padding: '2rem 1.75rem',
                borderRadius: 'var(--radius-lg)',
                background: 'white',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.75rem',
                  fontWeight: 400,
                  color: 'var(--color-primary)',
                  marginBottom: '0.5rem',
                  fontStyle: 'italic',
                  lineHeight: 1,
                }}
              >
                {s.n}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  margin: 0,
                  marginBottom: '0.75rem',
                  color: 'var(--color-fg)',
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  margin: 0,
                  color: 'var(--color-fg)',
                  opacity: 0.7,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div
          className="glass-card"
          style={{
            padding: '2.5rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
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
                margin: 0,
                marginBottom: '0.5rem',
              }}
            >
              Pagá como quieras
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 500,
                margin: 0,
                color: 'var(--color-fg)',
                lineHeight: 1.15,
              }}
            >
              Opciones para todos
            </h3>
          </div>

          {PAYMENTS.map((p) => (
            <div key={p.label} style={{ borderLeft: '2px solid rgba(192, 68, 90, 0.18)', paddingLeft: '1rem' }}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--color-fg)',
                  margin: 0,
                  marginBottom: '0.125rem',
                }}
              >
                {p.label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-fg)',
                  opacity: 0.65,
                  margin: 0,
                }}
              >
                {p.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
