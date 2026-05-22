import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

async function getHeroImage(): Promise<string> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('products')
    .select('images')
    .in('slug', ['black-ritual-e7n3w', 'brillante', 'dominia-7vjsb'])
    .eq('active', true)
    .limit(1)
  const row = (data as unknown as Array<{ images: string[] }> | null)?.[0]
  return row?.images?.[0] ?? ''
}

export async function Hero() {
  const heroImage = await getHeroImage()
  return (
    <section
      className="rouge-hero-section"
      style={{
        position: 'relative',
        minHeight: 'min(760px, 88vh)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: heroImage ? `url('${heroImage}')` : 'linear-gradient(135deg, #C0445A 0%, #EC4899 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          filter: 'brightness(0.75)',
        }}
      />

      {/* Gradient overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(26, 10, 13, 0.65) 0%, rgba(192, 68, 90, 0.35) 70%, rgba(26, 10, 13, 0.55) 100%)',
        }}
      />

      <div
        className="rouge-hero-content"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '8rem 1.5rem 6rem',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '1.25rem',
            }}
          >
            Lencería · Hecha a medida
          </p>

          <h1
            className="rouge-hero-title"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 6vw, 4.5rem)',
              fontWeight: 500,
              lineHeight: 1.05,
              color: 'white',
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            Hecho para vos,
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--color-bg)' }}>
              pensado para tu cuerpo.
            </em>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.92)',
              marginBottom: '2.25rem',
              maxWidth: '520px',
            }}
          >
            Cada prenda se confecciona a tu medida, en talles del 85 al 140+, con tela seleccionada y terminaciones artesanales.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/productos" className="btn-primary">
              Ver catálogo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/guia-de-talles"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: 'white',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '0.875rem',
                textDecoration: 'none',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                transition: 'background var(--dur-fast) var(--ease-out)',
              }}
            >
              Guía de talles
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
