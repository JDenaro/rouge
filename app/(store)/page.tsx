import { Hero } from '@/components/store/Hero'
import { CategoriesGrid } from '@/components/store/CategoriesGrid'
import { FeaturedProducts } from '@/components/store/FeaturedProducts'
import { Testimonials } from '@/components/store/Testimonials'
import { HowItWorks } from '@/components/store/HowItWorks'

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
    </>
  )
}
