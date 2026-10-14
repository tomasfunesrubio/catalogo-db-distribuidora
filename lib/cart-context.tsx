'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProducts, type Product } from '@/data/products'

const STORAGE_KEY = 'db-cart'

type Cart = Record<string, number>
export type CartItem = { product: Product; quantity: number }

type CartContextValue = {
  cart: Cart
  cartItems: CartItem[]
  cartCount: number
  subtotal: number
  updateCart: (id: string, value: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const productMap = useMemo(() => new Map(getProducts().map((p) => [p.id, p])), [])
  const [cart, setCart] = useState<Cart>({})
  const [loaded, setLoaded] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load saved cart on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setCart(JSON.parse(saved))
    } catch (e) {
      console.error('Error loading cart', e)
    }
    setLoaded(true)
  }, [])

  // Save cart (only after the saved one was loaded, so it isn't overwritten)
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // storage unavailable (private mode, etc.)
    }
  }, [cart, loaded])

  const updateCart = (id: string, value: number) => {
    setCart((current) => {
      const next = { ...current }
      if (value <= 0) delete next[id]
      else next[id] = value
      return next
    })
  }

  const clearCart = () => setCart({})

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => {
          const product = productMap.get(id)
          return product ? { product, quantity } : null
        })
        .filter((item): item is CartItem => item !== null),
    [cart, productMap]
  )

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cart, cartItems, cartCount, subtotal, updateCart, clearCart, isCartOpen, setIsCartOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
