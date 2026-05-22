import Link from 'next/link'
import { logoutAction } from '@/app/(admin)/admin/login/actions'

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rouge-admin-shell" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside
        style={{
          background: 'var(--color-fg)',
          color: 'rgba(253, 248, 248, 0.85)',
          padding: '1.75rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Link
          href="/admin"
          style={{
            display: 'block',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            color: 'var(--color-primary)',
            textDecoration: 'none',
            marginBottom: '0.25rem',
          }}
        >
          Rouge Intime
        </Link>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            opacity: 0.55,
            margin: 0,
            marginBottom: '2.5rem',
          }}
        >
          Admin
        </p>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <NavLink href="/admin" label="Dashboard" />
          <NavLink href="/admin/productos" label="Productos" />
          <NavLink href="/admin/ordenes" label="Órdenes" />
        </nav>

        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              background: 'transparent',
              border: '1px solid rgba(253, 248, 248, 0.18)',
              borderRadius: 'var(--radius-md)',
              color: 'rgba(253, 248, 248, 0.85)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            Cerrar sesión
          </button>
        </form>

        <Link
          href="/"
          style={{
            display: 'block',
            marginTop: '0.75rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'rgba(253, 248, 248, 0.55)',
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          ← Ver tienda pública
        </Link>
      </aside>

      <main style={{ padding: '2.5rem 2.5rem 4rem', background: '#FBF6F6' }}>{children}</main>

      <style>{`
        @media (max-width: 720px) {
          .rouge-admin-shell {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        padding: '0.625rem 0.875rem',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9375rem',
        color: 'rgba(253, 248, 248, 0.85)',
        textDecoration: 'none',
        borderRadius: 'var(--radius-md)',
      }}
    >
      {label}
    </Link>
  )
}
