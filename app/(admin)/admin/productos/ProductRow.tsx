'use client'

import { useState, useTransition } from 'react'
import type { Product } from '@/lib/supabase/types'
import { toggleProductActive, updateProductPrice } from './actions'
import { formatARS } from '@/lib/mock-data'

export function ProductRow({ product }: { product: Product }) {
  const [active, setActive] = useState(product.active)
  const [price, setPrice] = useState(product.price)
  const [editingPrice, setEditingPrice] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleToggle = () => {
    const next = !active
    setActive(next)
    startTransition(async () => {
      const res = await toggleProductActive(product.id, next)
      if (!res.ok) {
        setActive(!next)
        setError(res.error)
      } else {
        setError(null)
      }
    })
  }

  const handlePriceSave = () => {
    startTransition(async () => {
      const res = await updateProductPrice(product.id, price)
      if (!res.ok) {
        setError(res.error)
      } else {
        setError(null)
        setEditingPrice(false)
      }
    })
  }

  const image = product.images?.[0] ?? ''

  return (
    <tr style={{ borderBottom: '1px solid rgba(192, 68, 90, 0.08)' }}>
      <td style={td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '44px',
              height: '54px',
              borderRadius: 'var(--radius-md)',
              backgroundImage: image ? `url('${image}')` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              background: image ? undefined : 'rgba(192, 68, 90, 0.08)',
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', margin: 0, fontWeight: 500, color: 'var(--color-fg)' }}>
              {product.name}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', margin: 0, opacity: 0.55 }}>
              {product.slug}
            </p>
          </div>
        </div>
      </td>
      <td style={td}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            padding: '0.125rem 0.5rem',
            borderRadius: '999px',
            background: 'rgba(192, 68, 90, 0.08)',
            color: 'var(--color-primary)',
            fontWeight: 500,
          }}
        >
          {product.category}
        </span>
      </td>
      <td style={td}>
        {editingPrice ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <input
              type="number"
              value={price}
              min={0}
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{
                width: '110px',
                padding: '0.375rem 0.5rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                border: '1px solid rgba(192, 68, 90, 0.2)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
            <button
              type="button"
              onClick={handlePriceSave}
              disabled={pending}
              style={iconBtn(true)}
              aria-label="Guardar"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => {
                setPrice(product.price)
                setEditingPrice(false)
              }}
              style={iconBtn(false)}
              aria-label="Cancelar"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingPrice(true)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.125rem 0.25rem',
            }}
          >
            {formatARS(price)}
          </button>
        )}
        {error && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-primary)', margin: 0, marginTop: '0.25rem' }}>
            {error}
          </p>
        )}
      </td>
      <td style={td}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={active}
            onChange={handleToggle}
            disabled={pending}
            style={{ accentColor: '#C0445A', width: '16px', height: '16px' }}
          />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: active ? 'var(--color-primary)' : 'var(--color-fg)', opacity: active ? 1 : 0.55 }}>
            {active ? 'Activo' : 'Oculto'}
          </span>
        </label>
      </td>
    </tr>
  )
}

const td: React.CSSProperties = {
  padding: '0.75rem 0.5rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  verticalAlign: 'middle',
}

function iconBtn(primary: boolean): React.CSSProperties {
  return {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--radius-sm)',
    background: primary ? 'var(--color-primary)' : 'transparent',
    border: primary ? 'none' : '1px solid rgba(192, 68, 90, 0.18)',
    color: primary ? 'white' : 'var(--color-fg)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    fontWeight: 600,
  }
}
