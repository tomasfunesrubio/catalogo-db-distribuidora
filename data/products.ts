// Archivo generado automáticamente desde CATALOGO 10 OCTUBRE.xlsx
import catalogData from './catalog.json'

export type Product = {
  id: string
  code: string
  name: string
  brand: string
  department: string
  category: string
  price: number
  wholesalePrice?: number | null
  unit: string
  discount?: string | null
  featured?: boolean
}

export const products: Product[] = catalogData as Product[]

export function getProducts(): Product[] {
  return products
}

export const categories = ["Vinos y Espumantes", "Cervezas", "Aperitivos y Destilados", "Gaseosas, Aguas y Jugos", "Kiosco y Almacén", "Promociones"] as const

export const formatPrice = (value: number) => {
  if (!value || value <= 0) return 'Consultar'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value)
}
