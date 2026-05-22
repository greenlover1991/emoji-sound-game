'use client'

import { useCallback, useRef, useState } from 'react'
import type { EmojiItem } from './emoji-data'

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentItemId, setCurrentItemId] = useState<string | null>(null)

  const playSound = useCallback((item: EmojiItem) => {
    const itemId = `${item.emoji}-${item.name}`
    
    // If the same item is playing, toggle pause/play
    if (currentItemId === itemId && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().catch((error) => {
          console.log('[v0] Audio play failed:', error.name, error.message)
        })
        setIsPlaying(true)
      }
      return
    }

    // Stop any currently playing sound
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    if (item.soundUrl) {
      console.log('[v0] Playing sound from:', item.soundUrl)
      
      // Extract filename from Wikimedia URL
      const filename = item.soundUrl.split('/').pop() || ''
      
      // Create new audio element for the URL
      const audio = new Audio()
      audioRef.current = audio
      setCurrentItemId(itemId)
      
      // Set up event handlers before setting src
      audio.oncanplaythrough = () => {
        console.log('[v0] Audio can play through, starting playback')
        audio.play().catch((error) => {
          console.log('[v0] Audio play failed:', error.name, error.message)
        })
        setIsPlaying(true)
      }
      
      audio.onended = () => {
        console.log('[v0] Audio ended')
        setIsPlaying(false)
      }
      
      audio.onerror = (e) => {
        console.log('[v0] Audio error:', audio.error?.message || 'Unknown error')
        setIsPlaying(false)
      }
      
      // Use your proxy route instead of direct Wikimedia URL
      audio.src = `/api/sound?file=${encodeURIComponent(filename)}`
      audio.load()
    }
  }, [isPlaying, currentItemId])

  const speakName = useCallback((name: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(name)
    utterance.rate = 0.8 // Slower for toddlers
    utterance.pitch = 1.1 // Slightly higher pitch
    utterance.volume = 1.0
    
    // Try to use English UK voice
    const voices = window.speechSynthesis.getVoices()
    const ukVoice = voices.find(v => v.lang === 'en-GB') 
      || voices.find(v => v.lang.startsWith('en-GB'))
      || voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) 
      || voices.find(v => v.lang.startsWith('en'))
    if (ukVoice) {
      utterance.voice = ukVoice
    }
    
    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentItemId(null)
    window.speechSynthesis.cancel()
  }, [])

  return { playSound, speakName, stopSound, isPlaying }
}
