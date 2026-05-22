import Link from 'next/link'

export const metadata = {
  title: 'Guía de talles — Rouge Intime',
  description: 'Cómo tomar tus medidas y tabla de equivalencias para corpiños y bombachas.',
}

const BRA_ROWS = [
  ['85', '83–87', '98–102'],
  ['90', '88–92', '103–107'],
  ['95', '93–97', '108–112'],
  ['100', '98–102', '113–117'],
  ['105', '103–107', '118–122'],
  ['110', '108–112', '123–127'],
  ['115', '113–117', '128–132'],
  ['120', '118–122', '133–137'],
  ['125', '123–127', '138–142'],
  ['130', '128–132', '143–147'],
  ['135', '133–137', '148–151'],
  ['140', '138–142', '151–155'],
]

const BOTTOM_ROWS = [
  ['S', '67–71', '93–97'],
  ['M', '72–76', '98–102'],
  ['L', '77–81', '103–107'],
  ['XL', '82–86', '108–112'],
  ['2XL', '87–91', '113–117'],
  ['3XL', '92–96', '118–122'],
  ['4XL', '97–101', '123–127'],
  ['5XL', '102–106', '128–132'],
]

export default function GuiaTallesPage() {
  return (
    <div style={{ padding: '7rem 1.5rem 4rem', maxWidth: '900px', margin: '0 auto' }}>
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
        Talles
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
          fontWeight: 500,
          margin: 0,
          marginBottom: '0.5rem',
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
        }}
      >
        Guía de talles
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.0625rem',
          color: 'var(--color-fg)',
          opacity: 0.75,
          maxWidth: '640px',
          lineHeight: 1.6,
          marginBottom: '3rem',
        }}
      >
        Cada prenda es confeccionada a medida. Tomá tus medidas y elegí el talle más cercano —
        si estás entre dos, te recomendamos siempre el mayor para máxima comodidad.
      </p>

      <section style={cardStyle}>
        <h2 style={h2Style}>Cómo tomar tus medidas</h2>
        <p style={pStyle}>
          Usá un centímetro flexible. Tomá las medidas sin ropa o con prendas finas, parada con
          el cuerpo relajado.
        </p>
        <ol style={olStyle}>
          <li><strong>Bajo busto:</strong> debajo del pecho, donde apoya el corpiño. Firme pero cómodo.</li>
          <li><strong>Busto completo:</strong> sobre la zona más prominente del pecho.</li>
          <li><strong>Cintura:</strong> en la parte más angosta del torso.</li>
          <li><strong>Cadera:</strong> en la zona más ancha de las caderas.</li>
        </ol>
      </section>

      <section style={cardStyle}>
        <h2 style={h2Style}>Corpiños — Talles 85 al 140</h2>
        <p style={pStyle}>
          El talle se determina por el contorno bajo busto. La copa se ajusta a medida sin costo
          adicional.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Talle</th>
                <th style={thStyle}>Bajo busto (cm)</th>
                <th style={thStyle}>Busto (cm)</th>
              </tr>
            </thead>
            <tbody>
              {BRA_ROWS.map((row) => (
                <tr key={row[0]}>
                  <td style={tdStyleBold}>{row[0]}</td>
                  <td style={tdStyle}>{row[1]}</td>
                  <td style={tdStyle}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={h2Style}>Bombachas — Talles S al 5XL</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Talle</th>
                <th style={thStyle}>Cintura (cm)</th>
                <th style={thStyle}>Cadera (cm)</th>
              </tr>
            </thead>
            <tbody>
              {BOTTOM_ROWS.map((row) => (
                <tr key={row[0]}>
                  <td style={tdStyleBold}>{row[0]}</td>
                  <td style={tdStyle}>{row[1]}</td>
                  <td style={tdStyle}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div
        style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(192, 68, 90, 0.04)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '2px solid var(--color-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
        }}
      >
        ¿Dudas? Mandá tus medidas por <a href="https://wa.me/+541158861214" style={{ color: 'var(--color-primary)' }} target="_blank" rel="noopener noreferrer">WhatsApp</a> y te asesoramos sin compromiso. También podés escribirnos desde la <Link href="/contacto" style={{ color: 'var(--color-primary)' }}>página de contacto</Link>.
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  padding: '2rem',
  background: 'white',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-soft)',
  marginBottom: '2rem',
}

const h2Style: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '1.75rem',
  fontWeight: 500,
  color: 'var(--color-fg)',
  margin: 0,
  marginBottom: '1rem',
  lineHeight: 1.15,
}

const pStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  lineHeight: 1.6,
  color: 'var(--color-fg)',
  opacity: 0.8,
  margin: 0,
  marginBottom: '1rem',
}

const olStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  lineHeight: 1.7,
  color: 'var(--color-fg)',
  opacity: 0.85,
  paddingLeft: '1.25rem',
  margin: 0,
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 0.875rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--color-primary)',
  borderBottom: '2px solid rgba(192, 68, 90, 0.18)',
}

const tdStyle: React.CSSProperties = {
  padding: '0.625rem 0.875rem',
  borderBottom: '1px solid rgba(192, 68, 90, 0.08)',
}

const tdStyleBold: React.CSSProperties = {
  ...tdStyle,
  fontWeight: 600,
  color: 'var(--color-primary)',
}
