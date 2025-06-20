export async function extractFaviconUrl(url: string): Promise<string> {
  try {
    // Parse the URL to get the domain
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    // Common favicon paths to try
    const faviconPaths = [
      '/favicon.ico',
      '/favicon.png',
      '/favicon-16x16.png',
      '/favicon-32x32.png',
      '/apple-touch-icon.png',
      '/apple-touch-icon-precomposed.png'
    ]

    // Try to fetch the HTML to look for favicon links
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HiveMind/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`)
    }

    const html = await response.text()

    // Look for favicon links in the HTML
    const faviconRegex = /<link[^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/gi
    const matches = [...html.matchAll(faviconRegex)]

    if (matches.length > 0) {
      const faviconHref = matches[0][1]

      // Handle relative URLs
      if (faviconHref.startsWith('http')) {
        return faviconHref
      } else if (faviconHref.startsWith('//')) {
        return `https:${faviconHref}`
      } else if (faviconHref.startsWith('/')) {
        return `${urlObj.protocol}//${domain}${faviconHref}`
      } else {
        return `${urlObj.protocol}//${domain}/${faviconHref}`
      }
    }

    // If no favicon found in HTML, try common paths
    for (const path of faviconPaths) {
      try {
        const faviconUrl = `${urlObj.protocol}//${domain}${path}`
        const faviconResponse = await fetch(faviconUrl, { method: 'HEAD' })
        if (faviconResponse.ok) {
          return faviconUrl
        }
      } catch (error) {
        // Continue to next path
        continue
      }
    }

    // Fallback to Google's favicon service
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`

  } catch (error) {
    console.warn('Failed to extract favicon for', url, error)

    // Fallback to Google's favicon service
    try {
      const urlObj = new URL(url)
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
    } catch {
      return ''
    }
  }
}