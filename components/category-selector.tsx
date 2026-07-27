'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'
import { categories } from '@/lib/emoji-data'
import { useCast } from '@/lib/use-cast'

export function CategorySelector() {
  const { isConnected } = useCast()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background no-select">
      {/* Header */}
      <header className="flex flex-col items-center gap-2 px-4 pt-8 pb-8 relative">
        <div className="absolute top-4 right-4">
          <Link
            href="/settings"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md transition-transform active:scale-95 relative"
            aria-label="Open settings"
          >
            <Settings className="h-6 w-6" />
            {isConnected && (
              <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-green-500" />
            )}
          </Link>
        </div>
        <h1 className="text-center text-4xl font-bold text-foreground sm:text-5xl">
          Sound Playground
        </h1>
        <p className="text-center text-lg text-muted-foreground">
          Tap a category to explore!
        </p>
      </header>

      {/* Category cards */}
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-12">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/play/${category.id}`}
            className={`flex w-full max-w-sm items-center gap-6 rounded-3xl p-6 shadow-lg transition-transform active:scale-[0.98] ${
              category.id === 'vehicles'
                ? 'bg-vehicles'
                : category.id === 'instruments'
                ? 'bg-instruments'
                : 'bg-animals'
            }`}
          >
            <span className="text-6xl sm:text-7xl">{category.emoji}</span>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white sm:text-3xl">
                {category.name}
              </span>
              <span className="text-sm text-white/80">
                {category.items.length} sounds
              </span>
            </div>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <footer className="pb-8 text-center text-sm text-muted-foreground">
        Tap the speaker to hear sounds!
      </footer>
    </div>
  )
}
