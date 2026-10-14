'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingBag, Store, Trash2, Truck, X } from 'lucide-react'
import { formatPrice } from '@/data/products'
import { useCart } from '@/lib/cart-context'
import { PICKUP_DISCOUNT, SHOP_INFO, whatsappLink } from '@/lib/site-config'
import { buildOrderMessage, type DeliveryMethod } from '@/lib/whatsapp-order'
import { WhatsAppIcon } from './WhatsAppIcon'

const inputClass =
  'h-10 w-full rounded-xl border border-[#d5cabc] bg-white px-3 text-xs outline-none focus:border-[#b80f0f]'

const deliveryOptionClass = (selected: boolean) =>
  `flex flex-col items-start rounded-xl border p-3 text-left transition ${
    selected
      ? 'border-[#b80f0f] bg-[#b80f0f]/5 ring-1 ring-[#b80f0f]'
      : 'border-[#d5cabc] bg-white hover:bg-[#faf8f5]'
  }`

export function CartDrawer() {
  const { cartItems, cartCount, subtotal, updateCart, clearCart, isCartOpen, setIsCartOpen } = useCart()

  // Se mantienen aunque el drawer se cierre, porque el componente sigue montado
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('retiro')
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')

  if (!isCartOpen) return null

  const discountAmount = deliveryMethod === 'retiro' ? Math.round(subtotal * PICKUP_DISCOUNT) : 0
  const finalTotal = subtotal - discountAmount
  const freeShipping = subtotal >= SHOP_INFO.freeShippingAmount
  const close = () => setIsCartOpen(false)

  const sendOrder = () => {
    if (cartItems.length === 0) return
    const message = buildOrderMessage({
      items: cartItems,
      deliveryMethod,
      subtotal,
      discountAmount,
      finalTotal,
      customerName,
      customerAddress,
      customerNotes
    })
    window.open(whatsappLink(message), '_blank')
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={close} />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e3dbcf] px-6 py-4">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="size-5 text-[#b80f0f]" />
              <h2 id="cart-drawer-title" className="font-serif text-xl font-bold text-[#1a1a1a]">
                Tu Pedido
              </h2>
              <span className="rounded-full bg-[#f0eee9] px-2.5 py-0.5 text-xs font-bold text-[#77736e]">
                {cartCount}
              </span>
            </div>
            <button
              onClick={close}
              aria-label="Cerrar pedido"
              className="flex size-9 items-center justify-center rounded-lg text-[#77736e] hover:bg-[#f6f1e9] hover:text-[#1a1a1a] transition"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="mx-auto size-14 text-[#d5cabc]" />
                <p className="mt-4 text-base font-bold text-[#1a1a1a]">Tu carrito está vacío</p>
                <p className="mt-1 text-sm text-[#77736e]">
                  Agregá productos desde el catálogo para armar tu pedido.
                </p>
                <button
                  onClick={close}
                  className="mt-6 rounded-xl bg-[#b80f0f] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#970b0b]"
                >
                  Explorar catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#77736e]">
                      Productos ({cartItems.length})
                    </span>
                    <button
                      onClick={clearCart}
                      className="flex items-center gap-1 text-xs font-bold text-[#b80f0f] hover:underline"
                    >
                      <Trash2 className="size-3" /> Vaciar
                    </button>
                  </div>

                  <div className="divide-y divide-[#f0eee9] rounded-xl border border-[#e3dbcf] bg-[#faf8f5]">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-start justify-between gap-3 p-3.5">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-[#a8a29e]">#{product.code}</span>
                            <span className="rounded bg-[#f0eee9] px-1.5 py-0.5 text-[10px] font-semibold text-[#77736e]">
                              {product.department}
                            </span>
                          </div>
                          <h4 className="mt-1 text-sm font-bold text-[#1a1a1a] leading-tight line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-[#77736e]">
                            {formatPrice(product.price)} c/u · {product.unit}
                          </p>

                          <div className="mt-2.5 flex items-center gap-2">
                            <div className="flex h-8 items-center rounded-lg border border-[#d5cabc] bg-white">
                              <button
                                onClick={() => updateCart(product.id, quantity - 1)}
                                aria-label="Restar 1"
                                className="flex size-8 items-center justify-center text-[#77736e] hover:bg-[#f6f1e9]"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold tabular-nums">{quantity}</span>
                              <button
                                onClick={() => updateCart(product.id, quantity + 1)}
                                aria-label="Sumar 1"
                                className="flex size-8 items-center justify-center text-[#77736e] hover:bg-[#f6f1e9]"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => updateCart(product.id, 0)}
                              aria-label="Eliminar producto"
                              className="flex size-8 items-center justify-center rounded-lg text-[#a8a29e] hover:text-[#b80f0f] hover:bg-white"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-[#1a1a1a] tabular-nums">
                            {formatPrice(product.price * quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery method */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#77736e]">
                    Método de entrega
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('retiro')}
                      className={deliveryOptionClass(deliveryMethod === 'retiro')}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#1a1a1a]">
                        <Store className="size-4 text-[#b80f0f]" />
                        Retiro en local
                      </div>
                      <span className="mt-1 text-[11px] font-bold text-[#15803d]">5% OFF en efectivo</span>
                      <span className="text-[10px] text-[#77736e]">Plátanos / Berazategui</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('envio')}
                      className={deliveryOptionClass(deliveryMethod === 'envio')}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#1a1a1a]">
                        <Truck className="size-4 text-[#b80f0f]" />
                        Envío a domicilio
                      </div>
                      <span className="mt-1 text-[11px] text-[#57534e]">24-48 hs hábiles</span>
                      <span className="text-[10px] text-[#77736e]">Berazategui, Hudson, etc.</span>
                    </button>
                  </div>

                  {deliveryMethod === 'envio' && (
                    <div
                      className={`rounded-xl p-3 text-xs ${
                        freeShipping
                          ? 'bg-[#15803d]/10 text-[#15803d] font-semibold border border-[#15803d]/20'
                          : 'bg-[#faf8f5] text-[#57534e] border border-[#e3dbcf]'
                      }`}
                    >
                      {freeShipping ? (
                        <span>🎉 ¡Felicitaciones! Alcanzaste el <strong>Envío Gratis</strong>.</span>
                      ) : (
                        <span>
                          Te faltan <strong>{formatPrice(SHOP_INFO.freeShippingAmount - subtotal)}</strong>{' '}
                          para tener <strong>Envío Gratis</strong> (compras desde {SHOP_INFO.freeShippingFrom}).
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Customer info */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#77736e]">
                    Datos para el pedido (opcional)
                  </label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Tu nombre o negocio..."
                    className={inputClass}
                  />
                  {deliveryMethod === 'envio' && (
                    <input
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Dirección y localidad de entrega..."
                      className={inputClass}
                    />
                  )}
                  <input
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Aclaración adicional (ej: pago con efectivo de $20.000)..."
                    className={inputClass}
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer: totals + WhatsApp CTA */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#e3dbcf] bg-[#faf8f5] p-6 space-y-4">
              <div className="space-y-1.5 text-xs text-[#57534e]">
                <div className="flex justify-between">
                  <span>Subtotal productos:</span>
                  <span className="font-semibold tabular-nums text-[#1a1a1a]">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#15803d] font-bold">
                    <span>Descuento 5% (Efectivo en local):</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t border-[#e3dbcf] text-base font-extrabold text-[#1a1a1a]">
                  <span>Total estimado:</span>
                  <span className="text-2xl font-black text-[#1a1a1a] tabular-nums">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={sendOrder}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] px-4 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#166534] active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-5" />
                Finalizar pedido por WhatsApp
              </button>

              <p className="text-center text-[11px] text-[#77736e]">
                Al tocar el botón se abrirá WhatsApp con el detalle completo de tu pedido para coordinar entrega y pago.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
