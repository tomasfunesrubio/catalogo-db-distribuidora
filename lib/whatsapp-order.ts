import { formatPrice } from '@/data/products'
import type { CartItem } from '@/lib/cart-context'
import { SHOP_INFO } from '@/lib/site-config'

export type DeliveryMethod = 'retiro' | 'envio'

type OrderDetails = {
  items: CartItem[]
  deliveryMethod: DeliveryMethod
  subtotal: number
  discountAmount: number
  finalTotal: number
  customerName: string
  customerAddress: string
  customerNotes: string
}

// Arma el mensaje de WhatsApp con el detalle del pedido
export function buildOrderMessage({
  items,
  deliveryMethod,
  subtotal,
  discountAmount,
  finalTotal,
  customerName,
  customerAddress,
  customerNotes
}: OrderDetails) {
  let msg = `¡Hola DB Distribuidora! 👋 Quiero realizar el siguiente pedido:\n\n`
  msg += `📋 *DETALLE DEL PEDIDO:*\n`

  items.forEach(({ product, quantity }) => {
    const itemTotal =
      product.price > 0 ? formatPrice(product.price * quantity) : 'Consultar precio'
    const unitPrice = product.price > 0 ? formatPrice(product.price) : 'Consultar'
    msg += `• ${quantity}x ${product.name} (#${product.code}) - ${itemTotal} (${unitPrice} c/u)\n`
  })

  msg += `\n📦 *Método de entrega:* ${
    deliveryMethod === 'retiro' ? `Retiro en el local (${SHOP_INFO.address})` : 'Envío a domicilio'
  }\n`

  if (deliveryMethod === 'retiro') {
    msg += `💵 *Pago en efectivo al retirar:* 5% de descuento aplicado\n`
    msg += `💰 *Subtotal:* ${formatPrice(subtotal)}\n`
    msg += `🏷️ *Descuento retiro (-5%):* -${formatPrice(discountAmount)}\n`
    msg += `🔥 *TOTAL A PAGAR:* ${formatPrice(finalTotal)}\n`
  } else {
    msg += `💰 *TOTAL PRODUCTOS:* ${formatPrice(subtotal)}\n`
    if (subtotal >= SHOP_INFO.freeShippingAmount) {
      msg += `🚚 *Envío:* ¡GRATIS! (Supera los ${SHOP_INFO.freeShippingFrom})\n`
    } else {
      msg += `🚚 *Envío:* A coordinar con la distribuidora\n`
    }
  }

  if (customerName.trim()) {
    msg += `\n👤 *Cliente:* ${customerName.trim()}\n`
  }
  if (deliveryMethod === 'envio' && customerAddress.trim()) {
    msg += `📍 *Dirección de entrega:* ${customerAddress.trim()}\n`
  }
  if (customerNotes.trim()) {
    msg += `📝 *Notas:* ${customerNotes.trim()}\n`
  }

  msg += `\n¿Me confirman si está todo disponible? ¡Muchas gracias!`
  return msg
}
