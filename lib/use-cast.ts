'use client'

import { useEffect, useCallback, useRef, useState } from 'react'

export interface CastDevice {
  id: string
  name: string
  displayName: string
  type: string
}

export interface CastState {
  isInitialized: boolean
  isConnected: boolean
  isConnecting: boolean
  selectedDevice: CastDevice | null
  availableDevices: CastDevice[]
  error: string | null
}

export function useCast() {
  const castContextRef = useRef<any>(null)
  const sessionRef = useRef<any>(null)
  const [state, setState] = useState<CastState>({
    isInitialized: false,
    isConnected: false,
    isConnecting: false,
    selectedDevice: null,
    availableDevices: [],
    error: null,
  })

  // Initialize Cast Context
  useEffect(() => {
    const initializeCast = () => {
      if ((window as any).chrome && (window as any).chrome.cast) {
        console.log('[v0] Cast API available, initializing...')
        
        const sessionRequest = new (window as any).chrome.cast.SessionRequest(
          (window as any).chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
        )

        const apiConfig = new (window as any).chrome.cast.ApiConfig(
          sessionRequest,
          onSessionJoined,
          onReceiversUpdated,
          (window as any).chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        )

        ;(window as any).chrome.cast.initialize(
          apiConfig,
          () => {
            console.log('[v0] Cast API initialized')
            setState((prev) => ({ ...prev, isInitialized: true }))
          },
          (error) => {
            console.log('[v0] Cast initialization error:', error)
            setState((prev) => ({ 
              ...prev, 
              error: 'Failed to initialize Cast API' 
            }))
          }
        )
      } else {
        console.log('[v0] Cast API not available')
        setState((prev) => ({ 
          ...prev, 
          error: 'Cast API not available in this browser' 
        }))
      }
    }

    const onSessionJoined = (session: any) => {
      console.log('[v0] Cast session joined:', session.displayName)
      sessionRef.current = session
      setState((prev) => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        error: null,
      }))

      session.addUpdateListener(() => {
        if (session.status === (window as any).chrome.cast.SessionStatus.STOPPED) {
          console.log('[v0] Cast session stopped')
          sessionRef.current = null
          setState((prev) => ({
            ...prev,
            isConnected: false,
          }))
        }
      })
    }

    const onReceiversUpdated = (receivers: any[]) => {
      console.log('[v0] Cast receivers updated:', receivers.length)
      const devices: CastDevice[] = receivers.map((receiver) => ({
        id: receiver.id,
        name: receiver.friendlyName,
        displayName: receiver.friendlyName,
        type: receiver.deviceType,
      }))
      
      setState((prev) => ({
        ...prev,
        availableDevices: devices,
      }))
    }

    // Load Cast SDK script
    const script = document.createElement('script')
    script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js'
    script.async = true
    script.onload = () => {
      console.log('[v0] Cast SDK script loaded')
      // Wait for gapi to be ready
      setTimeout(initializeCast, 1000)
    }
    script.onerror = () => {
      console.log('[v0] Failed to load Cast SDK script')
      setState((prev) => ({ 
        ...prev, 
        error: 'Failed to load Cast SDK' 
      }))
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (sessionRef.current) {
        try {
          sessionRef.current.stop(
            () => console.log('[v0] Cast session stopped on cleanup'),
            (error: any) => console.log('[v0] Error stopping Cast session:', error)
          )
        } catch (e) {
          console.log('[v0] Cleanup error:', e)
        }
      }
    }
  }, [])

  // Connect to a device
  const connectToDevice = useCallback((device: CastDevice) => {
    if (!state.isInitialized) {
      setState((prev) => ({ 
        ...prev, 
        error: 'Cast API not initialized' 
      }))
      return
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    const receiver = new (window as any).chrome.cast.Receiver(
      device.id,
      device.displayName
    )

    const sessionRequest = new (window as any).chrome.cast.SessionRequest(
      (window as any).chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    )

    ;(window as any).chrome.cast.requestSession(
      (session: any) => {
        console.log('[v0] Connected to Cast device:', device.displayName)
        sessionRef.current = session
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          selectedDevice: device,
          error: null,
        }))
        // Store selected device in localStorage
        localStorage.setItem('castDevice', JSON.stringify(device))
      },
      (error: any) => {
        console.log('[v0] Cast connection error:', error)
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: error.code || 'Failed to connect to device',
        }))
      }
    )
  }, [state.isInitialized])

  // Disconnect from device
  const disconnectDevice = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.stop(
        () => {
          console.log('[v0] Disconnected from Cast device')
          sessionRef.current = null
          setState((prev) => ({
            ...prev,
            isConnected: false,
            selectedDevice: null,
            error: null,
          }))
          localStorage.removeItem('castDevice')
        },
        (error: any) => {
          console.log('[v0] Error disconnecting:', error)
          setState((prev) => ({
            ...prev,
            error: 'Failed to disconnect',
          }))
        }
      )
    }
  }, [])

  // Cast audio to device
  const castAudio = useCallback(
    async (audioUrl: string, metadata: { name: string; emoji: string }) => {
      if (!sessionRef.current) {
        console.log('[v0] No active Cast session')
        return false
      }

      try {
        const mediaInfo = new (window as any).chrome.cast.media.MediaInfo(
          audioUrl,
          'audio/mpeg'
        )
        mediaInfo.metadata = new (window as any).chrome.cast.media.GenericMediaMetadata()
        mediaInfo.metadata.title = metadata.name
        mediaInfo.metadata.subtitle = metadata.emoji

        const request = new (window as any).chrome.cast.media.LoadRequest(mediaInfo)
        request.autoplay = true

        return new Promise((resolve) => {
          sessionRef.current.media[0]?.stop(
            () => {
              sessionRef.current.loadMedia(
                request,
                () => {
                  console.log('[v0] Audio cast successfully')
                  resolve(true)
                },
                (error: any) => {
                  console.log('[v0] Error casting audio:', error)
                  resolve(false)
                }
              )
            },
            () => {
              // No existing media, just load new
              sessionRef.current.loadMedia(
                request,
                () => {
                  console.log('[v0] Audio cast successfully')
                  resolve(true)
                },
                (error: any) => {
                  console.log('[v0] Error casting audio:', error)
                  resolve(false)
                }
              )
            }
          )
        })
      } catch (error) {
        console.log('[v0] Cast error:', error)
        return false
      }
    },
    []
  )

  // Restore previously selected device on mount
  useEffect(() => {
    const savedDevice = localStorage.getItem('castDevice')
    if (savedDevice && state.isInitialized && !state.isConnected) {
      try {
        const device = JSON.parse(savedDevice)
        // Check if device is still in available devices
        const isAvailable = state.availableDevices.some((d) => d.id === device.id)
        if (isAvailable) {
          console.log('[v0] Restoring previously selected Cast device')
          setState((prev) => ({ ...prev, selectedDevice: device }))
        }
      } catch (e) {
        console.log('[v0] Error restoring saved device:', e)
        localStorage.removeItem('castDevice')
      }
    }
  }, [state.isInitialized, state.availableDevices, state.isConnected])

  return {
    ...state,
    connectToDevice,
    disconnectDevice,
    castAudio,
  }
}
