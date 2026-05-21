export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Admin sidebar will go here in Phase 2 */}
      <main style={{ padding: '2rem' }}>{children}</main>
    </div>
  )
}
