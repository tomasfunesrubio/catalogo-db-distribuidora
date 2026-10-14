import { products } from '@/data/products'
import { CategoryGrid } from '@/components/CategoryGrid'
import { OffersCarousel } from '@/components/OffersCarousel'
import { ShippingInfo } from '@/components/ShippingInfo'

const offers = products.filter((p) => p.featured || (p.discount && p.price > 0)).slice(0, 10)

export default function HomePage() {
  return (
    <>
      <OffersCarousel offers={offers} />
      <CategoryGrid />
      <ShippingInfo />
    </>
  )
}
