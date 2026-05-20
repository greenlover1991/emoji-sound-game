'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Music, Play, Home } from 'lucide-react'
import Link from 'next/link'
import type { Category } from '@/lib/emoji-data'
import { useSound } from '@/lib/use-sound'

interface EmojiPlayerProps {
  category: Category
}

export function EmojiPlayer({ category }: EmojiPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const { playSound, speakName, stopSound, isPlaying } = useSound()

  const currentItem = category.items[currentIndex]

  const goNext = useCallback(() => {
    stopSound() // Stop audio when navigating
    setCurrentIndex((prev) => (prev + 1) % category.items.length)
    setBouncing(true)
    setTimeout(() => setBouncing(false), 300)
  }, [category.items.length, stopSound])

  const goPrevious = useCallback(() => {
    stopSound() // Stop audio when navigating
    setCurrentIndex((prev) => (prev - 1 + category.items.length) % category.items.length)
    setBouncing(true)
    setTimeout(() => setBouncing(false), 300)
  }, [category.items.length, stopSound])

  const handlePlaySound = useCallback(() => {
    setBouncing(true)
    playSound(currentItem)
    // Reset bouncing after animation
    setTimeout(() => {
      setBouncing(false)
    }, 300)
  }, [currentItem, playSound])

  const handleSpeak = useCallback(() => {
    setIsSpeaking(true)
    setBouncing(true)
    speakName(currentItem.name)
    // Reset state after animation
    setTimeout(() => {
      setIsSpeaking(false)
      setBouncing(false)
    }, 1200)
  }, [currentItem.name, speakName])

  // Get category-specific colors
  const getCategoryColor = () => {
    switch (category.id) {
      case 'vehicles':
        return 'bg-vehicles'
      case 'instruments':
        return 'bg-instruments'
      case 'animals':
        return 'bg-animals'
      default:
        return 'bg-primary'
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background no-select">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Link
          href="/"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md transition-transform active:scale-95"
          aria-label="Back to categories"
        >
          <Home className="h-7 w-7" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{category.emoji}</span>
          <h1 className="text-xl font-bold text-foreground">{category.name}</h1>
        </div>
        <div className="h-14 w-14" /> {/* Spacer for centering */}
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-6">
        {/* Emoji display */}
        <div 
          className={`flex h-48 w-48 items-center justify-center rounded-3xl bg-card shadow-lg sm:h-64 sm:w-64 ${bouncing ? 'animate-bounce-gentle' : ''}`}
        >
          <span className="text-[100px] sm:text-[140px] leading-none">{currentItem.emoji}</span>
        </div>

        {/* Name label */}
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          {currentItem.name}
        </h2>

        {/* Sound buttons */}
        <div className="flex items-center gap-4">
          {/* Play real sound button */}
          <button
            onClick={handlePlaySound}
            className={`relative flex h-20 w-20 items-center justify-center rounded-full ${getCategoryColor()} text-white shadow-lg transition-all active:scale-95 sm:h-24 sm:w-24`}
            aria-label={isPlaying ? `Pause ${currentItem.name} sound` : `Play ${currentItem.name} sound`}
          >
            <Music className={`h-10 w-10 sm:h-12 sm:w-12 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying && (
              <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-30" />
            )}
          </button>

          {/* Speak name button */}
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className={`relative flex h-20 w-20 items-center justify-center rounded-full ${getCategoryColor()} text-white shadow-lg transition-all active:scale-95 disabled:opacity-70 sm:h-24 sm:w-24`}
            aria-label={`Say ${currentItem.name}`}
          >
            <Play className={`h-10 w-10 sm:h-12 sm:w-12 ${isSpeaking ? 'animate-pulse' : ''}`} />
            {isSpeaking && (
              <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-30" />
            )}
          </button>
        </div>

        {/* Progress indicator */}
        <p className="text-sm text-muted-foreground font-medium">
          {currentIndex + 1} / {category.items.length}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
          {category.items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                stopSound() // Stop audio when navigating via dots
                setCurrentIndex(idx)
                setBouncing(true)
                setTimeout(() => setBouncing(false), 300)
              }}
              className={`h-3 w-3 rounded-full transition-all ${
                idx === currentIndex ? `${getCategoryColor()} scale-125` : 'bg-muted hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to item ${idx + 1}`}
            />
          ))}
        </div>
      </main>

      {/* Navigation */}
      <footer className="flex items-center justify-center gap-8 p-4 pb-8">
        <button
          onClick={goPrevious}
          className="flex h-18 w-18 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-transform active:scale-95 sm:h-20 sm:w-20"
          aria-label="Previous"
        >
          <ChevronLeft className="h-10 w-10 sm:h-12 sm:w-12" />
        </button>
        <button
          onClick={goNext}
          className="flex h-18 w-18 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg transition-transform active:scale-95 sm:h-20 sm:w-20"
          aria-label="Next"
        >
          <ChevronRight className="h-10 w-10 sm:h-12 sm:w-12" />
        </button>
      </footer>
    </div>
  )
}
