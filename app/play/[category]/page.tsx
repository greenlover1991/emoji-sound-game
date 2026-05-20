import { notFound } from 'next/navigation'
import { EmojiPlayer } from '@/components/emoji-player'
import { getCategoryById, categories } from '@/lib/emoji-data'

interface PlayPageProps {
  params: Promise<{
    category: string
  }>
}

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }))
}

export async function generateMetadata({ params }: PlayPageProps) {
  const { category: categoryId } = await params
  const category = getCategoryById(categoryId)
  
  if (!category) {
    return { title: 'Not Found' }
  }
  
  return {
    title: `${category.name} - Sound Playground`,
    description: `Explore ${category.items.length} ${category.name.toLowerCase()} sounds!`,
  }
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { category: categoryId } = await params
  const category = getCategoryById(categoryId)

  if (!category) {
    notFound()
  }

  return <EmojiPlayer category={category} />
}
