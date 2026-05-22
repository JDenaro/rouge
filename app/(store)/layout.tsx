import { Nav } from '@/components/store/Nav'
import { Footer } from '@/components/store/Footer'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
