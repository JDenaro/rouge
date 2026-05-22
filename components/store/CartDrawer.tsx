'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from '@/components/store/CartContext'
import { formatARS } from '@/lib/mock-data'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, total } = useCart()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    if (isOpen) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carrito"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(26, 10, 13, 0.55)',
      }}
      onClick={closeCart}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 92%)',
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.18)',
          animation: 'rouge-cart-slide 280ms var(--ease-out)',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(192, 68, 90, 0.12)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              margin: 0,
              fontWeight: 500,
              color: 'var(--color-fg)',
            }}
          >
            Tu carrito
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={closeCart}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '999px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-fg)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                color: 'var(--color-fg)',
                marginBottom: '0.5rem',
              }}
            >
              Tu carrito está vacío
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'var(--color-fg)',
                opacity: 0.6,
                marginBottom: '2rem',
              }}
            >
              Encontrá tu próxima pieza favorita
            </p>
            <Link href="/productos" className="btn-primary" onClick={closeCart}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul
              style={{
                flex: 1,
                listStyle: 'none',
                padding: '1rem 1.5rem',
                margin: 0,
                overflowY: 'auto',
              }}
            >
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}-${item.color}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '72px 1fr auto',
                    gap: '0.875rem',
                    padding: '0.875rem 0',
                    borderBottom: '1px solid rgba(192, 68, 90, 0.1)',
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '90px',
                      borderRadius: 'var(--radius-md)',
                      backgroundImage: `url('${item.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      background: item.image ? undefined : 'rgba(192, 68, 90, 0.08)',
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1rem',
                        fontWeight: 500,
                        margin: 0,
                        marginBottom: '0.25rem',
                        color: 'var(--color-fg)',
                      }}
                    >
                      {item.name}
                    </p>
                    {(item.size || item.color) && (
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.75rem',
                          margin: 0,
                          opacity: 0.6,
                          color: 'var(--color-fg)',
                        }}
                      >
                        {[item.size, item.color].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      <button
                        type="button"
                        aria-label="Disminuir"
                        onClick={() => updateQty(item.productId, item.size, item.color, item.quantity - 1)}
                        style={qtyBtn}
                      >
                        −
                      </button>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar"
                        onClick={() => updateQty(item.productId, item.size, item.color, item.quantity + 1)}
                        style={qtyBtn}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      aria-label="Quitar"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-fg)',
                        opacity: 0.5,
                        padding: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                      </svg>
                    </button>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--color-fg)',
                      }}
                    >
                      {formatARS(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <footer
              style={{
                padding: '1.25rem 1.5rem',
                borderTop: '1px solid rgba(192, 68, 90, 0.12)',
                background: 'white',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  opacity: 0.7,
                  marginBottom: '0.375rem',
                }}
              >
                <span>Subtotal</span>
                <span>{formatARS(subtotal)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  color: 'var(--color-primary)',
                }}
              >
                <span>Con transferencia (-12%)</span>
                <span>{formatARS(total)}</span>
              </div>
              <Link href="/checkout" className="btn-primary" onClick={closeCart} style={{ width: '100%', justifyContent: 'center' }}>
                Finalizar compra
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </footer>
          </>
        )}
      </aside>

      <style>{`
        @keyframes rouge-cart-slide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

const qtyBtn: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '4px',
  background: 'rgba(192, 68, 90, 0.08)',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
