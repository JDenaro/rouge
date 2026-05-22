import { Hero } from '@/components/store/Hero'
import { CategoriesGrid } from '@/components/store/CategoriesGrid'
import { FeaturedProducts } from '@/components/store/FeaturedProducts'
import { HowItWorks } from '@/components/store/HowItWorks'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesGrid />
      <FeaturedProducts />
      <HowItWorks />
    </>
  )
}
