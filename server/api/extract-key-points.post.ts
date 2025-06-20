import Anthropic from '@anthropic-ai/sdk'

export default defineEventHandler(async (event) => {
  try {
    const { summary } = await readBody(event)
    const config = useRuntimeConfig()

    if (!summary) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Summary is required'
      })
    }

    // Initialize Claude API
    const anthropic = new Anthropic({
      apiKey: config.claudeApiKey
    })

    // Extract key points from the summary
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Extract 3-5 key points from the following summary. Format them as a simple bulleted list with concise, actionable points. Do not use any markdown formatting, bold, or special characters. Just use plain text with bullet points (•). Focus on the most important insights, facts, or takeaways:\n\n${summary}`
      }]
    })

    let keyPoints = message.content[0].type === 'text' ? message.content[0].text : ''

    // Clean up any markdown formatting that might have been added
    keyPoints = keyPoints
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
      .replace(/`(.*?)`/g, '$1') // Remove code formatting
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .trim()

    return {
      keyPoints: keyPoints
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : String(error) || 'Failed to extract key points'
    })
  }
})