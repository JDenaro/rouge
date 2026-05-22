'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '/sets', label: 'Sets' },
  { href: '/baby-doll', label: 'Baby Doll' },
  { href: '/body', label: 'Body' },
  { href: '/corsets', label: 'Corsets' },
  { href: '/disfraces', label: 'Disfraces' },
  { href: '/sexshop', label: 'Sexshop' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background var(--dur-mid) var(--ease-out), backdrop-filter var(--dur-mid) var(--ease-out), box-shadow var(--dur-mid) var(--ease-out)',
        background: scrolled ? 'rgba(253, 248, 248, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
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
          gap: '2rem',
        }}
      >
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
          style={{
            display: 'flex',
            gap: '1.75rem',
            alignItems: 'center',
          }}
          className="rouge-nav-desktop"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-fg)',
                textDecoration: 'none',
                transition: 'color var(--dur-fast) var(--ease-out)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-fg)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href="https://wa.me/+541158861214?text=Hola%20Rouge%20Intime!"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '999px',
              color: 'var(--color-primary)',
              transition: 'background var(--dur-fast) var(--ease-out)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(192, 68, 90, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </a>

          <button
            type="button"
            aria-label="Carrito"
            style={{
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
              transition: 'background var(--dur-fast) var(--ease-out)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(192, 68, 90, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => setOpen(!open)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          :global(.rouge-nav-desktop) {
            display: none !important;
          }
        }
      `}</style>
    </header>
  )
}
