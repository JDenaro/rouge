import Link from 'next/link'
import { AdminShell } from '@/components/admin/AdminShell'
import { getDashboardStats } from '@/lib/admin-data'
import { formatARS } from '@/lib/mock-data'

export const metadata = { title: 'Admin · Dashboard' }
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <AdminShell>
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.25rem',
          margin: 0,
          marginBottom: '0.25rem',
          color: 'var(--color-fg)',
          fontWeight: 500,
        }}
      >
        Dashboard
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          color: 'var(--color-fg)',
          opacity: 0.6,
          margin: 0,
          marginBottom: '2.5rem',
        }}
      >
        Resumen de la operación.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <Stat label="Productos totales" value={stats.totalProducts.toString()} />
        <Stat label="Productos activos" value={stats.activeProducts.toString()} />
        <Stat label="Órdenes totales" value={stats.totalOrders.toString()} />
        <Stat label="Órdenes pendientes" value={stats.pendingOrders.toString()} accent />
      </div>

      <section
        style={{
          background: 'white',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.375rem',
              margin: 0,
              fontWeight: 500,
              color: 'var(--color-fg)',
            }}
          >
            Últimas órdenes
          </h2>
          <Link
            href="/admin/ordenes"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-primary)',
              textDecoration: 'none',
            }}
          >
            Ver todas →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', opacity: 0.6, margin: 0 }}>
            Todavía no hay órdenes.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {stats.recentOrders.map((o) => (
              <li
                key={o.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto auto',
                  gap: '1rem',
                  padding: '0.875rem 0',
                  borderBottom: '1px solid rgba(192, 68, 90, 0.08)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ color: 'var(--color-fg)' }}>{o.customer_name}</strong>
                  <span style={{ opacity: 0.5, marginLeft: '0.5rem' }}>#{o.id.slice(0, 8)}</span>
                </div>
                <StatusPill status={o.status} />
                <span style={{ opacity: 0.6 }}>
                  {new Date(o.created_at).toLocaleDateString('es-AR')}
                </span>
                <strong style={{ color: 'var(--color-primary)' }}>{formatARS(o.total)}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  )
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      style={{
        padding: '1.25rem',
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-soft)',
        borderTop: accent ? '3px solid var(--color-primary)' : undefined,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-fg)',
          opacity: 0.55,
          margin: 0,
          marginBottom: '0.25rem',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          color: accent ? 'var(--color-primary)' : 'var(--color-fg)',
          margin: 0,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  )
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    pending: { bg: 'rgba(217, 119, 6, 0.12)', fg: '#92400e', label: 'Pendiente' },
    paid: { bg: 'rgba(34, 197, 94, 0.12)', fg: '#15803d', label: 'Pagada' },
    processing: { bg: 'rgba(59, 130, 246, 0.12)', fg: '#1d4ed8', label: 'En producción' },
    shipped: { bg: 'rgba(192, 68, 90, 0.12)', fg: 'var(--color-primary)', label: 'Enviada' },
    delivered: { bg: 'rgba(75, 85, 99, 0.12)', fg: '#374151', label: 'Entregada' },
    cancelled: { bg: 'rgba(220, 38, 38, 0.1)', fg: '#b91c1c', label: 'Cancelada' },
  }
  const s = map[status] ?? { bg: 'rgba(0,0,0,0.06)', fg: '#374151', label: status }
  return (
    <span
      style={{
        padding: '0.25rem 0.625rem',
        borderRadius: '999px',
        background: s.bg,
        color: s.fg,
        fontFamily: 'var(--font-body)',
        fontSize: '0.6875rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {s.label}
    </span>
  )
}
