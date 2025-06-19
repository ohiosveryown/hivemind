export async function fetchUrlContent(url: string): Promise<{ textContent: string; h1Content: string }> {
  try {
    const response = await fetch(url)
    const html = await response.text()

    // Extract H1 content first
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i)
    const h1Content = h1Match
      ? h1Match[1].replace(/<[^>]*>/g, '').trim()
      : ''

    // Basic HTML content extraction
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Return first 2000 characters for summarization
    return {
      textContent: textContent.substring(0, 2000),
      h1Content
    }
  } catch (error) {
    throw new Error(`Failed to fetch URL content: ${error instanceof Error ? error.message : String(error)}`)
  }
}