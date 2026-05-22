import { AdminShell } from '@/components/admin/AdminShell'
import { listOrders } from '@/lib/admin-data'
import { OrderRow } from './OrderRow'

export const metadata = { title: 'Admin · Órdenes' }
export const dynamic = 'force-dynamic'

export default async function AdminOrdenes() {
  const orders = await listOrders()

  return (
    <AdminShell>
      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.25rem',
            margin: 0,
            marginBottom: '0.25rem',
            fontWeight: 500,
          }}
        >
          Órdenes
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', opacity: 0.6, margin: 0 }}>
          {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'} en total.
        </p>
      </header>

      <section
        style={{
          background: 'white',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-soft)',
          overflowX: 'auto',
        }}
      >
        {orders.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', padding: '2rem 0', textAlign: 'center', opacity: 0.6 }}>
            Aún no hay órdenes registradas.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>#</th>
                <th style={th}>Cliente</th>
                <th style={th}>Fecha</th>
                <th style={th}>Estado</th>
                <th style={{ ...th, textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <OrderRow key={o.id} order={o} />
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AdminShell>
  )
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 0.5rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--color-primary)',
  borderBottom: '2px solid rgba(192, 68, 90, 0.18)',
}
