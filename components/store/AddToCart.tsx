'use client'

import { useState } from 'react'
import { useCart } from '@/components/store/CartContext'

type Props = {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  sizes: string[]
  colors: string[]
}

export function AddToCart({ productId, slug, name, price, image, sizes, colors }: Props) {
  const { addItem } = useCart()
  const [size, setSize] = useState<string>(sizes[0] ?? '')
  const [color, setColor] = useState<string>(colors[0] ?? '')
  const [qty, setQty] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (sizes.length > 0 && !size) {
      setError('Elegí un talle')
      return
    }
    if (colors.length > 0 && !color) {
      setError('Elegí un color')
      return
    }
    setError(null)
    addItem({ productId, slug, name, price, image, size, color }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div>
      {sizes.length > 0 && (
        <Section title="Talle">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                style={pillStyle(s === size)}
              >
                {s}
              </button>
            ))}
          </div>
        </Section>
      )}

      {colors.length > 0 && (
        <Section title="Color">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={pillStyle(c === color)}
              >
                {c}
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section title="Cantidad">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            aria-label="Disminuir"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            style={qtyBtnStyle}
          >
            −
          </button>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              minWidth: '32px',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {qty}
          </span>
          <button
            type="button"
            aria-label="Aumentar"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            style={qtyBtnStyle}
          >
            +
          </button>
        </div>
      </Section>

      {error && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-primary)',
            marginTop: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '1rem 1.5rem',
          fontSize: '0.9375rem',
        }}
      >
        {added ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Agregado al carrito
          </>
        ) : (
          <>
            Agregar al carrito
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h3
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-fg)',
          opacity: 0.6,
          margin: 0,
          marginBottom: '0.625rem',
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: '0.5rem 0.875rem',
    border: active ? '1px solid var(--color-primary)' : '1px solid rgba(192, 68, 90, 0.18)',
    background: active ? 'rgba(192, 68, 90, 0.08)' : 'white',
    color: active ? 'var(--color-primary)' : 'var(--color-fg)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--dur-fast) var(--ease-out)',
  }
}

const qtyBtnStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-md)',
  background: 'rgba(192, 68, 90, 0.08)',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
}
