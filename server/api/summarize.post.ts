import Anthropic from '@anthropic-ai/sdk'
import { fetchUrlContent } from '~/utils/urlFetcher'

export default defineEventHandler(async (event) => {
  try {
    const { url } = await readBody(event)
    const config = useRuntimeConfig()

    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL is required'
      })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid URL format'
      })
    }

    // Fetch URL content
    const { textContent, h1Content } = await fetchUrlContent(url)

    // Initialize Claude API
    const anthropic = new Anthropic({
      apiKey: config.claudeApiKey
    })

    // Get summary from Claude
    const summaryMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Please summarize the following web page content in exactly 30 words or less. Focus on the main topic and key points:\n\n${textContent}`
      }]
    })

    const summary = summaryMessage.content[0].type === 'text' ? summaryMessage.content[0].text : ''

    // Get key points from Claude
    const keyPointsMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Extract exactly 2-3 key points from the following web page content. Each point should be concise (max 15 words) and highlight the most important insights or takeaways. Format as a simple list:\n\n${textContent}`
      }]
    })

    const keyPointsText = keyPointsMessage.content[0].type === 'text' ? keyPointsMessage.content[0].text : ''

    // Parse key points into an array
    const keyPoints = keyPointsText
      .split('\n')
      .map(point => point.replace(/^[-•*]\s*/, '').trim()) // Remove bullet points
      .filter(point => point.length > 0 && point.length <= 50) // Filter valid points
      .slice(0, 3) // Take max 3 points

    return {
      url,
      summary: summary.trim(),
      keyPoints,
      content: textContent.substring(0, 200) + '...', // Preview for title extraction
      h1Content
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : String(error) || 'Failed to summarize URL'
    })
  }
})