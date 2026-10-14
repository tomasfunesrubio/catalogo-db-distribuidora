'use client'

import { useSearchParams } from 'next/navigation'
import { Catalog } from './Catalog'

export function SearchCatalog() {
  const query = useSearchParams().get('q') ?? ''

  // key: a new search from the header restarts the catalog with that query
  return <Catalog key={query} initialQuery={query} />
}
