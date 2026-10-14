'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Search, ShoppingBag, X } from 'lucide-react'
import { formatPrice, getProducts } from '@/data/products'
import { useCart } from '@/lib/cart-context'
import { WHATSAPP_URL } from '@/lib/site-config'
import { normalize } from '@/lib/utils'
import { Logo } from './Logo'
import { SocialLinks } from './SocialLinks'

export function Header() {
  const router = useRouter()
  const { cartCount, setIsCartOpen } = useCart()
  const products = useMemo(() => getProducts(), [])
  const [query, setQuery] = useState('')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)

  // Search by name, brand and description (department) — not by product code
  const suggestions = useMemo(() => {
    const norm = normalize(query.trim())
    if (!norm) return []
    return products
      .filter((p) => normalize(`${p.name} ${p.brand} ${p.department}`).includes(norm))
      .slice(0, 6)
  }, [products, query])

  const search = (term = query) => {
    setSuggestionsOpen(false)
    setQuery('')
    const q = term.trim()
    router.push(q ? `/productos?q=${encodeURIComponent(q)}` : '/productos')
  }

  const handleChange = (value: string) => {
    setQuery(value)
    setSuggestionsOpen(true)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e3dbcf] bg-white shadow-xs">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Search bar on desktop */}
        <div className="relative hidden min-w-0 flex-1 md:block">
          <form
            role="search"
            className="flex h-11"
            onSubmit={(e) => {
              e.preventDefault()
              search()
            }}
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-[#77736e]" />
              <input
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setSuggestionsOpen(true)}
                onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSuggestionsOpen(false)
                }}
                placeholder="Buscá por producto, marca o descripción..."
                aria-label="Buscar productos"
                enterKeyHint="search"
                className="h-11 w-full rounded-l-xl border border-r-0 border-[#d5cabc] bg-white pl-11 pr-10 text-sm outline-none focus:border-[#b80f0f]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Borrar búsqueda"
                  className="absolute right-2 top-2 flex size-7 items-center justify-center text-[#77736e] hover:text-[#1a1a1a]"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              aria-label="Buscar"
              className="flex h-11 w-12 items-center justify-center rounded-r-xl bg-[#b80f0f] text-white hover:bg-[#970b0b] transition"
            >
              <Search className="size-5" />
            </button>
          </form>

          {/* Suggestions dropdown */}
          {suggestionsOpen && suggestions.length > 0 && (
            <div className="absolute left-0 right-12 top-12 z-50 rounded-xl border border-[#d5cabc] bg-white p-2 shadow-2xl">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => search(p.name)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg p-2.5 text-left hover:bg-[#f6f1e9] transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#1a1a1a]">{p.name}</p>
                    <p className="text-xs text-[#77736e]">
                      {p.brand ? `${p.brand} · ` : ''}
                      {p.department} · {p.unit}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-[#1a1a1a] tabular-nums shrink-0">
                    {formatPrice(p.price)}
                  </span>
                </button>
              ))}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => search()}
                className="w-full border-t border-[#e3dbcf] px-2 pt-2.5 text-left text-sm font-bold text-[#b80f0f] hover:underline"
              >
                Ver todos los resultados →
              </button>
            </div>
          )}
        </div>

        {/* Header WhatsApp CTA */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden h-11 items-center gap-2 rounded-xl bg-[#15803d]/10 px-4 text-sm font-bold text-[#15803d] transition hover:bg-[#15803d] hover:text-white md:flex"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </a>

        <SocialLinks />

        {/* Cart trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          aria-label={`Ver carrito, ${cartCount} productos`}
          className="relative flex size-11 items-center justify-center rounded-xl border border-[#d5cabc] bg-white shadow-xs hover:bg-[#f6f1e9] transition"
        >
          <ShoppingBag className="size-5 text-[#1a1a1a]" />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#b80f0f] text-[11px] font-extrabold text-white shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile search bar */}
      <div className="flex gap-2 px-4 pb-3 md:hidden">
        <form
          role="search"
          className="relative flex min-w-0 flex-1"
          onSubmit={(e) => {
            e.preventDefault()
            search()
          }}
        >
          <Search className="pointer-events-none absolute left-3.5 top-3 size-5 text-[#77736e]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá por producto o marca..."
            aria-label="Buscar productos"
            enterKeyHint="search"
            className="h-11 w-full rounded-xl border border-[#d5cabc] pl-11 pr-3 text-sm outline-none focus:border-[#b80f0f]"
          />
        </form>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex size-11 items-center justify-center rounded-xl bg-[#15803d] text-white shadow-xs"
        >
          <MessageCircle className="size-5" />
        </a>
      </div>
    </header>
  )
}
