'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined)

  return (
    <form action={formAction} style={{ width: '100%' }}>
      <Field label="Email" name="email" type="email" required autoComplete="username" />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />

      {state?.error && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-primary)',
            margin: 0,
            marginTop: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '0.875rem',
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
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
        {label}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '0.75rem 0.875rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          background: 'white',
          border: '1px solid rgba(192, 68, 90, 0.18)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-fg)',
          outline: 'none',
        }}
      />
    </div>
  )
}
