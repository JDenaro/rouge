import type { Metadata } from 'next'
import { FAQ } from '@/components/store/FAQ'
import { FAQ_ITEMS, buildFAQPageSchema } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes | Rouge Intime',
  description:
    'Plazos de producción, talles, envíos y pagos — todo lo que necesitás saber antes de pedir tu prenda a medida.',
}

export default function FAQPage() {
  const schema = buildFAQPageSchema(FAQ_ITEMS)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main>
        <header
          style={{
            padding: '8rem 1.5rem 3rem',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
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
            Ayuda
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 500,
              color: 'var(--color-fg)',
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            Preguntas frecuentes
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: 'var(--color-fg)',
              opacity: 0.75,
              marginTop: '1.25rem',
            }}
          >
            Plazos, talles, envíos y pagos. Si no encontrás tu pregunta, escribinos por WhatsApp.
          </p>
        </header>
        <FAQ items={FAQ_ITEMS} groupByCategory />
      </main>
    </>
  )
}
