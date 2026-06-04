export const metadata = {
  title: 'Contacto — Rouge Intime',
  description: 'WhatsApp e Instagram para consultas sobre nuestra lencería artesanal.',
}

export default function ContactoPage() {
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
        Hablemos
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
        Contacto
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
        Para asesoramiento de talles, consultas sobre tu pedido o pedidos especiales,
        escribinos por WhatsApp o Instagram.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <Card
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          }
          title="WhatsApp"
          subtitle="Respondemos en horario comercial"
          value="+54 9 11 5886-1214"
          href="https://wa.me/+541158861214?text=Hola%20Rouge%20Intime!"
        />
        <Card
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="18" cy="6" r="1" fill="currentColor" />
            </svg>
          }
          title="Instagram"
          subtitle="Novedades y looks"
          value="@rougeintime"
          href="https://www.instagram.com/rougeintime"
        />
      </div>

      <section
        style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 500,
            margin: 0,
            marginBottom: '0.75rem',
            color: 'var(--color-fg)',
          }}
        >
          Estamos en Morón, Buenos Aires
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            color: 'var(--color-fg)',
            opacity: 0.8,
            margin: 0,
          }}
        >
          Retiro gratuito en taller con cita previa. Envíos a todo el país por Andreani, Correo
          Argentino o moto delivery en el AMBA.
        </p>
      </section>
    </div>
  )
}

function Card({
  icon,
  title,
  subtitle,
  value,
  href,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  value: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        padding: '1.75rem',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        textDecoration: 'none',
        boxShadow: 'var(--shadow-soft)',
        transition: 'transform var(--dur-mid) var(--ease-out), box-shadow var(--dur-mid) var(--ease-out)',
      }}
      className="rouge-contact-card"
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          borderRadius: '999px',
          background: 'rgba(192, 68, 90, 0.08)',
          color: 'var(--color-primary)',
          marginBottom: '1rem',
        }}
      >
        {icon}
      </span>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-fg)',
          opacity: 0.6,
          margin: 0,
          marginBottom: '0.25rem',
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.125rem',
          fontWeight: 500,
          color: 'var(--color-fg)',
          margin: 0,
          marginBottom: '0.25rem',
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: 'var(--color-fg)',
          opacity: 0.55,
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    </a>
  )
}
