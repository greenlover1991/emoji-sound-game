'use client'

import { useCallback, useRef } from 'react'
import type { EmojiItem } from './emoji-data'

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback((item: EmojiItem) => {
    // Stop any currently playing sound
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    if (item.soundUrl) {
      console.log('[v0] Playing sound from:', item.soundUrl)
      
      // Create new audio element for the URL
      const audio = new Audio()
      audioRef.current = audio
      
      // Set up event handlers before setting src
      audio.oncanplaythrough = () => {
        console.log('[v0] Audio can play through, starting playback')
        audio.play().catch((error) => {
          console.log('[v0] Audio play failed:', error.name, error.message)
        })
      }
      
      audio.onerror = (e) => {
        console.log('[v0] Audio error:', audio.error?.message || 'Unknown error')
      }
      
      // Set source and load
      audio.src = item.soundUrl
      audio.load()
    }
  }, [])

  const speakName = useCallback((name: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(name)
    utterance.rate = 0.8 // Slower for toddlers
    utterance.pitch = 1.1 // Slightly higher pitch
    utterance.volume = 1.0
    
    // Try to use a friendly voice
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) 
      || voices.find(v => v.lang.startsWith('en'))
    if (englishVoice) {
      utterance.voice = englishVoice
    }
    
    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    window.speechSynthesis.cancel()
  }, [])

  return { playSound, speakName, stopSound }
}
