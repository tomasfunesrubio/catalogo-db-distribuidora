'use client'

import { Plus, ShoppingBag } from 'lucide-react'
import { formatPrice, type Product } from '@/data/products'
import { useCart } from '@/lib/cart-context'
import { whatsappLink } from '@/lib/site-config'

export function ProductCard({ product }: { product: Product }) {
  const { cart, updateCart } = useCart()
  const quantity = cart[product.id] || 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[#e3dbcf] bg-white shadow-xs transition hover:border-[#b80f0f]/40 hover:shadow-md">
      {/* Image placeholder — replace with <Image> when product images arrive */}
      <div className="relative flex aspect-square w-full items-center justify-center bg-[#f0eee9]">
        <ShoppingBag className="size-12 text-[#d5cabc] transition group-hover:scale-110 group-hover:text-[#b80f0f]/30" />
        {product.discount && (
          <span className="absolute left-2 top-2 rounded-md bg-[#b80f0f] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
            {product.discount}
          </span>
        )}
        <span className="absolute right-2 top-2 rounded-md bg-white/80 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-mono text-[#77736e]">
          #{product.code}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <span className="mb-1 self-start truncate rounded bg-[#f6f1e9] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#77736e]">
          {product.department}
        </span>

        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1a1a1a]">
          {product.name}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center rounded bg-[#f6f1e9] px-1.5 py-0.5 text-[11px] text-[#57534e]">
            {product.unit}
          </span>
        </div>

        {/* Price section */}
        <div className="mt-auto pt-3">
          <div className="mb-2.5">
            {product.price > 0 ? (
              <>
                <div className="text-lg font-extrabold text-[#1a1a1a] tabular-nums">
                  {formatPrice(product.price)}
                </div>
                {product.wholesalePrice && product.wholesalePrice < product.price && (
                  <div className="text-[11px] text-[#15803d] font-semibold tabular-nums mt-0.5">
                    Mayorista: {formatPrice(product.wholesalePrice)}
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm font-bold text-[#b80f0f]">Consultar precio</div>
            )}
          </div>

          {product.price > 0 ? (
            quantity > 0 ? (
              <div className="flex h-9 w-full items-center justify-between rounded-lg bg-[#1a1a1a] px-2.5 text-white">
                <button
                  onClick={() => updateCart(product.id, quantity - 1)}
                  aria-label="Reducir cantidad"
                  className="flex size-7 items-center justify-center rounded hover:bg-white/20 text-base font-bold"
                >
                  −
                </button>
                <span className="text-xs font-bold tabular-nums">
                  {quantity} {quantity === 1 ? 'ud' : 'uds'}
                </span>
                <button
                  onClick={() => updateCart(product.id, quantity + 1)}
                  aria-label="Aumentar cantidad"
                  className="flex size-7 items-center justify-center rounded hover:bg-white/20 text-base font-bold"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => updateCart(product.id, 1)}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#b80f0f] px-3 text-xs font-bold text-white transition hover:bg-[#970b0b] active:scale-[0.98]"
              >
                <Plus className="size-3.5" />
                Agregar
              </button>
            )
          ) : (
            <a
              href={whatsappLink(
                `Hola! Quería consultar el precio de: ${product.name} (#${product.code})`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#15803d] text-xs font-bold text-[#15803d] transition hover:bg-[#15803d] hover:text-white"
            >
              Consultar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
