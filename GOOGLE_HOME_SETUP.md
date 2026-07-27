# Google Home Integration Guide

## Overview

Your Emoji Sound Playground now supports Google Cast! When a compatible Google Home speaker is on your network, you can play sounds directly on the speaker instead of through your device's speakers.

## Features

✅ **Device Discovery** - Automatically discovers Google Cast devices on your local network
✅ **Easy Pairing** - Simple one-click setup in the Settings page
✅ **Visual Indicators** - See connection status at a glance with icons and indicators
✅ **Fallback Support** - Automatically falls back to local audio if Cast fails
✅ **Persistent Pairing** - Remembers your selected device between sessions

## How to Use

### Initial Setup

1. Open the app and tap the **Settings icon** (gear) in the top-right corner
2. Wait for the app to scan for Google Cast devices on your network
3. When your device appears in the "Available Devices" list, tap it to connect
4. You should see "Connected" status once paired

### Playing Sounds on Google Home

1. Once connected, go back to the main game
2. Select a category (Vehicles, Instruments, or Animals)
3. Click the **Play Sound button** (music note icon)
4. The sound will play on your connected Google Home speaker!

### Connection Status Indicators

- **Settings Button with Green Dot** - Connected to Google Home
- **Settings Button (no dot)** - Not connected
- **Tooltip on Play Button** - Hovers to show "Playing on Google Home" or "Playing locally"

### Disconnecting

1. Go to Settings
2. If connected, tap the "Disconnect" button to disconnect from your device
3. Sounds will then play locally on your device

## Technical Details

### Architecture

The implementation uses three main components:

**1. Cast Service Hook (`lib/use-cast.ts`)**
- Manages Google Cast SDK initialization
- Handles device discovery and connection
- Provides `castAudio()` method to send audio to Cast devices
- Stores device selection in localStorage for persistence

**2. Enhanced Sound Hook (`lib/use-sound.ts`)**
- Extended to support Cast playback
- Intelligently detects connected Cast device
- Attempts Cast playback first, falls back to local audio if needed
- Maintains compatibility with existing sound features

**3. Settings Page (`app/settings/page.tsx`)**
- User-friendly interface for device pairing
- Shows available devices on network
- Displays connection status
- Includes setup instructions and troubleshooting info

**4. Navigation Updates**
- `components/emoji-player.tsx` - Added settings button and Cast status indicator
- `components/category-selector.tsx` - Added settings button to home page
- `app/layout.tsx` - Added Cast SDK script initialization

### Cast Flow

```
User clicks Play Button
    ↓
useSound checks if Cast device is connected
    ↓
If Connected:
    → castAudio() sends audio to Google Home
    → If successful: audio plays on speaker ✓
    → If failed: falls back to local audio
    ↓
If Not Connected:
    → Audio plays locally on device
```

## Requirements

✅ **Browser Support**: Chrome, Edge, or any Chromium-based browser
✅ **Network**: Device and Google Home on same WiFi network
✅ **Google Home Device**: Any Google Cast-compatible device (Google Home, Nest Mini, etc.)
✅ **HTTPS**: Required in production (development uses HTTP)

## Troubleshooting

### No devices appearing?
- Ensure your Google Home device is powered on
- Check that both your device and Google Home are on the same WiFi network
- Try refreshing the Settings page
- Make sure Cast is enabled on your Google Home (check Google Home app settings)

### Sound plays locally instead of on speaker?
- Verify your Google Home is still connected to WiFi
- Check the Settings page for connection status
- Try reconnecting to the device
- Some audio formats may not be supported - try a different sound

### App won't find devices?
- This usually means Cast SDK couldn't initialize
- Try clearing browser cache and reloading
- Check if your browser is blocking any scripts
- Ensure you're using a Cast-compatible browser

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Fully supported |
| Edge | ✅ Full | Fully supported |
| Safari | ⚠️ Limited | Limited Cast support |
| Firefox | ⚠️ Limited | Limited Cast support |

## Privacy & Data

- Device information is stored locally in your browser (localStorage)
- No data is sent to external servers
- Device selection persists only on your device
- Clearing browser data will reset your pairing

## Advanced Configuration

### Change Default Receiver App

The app uses Google's DEFAULT_MEDIA_RECEIVER_APP_ID. To use a custom receiver app, modify `lib/use-cast.ts`:

```typescript
// Change this line:
chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID

// To your custom app ID:
'YOUR_CUSTOM_RECEIVER_APP_ID'
```

### Customize Connection Behavior

Edit `lib/use-cast.ts` to modify:
- Auto-join policy (currently ORIGIN_SCOPED)
- Connection timeout
- Device discovery timeout
- Retry logic

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all technical requirements are met
3. Try clearing your browser cache
4. Check browser console for error messages (F12 → Console tab)

## More Information

- [Google Cast Developer Documentation](https://developers.google.com/cast/docs/developers)
- [Google Cast Reference](https://developers.google.com/cast/docs/reference/web_sender)
- [Chrome Cast for Web](https://support.google.com/chromecast/answer/3040761)
