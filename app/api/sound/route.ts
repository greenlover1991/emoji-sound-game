import { NextRequest, NextResponse } from 'next/server'

// Cache for sound URLs to avoid repeated API calls
const urlCache = new Map<string, string>()

export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get('file')
  
  if (!filename) {
    return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 })
  }

  try {
    // Check cache first
    let audioUrl = urlCache.get(filename)
    
    // If not in cache, fetch from Wikimedia API
    if (!audioUrl) {
      const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      // Extract the URL from the API response
      const pages = data.query?.pages
      if (pages) {
        const pageId = Object.keys(pages)[0]
        audioUrl = pages[pageId]?.imageinfo?.[0]?.url
        
        if (audioUrl) {
          // Cache the URL
          urlCache.set(filename, audioUrl)
        } else {
          return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }
      } else {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }
    }
    
    // Fetch the audio file from the URL
    const audioResponse = await fetch(audioUrl)
    
    if (!audioResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 500 })
    }
    
    // Stream the audio file with appropriate headers
    return new NextResponse(audioResponse.body, {
      headers: {
        'Content-Type': audioResponse.headers.get('Content-Type') || 'audio/ogg',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error fetching sound:', error)
    return NextResponse.json({ error: 'Failed to fetch sound' }, { status: 500 })
  }
}
