'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useCart } from '@/components/store/CartContext'
import { createOrder } from '@/app/(store)/checkout/actions'
import { formatARS } from '@/lib/mock-data'

export function CheckoutForm() {
  const { items, subtotal, total, clear } = useCart()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  })

  const handleChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createOrder(items, form)
      if (!result.ok) {
        setError(result.error)
        return
      }
      clear()
    })
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            margin: 0,
            marginBottom: '0.5rem',
            color: 'var(--color-fg)',
          }}
        >
          No hay productos en tu carrito
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            opacity: 0.6,
            marginBottom: '2rem',
          }}
        >
          Volvé al catálogo para empezar tu pedido.
        </p>
        <Link href="/productos" className="btn-primary">
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rouge-checkout-layout" style={layoutStyle}>
      <div>
        <h2 style={sectionTitle}>Tus datos</h2>

        <Field
          label="Nombre completo"
          required
          name="customerName"
          value={form.customerName}
          onChange={handleChange('customerName')}
          placeholder="Cómo te llamás"
        />

        <Field
          label="Email"
          required
          name="customerEmail"
          type="email"
          value={form.customerEmail}
          onChange={handleChange('customerEmail')}
          placeholder="vos@email.com"
        />

        <Field
          label="WhatsApp"
          required
          name="customerPhone"
          type="tel"
          value={form.customerPhone}
          onChange={handleChange('customerPhone')}
          placeholder="+54 9 11 ..."
          help="Lo usamos para coordinar talle y envío."
        />

        <h2 style={{ ...sectionTitle, marginTop: '2.5rem' }}>Notas para tu pedido</h2>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange('notes')}
          placeholder="Talles, medidas exactas, color alternativo, dirección de envío, etc."
          rows={4}
          style={textareaStyle}
        />

        {error && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--color-primary)',
              marginTop: '1rem',
              marginBottom: 0,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-primary"
          style={{
            marginTop: '1.5rem',
            width: '100%',
            justifyContent: 'center',
            padding: '1rem',
            opacity: pending ? 0.6 : 1,
          }}
        >
          {pending ? 'Procesando…' : 'Confirmar pedido'}
        </button>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            opacity: 0.55,
            marginTop: '1rem',
            textAlign: 'center',
          }}
        >
          Al confirmar te contactaremos por WhatsApp para coordinar el pago (transferencia o MercadoPago) y los detalles del envío.
        </p>
      </div>

      <aside style={summaryStyle}>
        <h3 style={{ ...sectionTitle, marginTop: 0 }}>Tu pedido</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '1.25rem' }}>
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.size}-${item.color}`}
              style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(192, 68, 90, 0.1)',
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
                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    margin: 0,
                    marginBottom: '0.125rem',
                  }}
                >
                  {item.name}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    margin: 0,
                    opacity: 0.6,
                  }}
                >
                  {[item.size, item.color].filter(Boolean).join(' · ')}
                  {item.quantity > 1 && ` · x${item.quantity}`}
                </p>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  alignSelf: 'flex-end',
                }}
              >
                {formatARS(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.375rem' }}>
          <span>Subtotal</span>
          <span>{formatARS(subtotal)}</span>
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
          <span>Total con transfer</span>
          <span>{formatARS(total)}</span>
        </div>
      </aside>
    </form>
  )
}

function Field({
  label,
  help,
  ...props
}: { label: string; help?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-fg)',
          opacity: 0.7,
          marginBottom: '0.375rem',
        }}
      >
        {label} {props.required && <span style={{ color: 'var(--color-primary)' }}>*</span>}
      </label>
      <input {...props} style={inputStyle} />
      {help && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            opacity: 0.5,
            margin: 0,
            marginTop: '0.25rem',
          }}
        >
          {help}
        </p>
      )}
    </div>
  )
}

const layoutStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.3fr 1fr',
  gap: '3rem',
  alignItems: 'flex-start',
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '1.375rem',
  fontWeight: 500,
  color: 'var(--color-fg)',
  margin: 0,
  marginBottom: '1.25rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.875rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  background: 'white',
  border: '1px solid rgba(192, 68, 90, 0.18)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-fg)',
  outline: 'none',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'var(--font-body)',
}

const summaryStyle: React.CSSProperties = {
  position: 'sticky',
  top: '6rem',
  padding: '1.75rem',
  background: 'var(--color-bg)',
  border: '1px solid rgba(192, 68, 90, 0.12)',
  borderRadius: 'var(--radius-lg)',
}
