import { NextRequest, NextResponse } from 'next/server'

// Cache for sound URLs to avoid repeated API calls
const urlCache = new Map<string, string>()

export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get('file')
  
  if (!filename) {
    return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 })
  }

  // Check cache first
  if (urlCache.has(filename)) {
    return NextResponse.json({ url: urlCache.get(filename) })
  }

  try {
    // Use Wikimedia API to get the actual file URL
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`
    
    const response = await fetch(apiUrl)
    const data = await response.json()
    
    // Extract the URL from the API response
    const pages = data.query?.pages
    if (pages) {
      const pageId = Object.keys(pages)[0]
      const url = pages[pageId]?.imageinfo?.[0]?.url
      
      if (url) {
        // Cache the URL
        urlCache.set(filename, url)
        return NextResponse.json({ url })
      }
    }
    
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching sound URL:', error)
    return NextResponse.json({ error: 'Failed to fetch sound' }, { status: 500 })
  }
}
