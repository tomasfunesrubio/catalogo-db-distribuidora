// Datos del negocio: contacto, redes y condiciones de envío.

// Prefix for files in public/ (needed when the site lives under a sub-path, e.g. GitHub Pages)
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491140808498'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola!%20Quiero%20consultar%20por%20un%20pedido`

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/dbdistribuidora',
  facebook: 'https://facebook.com/dbdistribuidora'
}

export const SHOP_INFO = {
  address: 'Plátanos, Berazategui, Buenos Aires',
  zones: ['Plátanos', 'Berazategui', 'Hudson', 'Ranelagh', 'Quilmes'],
  freeShippingFrom: '$80.000',
  freeShippingAmount: 80000,
  phone: '+54 9 11 4080-8498',
  email: 'ventas@dbdistribuidora.com.ar',
  hours: ['Lunes a viernes: 9 a 18 h', 'Sábados: 9 a 13 h', 'Domingos: cerrado']
}

// Descuento por retirar en el local pagando en efectivo
export const PICKUP_DISCOUNT = 0.05
