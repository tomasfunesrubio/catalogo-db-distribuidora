import { Beer, GlassWater, Sparkles, Store, Tag, Wine, type LucideIcon } from 'lucide-react'
import { categories, products } from '@/data/products'

export type CategoryInfo = {
  name: string
  slug: string
  description: string
  icon: LucideIcon
  count: number
}

const CATEGORY_META: Record<string, { description: string; icon: LucideIcon }> = {
  'Vinos y Espumantes': {
    description: 'Tintos, blancos, rosados, espumantes, sidras y bodegas destacadas',
    icon: Wine
  },
  Cervezas: {
    description: 'Latas, botellas, porrones y packs de primeras marcas',
    icon: Beer
  },
  'Aperitivos y Destilados': {
    description: 'Fernet, gin, vodka, whisky, licores y aperitivos',
    icon: Sparkles
  },
  'Gaseosas, Aguas y Jugos': {
    description: 'Gaseosas, aguas, sodas, jugos y energizantes',
    icon: GlassWater
  },
  'Kiosco y Almacén': {
    description: 'Snacks, galletitas, golosinas y artículos de almacén',
    icon: Store
  },
  Promociones: {
    description: 'Combos especiales y mejores precios por volumen',
    icon: Tag
  }
}

export function categoryToSlug(name: string) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getCategories(): CategoryInfo[] {
  return categories.map((name) => ({
    name,
    slug: categoryToSlug(name),
    description: CATEGORY_META[name]?.description ?? 'Variedad de productos disponibles',
    icon: CATEGORY_META[name]?.icon ?? Store,
    count: products.filter((p) => p.category === name).length
  }))
}

export function getCategoryBySlug(slug: string) {
  return getCategories().find((c) => c.slug === slug)
}
