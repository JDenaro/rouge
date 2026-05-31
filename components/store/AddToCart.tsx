'use client'

import { useState } from 'react'
import { useCart } from '@/components/store/CartContext'
import { CATEGORY_SIZES } from '@/lib/products'
import type { ProductCategory } from '@/lib/supabase/types'

const CORPINO_SIZES = [85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150].map(String)
const PANTALON_SIZES = [36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56].map(String)

type Medidas = {
  bajoBusto: string
  busto: string
  cadera: string
  cintura: string
  largo: string
}

type Props = {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  category: ProductCategory
  colors: string[]
}

export function AddToCart({ productId, slug, name, price, image, category, colors }: Props) {
  const { addItem } = useCart()
  const cfg = CATEGORY_SIZES[category]

  const [corpino, setCorpino] = useState<string>(CORPINO_SIZES[0])
  const [pantalon, setPantalon] = useState<string>(PANTALON_SIZES[0])
  const [aMedida, setAMedida] = useState(false)
  const [medidas, setMedidas] = useState<Medidas>({
    bajoBusto: '', busto: '', cadera: '', cintura: '', largo: '',
  })
  const [color, setColor] = useState<string>(colors[0] ?? '')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  function buildSizeString(): string {
    if (aMedida) {
      return `A medida — BB: ${medidas.bajoBusto}cm / B: ${medidas.busto}cm / C: ${medidas.cadera}cm / Ci: ${medidas.cintura}cm / L: ${medidas.largo}cm`
    }
    if (cfg.corpino && cfg.pantalon) return `Corpiño: ${corpino} / Pantalón: ${pantalon}`
    if (cfg.pantalon) return `Pantalón: ${pantalon}`
    if (cfg.corpino) return `Corpiño: ${corpino}`
    return ''
  }

  const handleAdd = () => {
    if (colors.length > 0 && !color) {
      setError('Elegí un color')
      return
    }
    if (aMedida && Object.values(medidas).some((v) => !v.trim())) {
      setError('Completá todas las medidas')
      return
    }
    setError(null)
    addItem({ productId, slug, name, price, image, size: buildSizeString(), color }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const resetAMedida = () => {
    setAMedida(false)
    setMedidas({ bajoBusto: '', busto: '', cadera: '', cintura: '', largo: '' })
  }

  const showSizes = cfg.corpino || cfg.pantalon

  return (
    <div>
      {showSizes && !aMedida && (
        <>
          {cfg.corpino && (
            <Section title="Talle corpiño">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {CORPINO_SIZES.map((s) => (
                  <button key={s} type="button" onClick={() => setCorpino(s)} style={pillStyle(s === corpino)}>
                    {s}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {cfg.pantalon && (
            <Section title="Talle pantalón">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {PANTALON_SIZES.map((s) => (
                  <button key={s} type="button" onClick={() => setPantalon(s)} style={pillStyle(s === pantalon)}>
                    {s}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {cfg.aMedida && (
            <div style={{ marginBottom: '0.5rem' }}>
              <button type="button" onClick={() => setAMedida(true)} style={pillStyle(false)}>
                A medida
              </button>
            </div>
          )}

          {cfg.aMedida && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-fg)',
              opacity: 0.6,
              margin: 0,
              marginTop: '-0.5rem',
              marginBottom: '1.25rem',
            }}>
              Si necesitás un talle distinto, seleccioná la opción A medida.
            </p>
          )}
        </>
      )}

      {aMedida && (
        <Section title="Medidas personalizadas">
          {(
            [
              { key: 'bajoBusto', label: 'Bajo busto' },
              { key: 'busto', label: 'Busto' },
              { key: 'cadera', label: 'Cadera' },
              { key: 'cintura', label: 'Cintura' },
              { key: 'largo', label: 'Largo de bajo busto a pelvis' },
            ] as const
          ).map(({ key, label }) => (
            <MedidaInput
              key={key}
              label={label}
              value={medidas[key]}
              onChange={(v) => setMedidas((prev) => ({ ...prev, [key]: v }))}
            />
          ))}
          <button
            type="button"
            onClick={resetAMedida}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '1rem',
            }}
          >
            ← Volver a talles estándar
          </button>
        </Section>
      )}

      {colors.length > 0 && (
        <Section title="Color">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {colors.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)} style={pillStyle(c === color)}>
                {c}
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section title="Cantidad">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="button" aria-label="Disminuir" onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtnStyle}>
            −
          </button>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', minWidth: '32px', textAlign: 'center', fontWeight: 500 }}>
            {qty}
          </span>
          <button type="button" aria-label="Aumentar" onClick={() => setQty((q) => Math.min(10, q + 1))} style={qtyBtnStyle}>
            +
          </button>
        </div>
      </Section>

      {error && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-primary)', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '1rem 1.5rem', fontSize: '0.9375rem' }}
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

function MedidaInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--color-fg)',
        opacity: 0.7,
        marginBottom: '0.25rem',
      }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ej: 85"
        style={{
          width: '100%',
          padding: '0.625rem 0.875rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          background: 'white',
          border: '1px solid rgba(192, 68, 90, 0.18)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-fg)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h3 style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--color-fg)',
        opacity: 0.6,
        margin: 0,
        marginBottom: '0.625rem',
      }}>
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
