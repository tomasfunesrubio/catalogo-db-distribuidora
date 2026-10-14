'use client'

import { ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/data/products'
import { useCart } from '@/lib/cart-context'

// Barra inferior visible cuando hay productos en el carrito y el drawer está cerrado
export function FloatingCartBar() {
  const { cartCount, subtotal, isCartOpen, setIsCartOpen } = useCart()

  if (cartCount === 0 || isCartOpen) return null

  return (
    <aside aria-label="Resumen de pedido" className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#1a1a1a] p-3 pl-4 text-white shadow-2xl border border-white/10 backdrop-blur-md">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white/80">
            {cartCount} {cartCount === 1 ? 'producto' : 'productos'} en tu pedido
          </p>
          <p className="text-base font-extrabold text-white tabular-nums">
            Total: {formatPrice(subtotal)}
          </p>
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#b80f0f] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#970b0b] active:scale-95 shrink-0"
        >
          <ShoppingBag className="size-4" />
          Ver pedido / Finalizar
        </button>
      </div>
    </aside>
  )
}
