import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Catalog } from '@/components/Catalog'
import { SearchCatalog } from '@/components/SearchCatalog'

export const metadata: Metadata = {
  title: 'Todos los productos',
  description: 'Lista de precios completa de DB Distribuidora de Bebidas.'
}

// The ?q= search is read in the browser, so this page can be fully static
export default function ProductsPage() {
  return (
    <Suspense fallback={<Catalog />}>
      <SearchCatalog />
    </Suspense>
  )
}
