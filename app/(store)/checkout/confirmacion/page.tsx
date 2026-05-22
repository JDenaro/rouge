import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { formatARS } from '@/lib/mock-data'
import type { Order, OrderItem } from '@/lib/supabase/types'

export const metadata = { title: 'Pedido confirmado — Rouge Intime' }
export const dynamic = 'force-dynamic'

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ o?: string }>
}) {
  const sp = await searchParams
  const orderId = sp.o
  if (!orderId) notFound()

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle()

  if (error || !data) notFound()
  const order = data as unknown as Order

  const whatsappMsg = encodeURIComponent(
    `Hola Rouge Intime! Acabo de confirmar el pedido #${order.id.slice(0, 8)} por ${formatARS(order.total)}.`,
  )

  return (
    <div style={{ padding: '7rem 1.5rem 5rem', maxWidth: '720px', margin: '0 auto' }}>
      <div
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            borderRadius: '999px',
            background: 'rgba(192, 68, 90, 0.1)',
            color: 'var(--color-primary)',
            marginBottom: '1.5rem',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 500,
            color: 'var(--color-fg)',
            margin: 0,
            marginBottom: '0.5rem',
            lineHeight: 1.1,
          }}
        >
          ¡Pedido recibido!
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--color-fg)',
            opacity: 0.7,
            margin: 0,
            marginBottom: '0.25rem',
          }}
        >
          Te contactaremos por WhatsApp para coordinar el pago y el envío.
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
          Número de pedido: <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
        </p>
      </div>

      <section
        style={{
          padding: '1.75rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '1.5rem',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 500,
            margin: 0,
            marginBottom: '1rem',
            color: 'var(--color-fg)',
          }}
        >
          Tu pedido
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {order.items.map((item: OrderItem, idx: number) => (
            <li
              key={idx}
              style={{
                display: 'flex',
                gap: '0.875rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(192, 68, 90, 0.08)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '72px',
                  borderRadius: 'var(--radius-md)',
                  backgroundImage: item.image ? `url('${item.image}')` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  background: item.image ? undefined : 'rgba(192, 68, 90, 0.08)',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', margin: 0, marginBottom: '0.125rem' }}>
                  {item.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', margin: 0, opacity: 0.6 }}>
                  {[item.size, item.color].filter(Boolean).join(' · ')}
                  {item.quantity > 1 && ` · x${item.quantity}`}
                </p>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, alignSelf: 'flex-end' }}>
                {formatARS(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.875rem', opacity: 0.7, marginTop: '1rem', marginBottom: '0.375rem' }}>
          <span>Subtotal</span>
          <span>{formatARS(order.subtotal)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(192, 68, 90, 0.12)',
          }}
        >
          <span>Total con transfer (-12%)</span>
          <span>{formatARS(order.total)}</span>
        </div>
      </section>

      <a
        href={`https://wa.me/+541158861214?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
      >
        Escribirnos por WhatsApp
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link
          href="/productos"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-fg)',
            opacity: 0.65,
            textDecoration: 'none',
          }}
        >
          ← Seguir comprando
        </Link>
      </div>
    </div>
  )
}
