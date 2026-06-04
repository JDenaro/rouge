'use client'

import { useState } from 'react'

interface Props {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? ''
  const hasMultiple = images.length > 1

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
        height: '100%',
      }}
    >
      {/* Main image */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'rgba(192, 68, 90, 0.04)',
          boxShadow: 'var(--shadow-card)',
          flex: 1,
          minHeight: '520px',
        }}
      >
        {activeImage ? (
          <img
            src={activeImage}
            alt={productName}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'opacity 200ms ease-out',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(192, 68, 90, 0.1), rgba(236, 72, 153, 0.05))',
            }}
          />
        )}
      </div>

      {/* Thumbnails — only rendered when product has multiple images */}
      {hasMultiple && (
        <div
          role="list"
          aria-label="Imágenes del producto"
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              role="listitem"
              type="button"
              aria-label={`Ver imagen ${i + 1} de ${productName}`}
              aria-pressed={i === activeIndex}
              onClick={() => setActiveIndex(i)}
              style={{
                flexShrink: 0,
                width: '72px',
                height: '72px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                padding: 0,
                cursor: 'pointer',
                background: 'rgba(192, 68, 90, 0.04)',
                border: `2px solid ${i === activeIndex ? 'var(--color-primary)' : 'transparent'}`,
                outline: 'none',
                transition: 'border-color 180ms ease-out, opacity 180ms ease-out',
                opacity: i === activeIndex ? 1 : 0.55,
              }}
            >
              <img
                src={img}
                alt={`${productName} — vista ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  pointerEvents: 'none',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
