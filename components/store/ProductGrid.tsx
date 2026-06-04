import type { Product } from '@/lib/supabase/types'
import { ProductCard } from '@/components/store/ProductCard'

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          color: 'var(--color-fg)',
          opacity: 0.6,
          padding: '3rem 0',
          textAlign: 'center',
        }}
      >
        No encontramos productos con esos filtros.
      </p>
    )
  }

  return (
    <>
      <div className="rouge-product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <style>{`
        .rouge-product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1023px) {
          .rouge-product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 639px) {
          .rouge-product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }
        .rouge-prod-card {
          transition: transform var(--dur-mid) var(--ease-out), box-shadow var(--dur-mid) var(--ease-out);
        }
        .rouge-prod-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(192, 68, 90, 0.18);
        }
        .rouge-prod-card:hover .rouge-prod-img {
          transform: scale(1.04);
        }
      `}</style>
    </>
  )
}
