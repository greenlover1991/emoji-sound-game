'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import type { EmojiItem } from './emoji-data'
import { useCast } from './use-cast'

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudioItem, setCurrentAudioItem] = useState<EmojiItem | null>(null)
  const { isConnected, castAudio } = useCast()

  // Initialize the audio element on mount
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio()
      audio.preload = 'none'
      audioRef.current = audio

      // Set up event handlers
      audio.onplay = () => setIsPlaying(true)
      audio.onpause = () => setIsPlaying(false)
      audio.onended = () => {
        setIsPlaying(false)
        setCurrentAudioItem(null)
      }
      audio.onerror = (e) => {
        console.log('[v0] Audio error:', audio.error?.message || 'Unknown error')
        setIsPlaying(false)
      }
    }

    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  const playSound = useCallback((item: EmojiItem) => {
    if (!audioRef.current) return

    // If the same item is playing, toggle pause/play
    if (currentAudioItem?.name === item.name) {
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
    if (audioRef.current.src) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    if (item.soundUrl) {
      console.log('[v0] Playing sound from:', item.soundUrl)
      
      // Extract filename from Wikimedia URL
      const filename = item.soundUrl.split('/').pop() || ''
      const audioUrl = `/api/sound?file=${encodeURIComponent(filename)}`
      
      setCurrentAudioItem(item)
      setIsPlaying(true)

      // Helper to play audio locally
      const playAudioLocally = () => {
        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.load()
          audioRef.current.play().catch((error) => {
            console.log('[v0] Audio play failed:', error.name, error.message)
            setIsPlaying(false)
          })
        }
      }

      // If Cast device is connected, try to cast first
      if (isConnected) {
        console.log('[v0] Casting to Google Home...')
        castAudio(audioUrl, {
          name: item.name,
          emoji: item.emoji,
        }).then((success) => {
          if (!success) {
            console.log('[v0] Cast failed, falling back to local audio')
            playAudioLocally()
          }
        })
      } else {
        // No Cast device, play locally
        playAudioLocally()
      }
    }
  }, [isPlaying, currentAudioItem, isConnected, castAudio])

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
    }
    setIsPlaying(false)
    setCurrentAudioItem(null)
    window.speechSynthesis.cancel()
  }, [])

  return { playSound, speakName, stopSound, isPlaying }
}
