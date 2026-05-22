import { AdminShell } from '@/components/admin/AdminShell'
import { listProducts } from '@/lib/admin-data'
import { ProductRow } from './ProductRow'

export const metadata = { title: 'Admin · Productos' }
export const dynamic = 'force-dynamic'

export default async function AdminProductos() {
  const products = await listProducts()

  return (
    <AdminShell>
      <header style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.25rem',
            margin: 0,
            marginBottom: '0.25rem',
            fontWeight: 500,
          }}
        >
          Productos
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', opacity: 0.6, margin: 0 }}>
          {products.length} productos en catálogo.
        </p>
      </header>

      <section
        style={{
          background: 'white',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-soft)',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Producto</th>
              <th style={th}>Categoría</th>
              <th style={th}>Precio</th>
              <th style={th}>Visibilidad</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <ProductRow key={p.id} product={p} />
            ))}
          </tbody>
        </table>
      </section>
    </AdminShell>
  )
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 0.5rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--color-primary)',
  borderBottom: '2px solid rgba(192, 68, 90, 0.18)',
}
