'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Search } from 'lucide-react'
import { getProducts } from '@/data/products'
import { getCategories, getCategoryBySlug } from '@/lib/categories'
import { normalize } from '@/lib/utils'
import { ProductCard } from './ProductCard'

const PAGE_SIZE = 24
const LOAD_MORE_STEP = 36

type CatalogProps = {
  // Without a category it shows the whole catalog
  categorySlug?: string
  initialQuery?: string
}

export function Catalog({ categorySlug, initialQuery = '' }: CatalogProps) {
  const category = useMemo(
    () => (categorySlug ? getCategoryBySlug(categorySlug) : undefined),
    [categorySlug]
  )
  const allCategories = useMemo(() => getCategories(), [])
  const products = useMemo(
    () => getProducts().filter((p) => !category || p.category === category.name),
    [category]
  )

  const [query, setQuery] = useState(initialQuery)
  const [debounced, setDebounced] = useState(initialQuery)
  const [sort, setSort] = useState('Recomendados')
  const [visible, setVisible] = useState(PAGE_SIZE)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200)
    return () => clearTimeout(t)
  }, [query])

  const filtered = useMemo(() => {
    const norm = normalize(debounced.trim())
    return products
      .filter((p) => !norm || normalize(`${p.name} ${p.brand} ${p.department}`).includes(norm))
      .sort((a, b) => {
        // Products without price ("Consultar precio") always go last when sorting by price
        const withoutPrice = Number(a.price <= 0) - Number(b.price <= 0)
        if (sort === 'Menor precio') return withoutPrice || a.price - b.price
        if (sort === 'Mayor precio') return withoutPrice || b.price - a.price
        if (sort === 'A-Z') return a.name.localeCompare(b.name)
        return (
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          Number(b.price > 0) - Number(a.price > 0)
        )
      })
  }, [products, debounced, sort])

  const clearSearch = () => {
    setQuery('')
    setVisible(PAGE_SIZE)
  }

  const title = category?.name ?? 'Todos los productos'

  return (
    <section id="productos" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" className="mb-3 flex items-center gap-1 text-xs font-semibold text-[#77736e]">
        <Link href="/" className="hover:text-[#b80f0f]">Inicio</Link>
        <ChevronRight className="size-3" />
        <Link href="/#categorias" className="hover:text-[#b80f0f]">Categorías</Link>
        <ChevronRight className="size-3" />
        <span className="text-[#1a1a1a]">{title}</span>
      </nav>

      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#77736e]">
            Lista de precios actualizada
          </p>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl text-[#1a1a1a]">{title}</h1>
          {category && <p className="mt-1 text-sm text-[#57534e]">{category.description}</p>}
        </div>
        <span className="text-sm font-semibold text-[#77736e]">
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'} encontrados
        </span>
      </div>

      {/* Category shortcuts */}
      <div className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ slug: undefined, name: 'Todas' }, ...allCategories].map((c) => {
          const active = c.slug === category?.slug
          return (
            <Link
              key={c.name}
              href={c.slug ? `/categoria/${c.slug}` : '/productos'}
              aria-current={active ? 'page' : undefined}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                active
                  ? 'border-[#b80f0f] bg-[#b80f0f] text-white'
                  : 'border-[#d5cabc] bg-white text-[#44403c] hover:border-[#b80f0f] hover:text-[#b80f0f]'
              }`}
            >
              {c.name}
            </Link>
          )
        })}
      </div>

      {/* Sticky filters toolbar */}
      <div className="sticky top-[72px] z-30 mb-6 bg-[#f6f1e9] py-3 border-b border-[#e3dbcf]">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-[#77736e]" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setVisible(PAGE_SIZE)
              }}
              placeholder={category ? `Buscar en ${category.name}...` : 'Filtrar por nombre, marca o descripción...'}
              aria-label="Filtrar productos"
              className="h-11 w-full rounded-xl border border-[#d5cabc] bg-white pl-11 pr-3 text-sm outline-none focus:border-[#b80f0f] shadow-xs"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Ordenar productos"
            className="h-11 rounded-xl border border-[#d5cabc] bg-white px-3.5 text-sm font-semibold sm:w-48 shadow-xs"
          >
            <option>Recomendados</option>
            <option>Menor precio</option>
            <option>Mayor precio</option>
            <option>A-Z</option>
          </select>
        </div>

        {debounced && (
          <div className="mt-2.5 flex items-center gap-2 text-xs">
            <span className="rounded-md bg-white border border-[#e3dbcf] px-2.5 py-1 font-medium">
              Búsqueda: “{debounced}”
            </span>
            <button onClick={clearSearch} className="font-bold text-[#b80f0f] hover:underline">
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.slice(0, visible).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisible((v) => v + LOAD_MORE_STEP)}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#b80f0f] px-6 py-3 text-sm font-bold text-[#b80f0f] hover:bg-[#b80f0f] hover:text-white transition"
          >
            Cargar más productos ({filtered.length - visible} restantes)
          </button>
        </div>
      )}

      {!filtered.length && (
        <div className="rounded-2xl border border-dashed border-[#d5cabc] bg-white p-12 text-center text-[#77736e]">
          <p className="text-lg font-bold text-[#1a1a1a]">No encontramos productos</p>
          <p className="mt-1 text-sm">
            Probá buscando con otro nombre{category ? ' o en otra categoría' : ''}.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={clearSearch}
              className="inline-flex rounded-lg bg-[#b80f0f] px-4 py-2 text-xs font-bold text-white"
            >
              Limpiar búsqueda
            </button>
            {category && debounced && (
              <Link
                href={`/productos?q=${encodeURIComponent(debounced)}`}
                className="inline-flex rounded-lg border border-[#b80f0f] px-4 py-2 text-xs font-bold text-[#b80f0f]"
              >
                Buscar en todo el catálogo
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
