'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/components/store/CartContext'

const NAV_LINKS = [
  { href: '/sets', label: 'Sets' },
  { href: '/baby-doll', label: 'Baby Doll' },
  { href: '/body', label: 'Body' },
  { href: '/corsets', label: 'Corsets' },
  { href: '/disfraces', label: 'Disfraces' },
  { href: '/sexshop', label: 'Sexshop' },
]

const MORE_LINKS = [
  { href: '/bata', label: 'Bata' },
  { href: '/conjuntos', label: 'Conjuntos' },
  { href: '/catsuit', label: 'Catsuit' },
  { href: '/pijamas', label: 'Pijamas' },
  { href: '/perfume-feromonas', label: 'Perfumes' },
  { href: '/panty-vedetina-culotte', label: 'Panties' },
  { href: '/productos', label: 'Ver todo' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { openCart, count } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(253, 248, 248, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: scrolled ? '0 1px 0 rgba(192, 68, 90, 0.08)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setDrawerOpen(true)}
            className="rouge-hamburger"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '999px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-fg)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              fontWeight: 500,
              color: 'var(--color-primary)',
              letterSpacing: '0.01em',
              textDecoration: 'none',
            }}
          >
            Rouge Intime
          </Link>

          <nav
            aria-label="Categorías principales"
            className="rouge-nav-desktop"
            style={{
              display: 'flex',
              gap: '1.75rem',
              alignItems: 'center',
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rouge-nav-link"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-fg)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              aria-label={`Carrito (${count} productos)`}
              onClick={openCart}
              className="rouge-cart-btn"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '999px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-fg)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              {count > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    borderRadius: '999px',
                    background: 'var(--color-primary)',
                    color: 'white',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            background: 'rgba(26, 10, 13, 0.55)',
          }}
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 'min(320px, 88%)',
              background: 'var(--color-bg)',
              padding: '1.5rem 1.25rem',
              overflowY: 'auto',
              boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
              animation: 'rouge-slide-in 280ms var(--ease-out)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                }}
              >
                Rouge Intime
              </span>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setDrawerOpen(false)}
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
            </div>

            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
                  <li key={link.href} style={{ borderBottom: '1px solid rgba(192, 68, 90, 0.1)' }}>
                    <Link
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      style={{
                        display: 'block',
                        padding: '1rem 0',
                        fontFamily: 'var(--font-body)',
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: 'var(--color-fg)',
                        textDecoration: 'none',
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(192, 68, 90, 0.15)' }}>
              {[
                { href: '/guia-de-talles', label: 'Guía de talles' },
                { href: '/politica-de-cambios', label: 'Política de cambios' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.5rem 0',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--color-fg)',
                    opacity: 0.7,
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}

      <style jsx global>{`
        @keyframes rouge-slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .rouge-nav-link {
          position: relative;
        }
        .rouge-nav-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100%;
          height: 1.5px;
          background: var(--color-primary);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .rouge-nav-link:hover {
          color: var(--color-primary) !important;
          transition: color 180ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .rouge-nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        .rouge-cart-btn {
          transition: color 180ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .rouge-cart-btn:hover {
          color: var(--color-primary) !important;
          transform: scale(1.15);
        }
        @media (max-width: 768px) {
          .rouge-nav-desktop {
            display: none !important;
          }
          .rouge-hamburger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </>
  )
}
