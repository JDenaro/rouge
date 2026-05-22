import { CheckoutForm } from '@/app/(store)/checkout/CheckoutForm'

export const metadata = { title: 'Checkout — Rouge Intime' }

export default function CheckoutPage() {
  return (
    <div style={{ padding: '7rem 1.5rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
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
          Paso final
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 500,
            color: 'var(--color-fg)',
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          Confirmá tu pedido
        </h1>
      </header>

      <CheckoutForm />

      <style>{`
        @media (max-width: 880px) {
          .rouge-checkout-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  )
}
