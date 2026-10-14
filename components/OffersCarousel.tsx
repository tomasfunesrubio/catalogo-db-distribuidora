'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Plus, ShoppingBag } from 'lucide-react'
import { formatPrice, type Product } from '@/data/products'
import { useCart } from '@/lib/cart-context'

export function OffersCarousel({ offers }: { offers: Product[] }) {
  const { cart, updateCart } = useCart()
  const offersRef = useRef<HTMLDivElement>(null)
  const [offerIndex, setOfferIndex] = useState(0)

  if (offers.length === 0) return null

  const scrollOffers = (direction: 'prev' | 'next') => {
    const container = offersRef.current
    if (!container) return
    const scrollAmount = Math.max(300, Math.floor(container.clientWidth * 0.75))
    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    })
  }

  const scrollToOffer = (index: number) => {
    const card = offersRef.current?.children[index] as HTMLElement | undefined
    if (!card) return
    card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    setOfferIndex(index)
  }

  // Track which card is closest to the left edge to highlight its dot
  const handleOffersScroll = () => {
    const container = offersRef.current
    if (!container) return
    const containerLeft = container.getBoundingClientRect().left
    const cards = Array.from(container.children) as HTMLElement[]
    if (cards.length === 0) return

    let closestIndex = 0
    let minDiff = Infinity
    cards.forEach((card, i) => {
      const diff = Math.abs(card.getBoundingClientRect().left - containerLeft)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    })
    setOfferIndex(closestIndex)
  }

  return (
    <section id="ofertas" className="border-b border-[#e3dbcf] bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#b80f0f]">
              Precios destacados
            </span>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl text-[#1a1a1a]">
              Ofertas y Promociones
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollOffers('prev')}
                aria-label="Oferta anterior"
                className="flex size-9 items-center justify-center rounded-lg border border-[#d5cabc] bg-white shadow-xs hover:bg-[#f6f1e9] transition active:scale-95"
              >
                <ChevronLeft className="size-4 text-[#1a1a1a]" />
              </button>
              <button
                onClick={() => scrollOffers('next')}
                aria-label="Oferta siguiente"
                className="flex size-9 items-center justify-center rounded-lg border border-[#d5cabc] bg-white shadow-xs hover:bg-[#f6f1e9] transition active:scale-95"
              >
                <ChevronRight className="size-4 text-[#1a1a1a]" />
              </button>
            </div>
            <Link
              href="/productos"
              className="hidden text-sm font-bold text-[#b80f0f] hover:underline sm:inline"
            >
              Ver todo →
            </Link>
          </div>
        </div>

        <div
          ref={offersRef}
          onScroll={handleOffersScroll}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-2 pb-5 [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
        >
          {offers.map((p) => (
            <article
              key={p.id}
              className="group w-[280px] min-w-[280px] shrink-0 snap-start flex flex-col justify-between rounded-xl border border-[#e3dbcf] bg-white p-4 sm:w-[300px] sm:min-w-[300px] shadow-xs hover:border-[#b80f0f]/40 hover:shadow-md transition-all duration-200"
            >
              {/* Image placeholder with badges */}
              <div className="relative mb-3 flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-[#f0eee9] overflow-hidden">
                <ShoppingBag className="size-10 text-[#d5cabc] transition group-hover:scale-105 group-hover:text-[#b80f0f]/30" />
                <span className="absolute left-2 top-2 rounded-md bg-[#b80f0f] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                  {p.discount || 'OFERTA'}
                </span>
                <span className="absolute right-2 top-2 rounded-md bg-white/80 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-mono text-[#77736e]">
                  #{p.code}
                </span>
              </div>

              <div className="flex-1 flex flex-col">
                <span className="mb-1 self-start rounded bg-[#f6f1e9] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#77736e]">
                  {p.department}
                </span>
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1a1a1a]">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs text-[#77736e]">{p.unit}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#e3dbcf] flex items-center justify-between gap-2">
                <div>
                  {p.wholesalePrice && p.wholesalePrice < p.price ? (
                    <>
                      <p className="text-xs text-[#77736e] line-through tabular-nums">
                        {formatPrice(p.price)}
                      </p>
                      <strong className="text-lg font-extrabold text-[#1a1a1a] tabular-nums">
                        {formatPrice(p.wholesalePrice)}
                      </strong>
                    </>
                  ) : (
                    <strong className="text-lg font-extrabold text-[#1a1a1a] tabular-nums">
                      {formatPrice(p.price)}
                    </strong>
                  )}
                </div>
                {cart[p.id] ? (
                  <div className="flex h-9 items-center rounded-lg bg-[#1a1a1a] px-2 text-white">
                    <button
                      onClick={() => updateCart(p.id, cart[p.id] - 1)}
                      aria-label="Reducir cantidad"
                      className="flex size-6 items-center justify-center rounded hover:bg-white/20 text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="px-2 text-xs font-bold tabular-nums">{cart[p.id]}</span>
                    <button
                      onClick={() => updateCart(p.id, cart[p.id] + 1)}
                      aria-label="Aumentar cantidad"
                      className="flex size-6 items-center justify-center rounded hover:bg-white/20 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => updateCart(p.id, 1)}
                    className="flex h-9 items-center gap-1 rounded-lg bg-[#b80f0f] px-3.5 text-xs font-bold text-white transition hover:bg-[#970b0b] active:scale-95"
                  >
                    <Plus className="size-3.5" />
                    Agregar
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-1.5 pt-2">
          {offers.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToOffer(i)}
              aria-label={`Ir a oferta ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === offerIndex ? 'w-6 bg-[#b80f0f]' : 'w-2 bg-[#d5cabc] hover:bg-[#b80f0f]/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
