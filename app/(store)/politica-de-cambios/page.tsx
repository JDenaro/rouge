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

      <Section title="Productos confeccionados a pedido">
        <p style={pStyle}>
          Todos los artículos se elaboran <strong>personalizadamente</strong> tras confirmar y
          abonar la compra. No existe stock previo. Las imágenes en web y redes son
          referenciales; pueden existir leves variaciones en tonalidades, texturas o
          terminaciones sin que ello constituya un defecto.
        </p>
        <p style={pStyle}>
          <strong>Tiempo de producción:</strong> aproximadamente{' '}
          <strong>15 a 20 días hábiles</strong> desde la confirmación de pago (plazo
          orientativo, no garantizado).
        </p>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Si el paquete retorna por dirección incorrecta, ausencia reiterada u otras causas
          atribuibles al comprador, el reenvío corre por su cuenta.
        </p>
      </Section>

      <Section title="Devoluciones">
        <p style={pStyle}>
          No se aceptan devoluciones por arrepentimiento una vez iniciada la confección.
        </p>
        <ul style={ulStyle}>
          <li>
            <strong>Arrepentimiento previo al despacho:</strong> se devuelve el importe
            restando gastos de confección, materiales e insumos (aproximadamente el{' '}
            <strong>45% del valor del producto</strong>).
          </li>
          <li>
            <strong>Imposibilidad de confección:</strong> si por motivos propios no podemos
            confeccionar tu pieza, se ofrece alternativa o reintegro del 100%.
          </li>
        </ul>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          La devolución se procesa únicamente tras recibir el producto. El plazo para
          solicitar es de <strong>3 días hábiles</strong> desde la recepción.
        </p>
      </Section>

      <Section title="Cambios por defectos de fabricación">
        <p style={pStyle}>Aplican únicamente para defectos de fabricación comprobables.</p>
        <p style={{ ...pStyle, marginBottom: '0.75rem' }}>
          <strong>No constituyen motivo válido:</strong>
        </p>
        <ul style={ulStyle}>
          <li>Descosturas simples o desgaste por uso</li>
          <li>
            Diferencias de talle (es responsabilidad del comprador consultar la guía de
            talles antes de comprar)
          </li>
          <li>Cambio de opinión sobre la pieza</li>
        </ul>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          El nuevo pedido requiere un ciclo de producción completo de{' '}
          <strong>15 a 20 días hábiles</strong> desde la recepción de la prenda original.
        </p>
      </Section>

      <Section title="Reclamos">
        <p style={pStyle}>
          Tenés <strong>3 días hábiles</strong> luego de recibir el paquete para iniciar un
          reclamo. Necesitamos:
        </p>
        <ul style={{ ...ulStyle, marginBottom: 0 }}>
          <li>Foto de la orden impresa con número y nombre (debajo de la etiqueta de envío)</li>
          <li>Video de apertura del paquete sin cortes ni edición</li>
        </ul>
      </Section>

      <Section title="Condiciones del producto a devolver o cambiar">
        <p style={pStyle}>La prenda debe estar:</p>
        <ul style={{ ...ulStyle, marginBottom: 0 }}>
          <li>Sin uso</li>
          <li>Sin alteraciones, roturas, manchas ni modificaciones</li>
          <li>Con envoltorio y etiquetas originales intactos</li>
        </ul>
      </Section>

      <Section title="Logística y costos de envío">
        <p style={pStyle}>
          Los gastos de envío de devolución corren por cuenta del comprador.
        </p>
        <p style={pStyle}>Alternativas sin costo adicional:</p>
        <ul style={ulStyle}>
          <li>Retiro o entrega en taller en Morón, Buenos Aires (con cita previa)</li>
          <li>Punto de encuentro coordinado</li>
        </ul>
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Si solicitás envío de reposición a domicilio, ese costo corre por tu cuenta.
        </p>
      </Section>

      <Section title="Responsabilidad del comprador">
        <p style={{ ...pStyle, marginBottom: 0 }}>
          El comprador es responsable de verificar la exactitud de sus datos (nombre,
          dirección, teléfono, mail). Rouge Intime no se responsabiliza por errores en la
          información provista.
        </p>
      </Section>

      <Section title="Marco legal">
        <p style={{ ...pStyle, marginBottom: 0 }}>
          Esta política está enmarcada en la normativa argentina:{' '}
          <strong>Ley 24.240 de Defensa del Consumidor</strong> y el{' '}
          <strong>Código Civil y Comercial de la Nación</strong>. Al confirmar la compra,
          el cliente adhiere a las cláusulas generales de esta política.
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
        <a
          href="https://wa.me/+541158861214"
          style={{ color: 'var(--color-primary)' }}
          target="_blank"
          rel="noopener noreferrer"
        >
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
