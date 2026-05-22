import Link from 'next/link'
import { LoginForm } from './LoginForm'

export const metadata = { title: 'Admin · Login' }

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '2.5rem 2rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'block',
            textAlign: 'center',
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
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-fg)',
            opacity: 0.55,
            textAlign: 'center',
            margin: 0,
            marginBottom: '2rem',
          }}
        >
          Panel de administración
        </p>

        <LoginForm />
      </div>
    </div>
  )
}
