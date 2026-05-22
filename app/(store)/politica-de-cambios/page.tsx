import Link from 'next/link'

export const metadata = {
  title: 'Política de cambios — Rouge Intime',
  description: 'Términos sobre producción, devoluciones, cambios y reclamos.',
}

export default function PoliticaPage() {
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
        Términos
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
        Política de cambios
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
        Trabajamos con prendas hechas a medida y sin stock. Estos son nuestros términos
        para que ambas partes tengan tranquilidad.
      </p>

      <Section title="Producción">
        <p style={pStyle}>
          Todas las prendas son <strong>hechas a pedido</strong> luego de confirmar tu compra.
          Tiempo estimado de producción: <strong>15 a 20 días hábiles</strong> desde la
          confirmación de pago.
        </p>
      </Section>

      <Section title="Devoluciones">
        <p style={pStyle}>
          No se aceptan devoluciones por arrepentimiento una vez iniciada la producción.
        </p>
        <ul style={ulStyle}>
          <li>
            <strong>Antes de iniciar la producción:</strong> se aplica un cargo del 45% por
            materiales y mano de obra ya utilizados.
          </li>
          <li>
            <strong>Imposibilidad de producción:</strong> reembolso del 100% si por motivos
            propios no podemos confeccionar tu pieza.
          </li>
        </ul>
      </Section>

      <Section title="Cambios por defectos">
        <p style={pStyle}>Aplican únicamente para defectos de fabricación comprobables.</p>
        <p style={{ ...pStyle, marginBottom: '0.75rem' }}>
          <strong>No aplican:</strong>
        </p>
        <ul style={ulStyle}>
          <li>Costuras menores o desgaste por uso</li>
          <li>Discrepancias de talle (es responsabilidad consultar la guía antes de comprar)</li>
          <li>Cambio de opinión sobre la pieza</li>
        </ul>
        <p style={pStyle}>
          El nuevo pedido requiere un ciclo de producción completo (15–20 días) desde la
          recepción de la prenda original.
        </p>
      </Section>

      <Section title="Reclamos">
        <p style={pStyle}>
          Tenés <strong>3 días hábiles</strong> luego de recibir el paquete para iniciar un
          reclamo.
        </p>
        <p style={{ ...pStyle, marginBottom: '0.75rem' }}>Necesitamos:</p>
        <ul style={ulStyle}>
          <li>Foto de la etiqueta impresa del pedido (debajo de la etiqueta de envío)</li>
          <li>Video sin editar del momento de apertura del paquete</li>
        </ul>
        <p style={pStyle}>
          La prenda debe estar sin uso, sin alteraciones, con etiquetas y packaging original
          intactos.
        </p>
      </Section>

      <Section title="Envíos y devoluciones">
        <p style={pStyle}>
          Los gastos de envío de devolución corren por cuenta del comprador. Opcionalmente
          podés acercarla en persona al taller en Morón, Buenos Aires (con cita previa).
        </p>
      </Section>

      <div
        style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(192, 68, 90, 0.04)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '2px solid var(--color-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          marginTop: '2rem',
        }}
      >
        ¿Tenés dudas sobre tu compra? Escribinos por{' '}
        <a href="https://wa.me/+541158861214" style={{ color: 'var(--color-primary)' }} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>{' '}
        o desde la{' '}
        <Link href="/contacto" style={{ color: 'var(--color-primary)' }}>
          página de contacto
        </Link>
        .
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        padding: '1.75rem 2rem',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-soft)',
        marginBottom: '1.5rem',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          fontWeight: 500,
          color: 'var(--color-fg)',
          margin: 0,
          marginBottom: '1rem',
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

const pStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  lineHeight: 1.65,
  color: 'var(--color-fg)',
  opacity: 0.85,
  margin: 0,
  marginBottom: '0.875rem',
}

const ulStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  lineHeight: 1.7,
  color: 'var(--color-fg)',
  opacity: 0.85,
  paddingLeft: '1.25rem',
  margin: 0,
  marginBottom: '0.875rem',
}
