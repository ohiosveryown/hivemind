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
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Please summarize the following web page content in exactly 30 words or less. Focus on the main topic and key points:\n\n${textContent}`
      }]
    })

    const summary = message.content[0].type === 'text' ? message.content[0].text : ''

    return {
      url,
      summary: summary.trim(),
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