'use client'

import { useState, useTransition } from 'react'
import type { Order, OrderStatus } from '@/lib/supabase/types'
import { updateOrderStatus } from './actions'
import { formatARS } from '@/lib/mock-data'

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagada' },
  { value: 'processing', label: 'En producción' },
  { value: 'shipped', label: 'Enviada' },
  { value: 'delivered', label: 'Entregada' },
  { value: 'cancelled', label: 'Cancelada' },
]

export function OrderRow({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status)
  const [expanded, setExpanded] = useState(false)
  const [pending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as OrderStatus
    setStatus(next)
    startTransition(async () => {
      const res = await updateOrderStatus(order.id, next)
      if (!res.ok) {
        setStatus(order.status)
        alert(res.error)
      }
    })
  }

  return (
    <>
      <tr style={{ borderBottom: '1px solid rgba(192, 68, 90, 0.08)' }}>
        <td style={td}>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: 'var(--color-fg)',
              textAlign: 'left',
              padding: 0,
            }}
          >
            <strong style={{ color: 'var(--color-primary)' }}>#{order.id.slice(0, 8).toUpperCase()}</strong>
            <span style={{ marginLeft: '0.5rem', opacity: 0.55, fontSize: '0.75rem' }}>
              {expanded ? '▴' : '▾'}
            </span>
          </button>
        </td>
        <td style={td}>
          <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
            {order.customer_name}
          </p>
          <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '0.75rem', opacity: 0.6 }}>
            {order.customer_email}
          </p>
        </td>
        <td style={td}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', opacity: 0.75 }}>
            {new Date(order.created_at).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        </td>
        <td style={td}>
          <select
            value={status}
            onChange={handleChange}
            disabled={pending}
            style={{
              padding: '0.375rem 0.5rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              background: 'white',
              border: '1px solid rgba(192, 68, 90, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-fg)',
              cursor: 'pointer',
            }}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </td>
        <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: 'var(--color-primary)' }}>
          {formatARS(order.total)}
        </td>
      </tr>
      {expanded && (
        <tr style={{ borderBottom: '1px solid rgba(192, 68, 90, 0.08)' }}>
          <td colSpan={5} style={{ padding: '0.75rem 0.5rem 1.25rem', background: 'rgba(192, 68, 90, 0.025)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
              <div>
                <p style={detailH}>Productos</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {order.items.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.375rem 0',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <span>
                        {item.name}{' '}
                        <span style={{ opacity: 0.6 }}>
                          ({[item.size, item.color].filter(Boolean).join(' · ') || 'sin variante'} · x{item.quantity})
                        </span>
                      </span>
                      <span style={{ opacity: 0.75 }}>{formatARS(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={detailH}>Contacto</p>
                <p style={detailP}>
                  <strong>{order.customer_name}</strong>
                </p>
                <p style={detailP}>{order.customer_email}</p>
                <p style={detailP}>{order.customer_phone}</p>
                {order.notes && (
                  <>
                    <p style={{ ...detailH, marginTop: '0.75rem' }}>Notas</p>
                    <p style={{ ...detailP, whiteSpace: 'pre-wrap' }}>{order.notes}</p>
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

const td: React.CSSProperties = {
  padding: '0.75rem 0.5rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  verticalAlign: 'middle',
}

const detailH: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--color-primary)',
  margin: 0,
  marginBottom: '0.375rem',
}

const detailP: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.8125rem',
  margin: 0,
  marginBottom: '0.125rem',
  color: 'var(--color-fg)',
}
