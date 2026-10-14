import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { products } from '@/data/products'
import { getCategories } from '@/lib/categories'

export function CategoryGrid() {
  const categories = getCategories()

  return (
    <section id="categorias" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#77736e]">
          Lista de precios actualizada
        </p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl text-[#1a1a1a]">Categorías</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(({ name, slug, description, icon: Icon, count }) => (
          <Link
            key={slug}
            href={`/categoria/${slug}`}
            className="group flex items-start gap-4 rounded-2xl border border-[#e3dbcf] bg-white p-5 shadow-xs transition hover:border-[#b80f0f]/40 hover:shadow-md"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#b80f0f]/10 text-[#b80f0f] transition group-hover:bg-[#b80f0f] group-hover:text-white">
              <Icon className="size-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-lg font-bold text-[#1a1a1a]">{name}</span>
              <span className="mt-0.5 block text-sm text-[#57534e]">{description}</span>
              <span className="mt-3 flex items-center justify-between text-xs font-bold">
                <span className="text-[#77736e]">
                  {count} {count === 1 ? 'producto' : 'productos'}
                </span>
                <span className="flex items-center gap-1 text-[#b80f0f]">
                  Ver productos
                  <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/productos"
        className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#1a1a1a] px-5 py-4 text-white transition hover:bg-[#2a2a2a]"
      >
        <span>
          <span className="block text-sm font-bold">Ver todos los productos</span>
          <span className="text-xs text-white/70">{products.length} productos en el catálogo</span>
        </span>
        <ArrowRight className="size-5" />
      </Link>
    </section>
  )
}
