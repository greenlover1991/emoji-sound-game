'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Home, Wifi, WifiOff, Loader, Trash2 } from 'lucide-react'
import { useCast, type CastDevice } from '@/lib/use-cast'

export default function SettingsPage() {
  const {
    isInitialized,
    isConnected,
    isConnecting,
    selectedDevice,
    availableDevices,
    error,
    connectToDevice,
    disconnectDevice,
  } = useCast()

  const [isLoading, setIsLoading] = useState(!isInitialized)

  useEffect(() => {
    if (isInitialized) {
      setIsLoading(false)
    }
  }, [isInitialized])

  const handleConnectDevice = (device: CastDevice) => {
    connectToDevice(device)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-muted">
        <Link
          href="/"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md transition-transform active:scale-95"
          aria-label="Back to home"
        >
          <Home className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Google Home Settings</h1>
        <div className="h-12 w-12" /> {/* Spacer for centering */}
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col gap-6 p-6 pb-12">
        {/* Status section */}
        <div className="rounded-2xl bg-card p-6 shadow-sm border border-muted">
          <h2 className="text-lg font-semibold text-foreground mb-4">Connection Status</h2>
          
          <div className="flex items-center gap-3 mb-4">
            {isConnected ? (
              <>
                <Wifi className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium text-green-600">Connected</p>
                  <p className="text-sm text-muted-foreground">{selectedDevice?.displayName}</p>
                </div>
              </>
            ) : isConnecting ? (
              <>
                <Loader className="h-6 w-6 text-blue-500 animate-spin" />
                <p className="font-medium text-blue-600">Connecting...</p>
              </>
            ) : (
              <>
                <WifiOff className="h-6 w-6 text-muted-foreground" />
                <p className="font-medium text-muted-foreground">Not connected</p>
              </>
            )}
          </div>

          {isConnected && (
            <button
              onClick={disconnectDevice}
              className="w-full px-4 py-2 rounded-lg bg-red-500 text-white font-medium transition-colors hover:bg-red-600 active:scale-95"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-2xl bg-red-50 p-4 border border-red-200">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Available devices section */}
        <div className="rounded-2xl bg-card p-6 shadow-sm border border-muted">
          <h2 className="text-lg font-semibold text-foreground mb-4">Available Devices</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-3 text-muted-foreground">Scanning for devices...</span>
            </div>
          ) : availableDevices.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No Cast devices found on your network.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure your Google Home device is turned on and connected to the same WiFi network.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableDevices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleConnectDevice(device)}
                  disabled={isConnecting}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedDevice?.id === device.id
                      ? 'border-primary bg-primary/10'
                      : 'border-muted bg-background hover:border-primary/50'
                  } ${isConnecting ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{device.displayName}</p>
                      <p className="text-xs text-muted-foreground">{device.type}</p>
                    </div>
                    {selectedDevice?.id === device.id && isConnected && (
                      <Wifi className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Instructions section */}
        <div className="rounded-2xl bg-blue-50 p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">How to Set Up</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0">1.</span>
              <span>Ensure your Google Home device is on and connected to WiFi</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0">2.</span>
              <span>Wait for the device to appear in the list above</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0">3.</span>
              <span>Tap on the device to connect</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold flex-shrink-0">4.</span>
              <span>Go back home and tap play to hear sounds on your speaker</span>
            </li>
          </ol>
        </div>

        {/* Cast info section */}
        <div className="rounded-2xl bg-muted/30 p-6 border border-muted">
          <h3 className="font-semibold text-foreground mb-2">About Google Cast</h3>
          <p className="text-sm text-muted-foreground">
            When connected, sounds will play on your Google Home speaker instead of your device. Your browser tab must stay open for casting to work. The speaker must be on the same WiFi network as your device.
          </p>
        </div>
      </main>
    </div>
  )
}
