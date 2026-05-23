import { Hero } from '@/components/store/Hero'
import { CategoriesGrid } from '@/components/store/CategoriesGrid'
import { FeaturedProducts } from '@/components/store/FeaturedProducts'
import { Testimonials } from '@/components/store/Testimonials'
import { HowItWorks } from '@/components/store/HowItWorks'
import { FAQ } from '@/components/store/FAQ'
import { getFeaturedFAQ } from '@/lib/faq'

const TRUST_BADGES = [
  'Envíos a todo el país',
  '12% OFF por transferencia',
  'Hasta 3 cuotas sin interés',
]

export default function HomePage() {
  return (
    <>
      <Hero />

      <div
        className="rouge-trust-strip"
        style={{
          background: 'var(--color-bg)',
          borderTop: '1px solid rgba(192, 68, 90, 0.12)',
          borderBottom: '1px solid rgba(192, 68, 90, 0.12)',
        }}
      >
        {TRUST_BADGES.map((label) => (
          <span key={label} className="rouge-trust-badge">
            {label}
          </span>
        ))}
      </div>

      <CategoriesGrid />
      <FeaturedProducts />
      <Testimonials />
      <HowItWorks />
      <section style={{ padding: '4rem 1.5rem 0', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-primary)',
          marginBottom: '0.75rem',
        }}>
          ¿Tenés dudas?
        </p>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 500,
          color: 'var(--color-fg)',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Preguntas frecuentes
        </h2>
      </section>
      <FAQ items={getFeaturedFAQ()} showCta />
    </>
  )
}
