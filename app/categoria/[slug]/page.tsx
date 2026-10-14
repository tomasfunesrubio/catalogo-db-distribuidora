import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Catalog } from '@/components/Catalog'
import { getCategories, getCategoryBySlug } from '@/lib/categories'

// Only the known categories exist; any other slug is a 404
export const dynamicParams = false

export function generateStaticParams() {
  return getCategories().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/categoria/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  return { title: category.name, description: category.description }
}

export default async function CategoryPage({ params }: PageProps<'/categoria/[slug]'>) {
  const { slug } = await params
  if (!getCategoryBySlug(slug)) notFound()

  return <Catalog categorySlug={slug} />
}
