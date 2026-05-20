'use client'

import Link from 'next/link'
import { categories } from '@/lib/emoji-data'

export function CategorySelector() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background no-select">
      {/* Header */}
      <header className="flex flex-col items-center gap-2 px-4 pt-12 pb-8">
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
