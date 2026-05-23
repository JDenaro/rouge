import Link from 'next/link'

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-fg)',
        color: 'rgba(253, 248, 248, 0.85)',
        padding: '4rem 1.5rem 2rem',
        marginTop: '4rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 500,
                color: 'var(--color-primary)',
                margin: 0,
                marginBottom: '0.75rem',
              }}
            >
              Rouge Intime
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                margin: 0,
                opacity: 0.75,
              }}
            >
              Lencería fina hecha a medida en Argentina. Cada prenda confeccionada con tiempo, cuidado y materiales seleccionados.
            </p>
          </div>

          <div>
            <h4 style={footerHeading}>Tienda</h4>
            <ul style={footerList}>
              <li><Link href="/productos" style={footerLink}>Todo el catálogo</Link></li>
              <li><Link href="/sets" style={footerLink}>Sets</Link></li>
              <li><Link href="/body" style={footerLink}>Body</Link></li>
              <li><Link href="/corsets" style={footerLink}>Corsets</Link></li>
              <li><Link href="/sexshop" style={footerLink}>Sexshop</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={footerHeading}>Información</h4>
            <ul style={footerList}>
              <li><Link href="/guia-de-talles" style={footerLink}>Guía de talles</Link></li>
              <li><Link href="/faq" style={footerLink}>Preguntas frecuentes</Link></li>
              <li><Link href="/politica-de-cambios" style={footerLink}>Política de cambios</Link></li>
              <li><Link href="/contacto" style={footerLink}>Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={footerHeading}>Contacto</h4>
            <ul style={footerList}>
              <li>
                <a
                  href="https://wa.me/+541158861214"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={footerLink}
                >
                  WhatsApp +54 11 5886-1214
                </a>
              </li>
              <li>
                <a href="mailto:rougeintimelenceria@gmail.com" style={footerLink}>
                  rougeintimelenceria@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/rougeintime.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={footerLink}
                >
                  @rougeintime.ar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(253, 248, 248, 0.12)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            opacity: 0.6,
          }}
        >
          <span>© {new Date().getFullYear()} Rouge Intime · Todos los derechos reservados</span>
          <span>Morón, Buenos Aires · Argentina</span>
        </div>
      </div>
    </footer>
  )
}

const footerHeading: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-bg)',
  margin: 0,
  marginBottom: '1rem',
}

const footerList: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
}

const footerLink: React.CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'rgba(253, 248, 248, 0.75)',
  textDecoration: 'none',
  padding: '0.5rem 0.25rem',
  margin: '0 -0.25rem',
  minWidth: '44px',
  lineHeight: 1.5,
  transition: 'color var(--dur-fast) var(--ease-out)',
}
