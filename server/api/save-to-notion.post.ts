import { Client } from '@notionhq/client'

export default defineEventHandler(async (event) => {
  try {
    const { url, summary, title } = await readBody(event)
    const config = useRuntimeConfig()

    if (!url || !summary) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL and summary are required'
      })
    }

    // Generate tags based on content
    let tags: string[] = []
    try {
      const tagResponse = await $fetch('/api/generate-tags', {
        method: 'POST',
        body: { title, summary }
      })
      tags = tagResponse.tags || []
    } catch (tagError) {
      console.warn('Failed to generate tags:', tagError)
      // Continue without tags if generation fails
    }

    // Extract key points from summary
    let keyPoints: string = ''
    try {
      const keyPointsResponse = await $fetch('/api/extract-key-points', {
        method: 'POST',
        body: { summary }
      })
      keyPoints = keyPointsResponse.keyPoints || ''
    } catch (keyPointsError) {
      console.warn('Failed to extract key points:', keyPointsError)
      // Continue without key points if extraction fails
    }

    // Initialize Notion client
    const notion = new Client({
      auth: config.notionApiKey
    })

    // Create page in Notion database
    const response = await notion.pages.create({
      parent: {
        database_id: config.notionDatabaseId
      },
      properties: {
        'Title': {
          title: [
            {
              text: {
                content: title || url
              }
            }
          ]
        },
        'URL': {
          url: url
        },
        'Summary': {
          rich_text: [
            {
              text: {
                content: summary
              }
            }
          ]
        },
        'Key Points': {
          rich_text: [
            {
              text: {
                content: keyPoints
              }
            }
          ]
        },
        'Tags': {
          multi_select: tags.map(tag => ({ name: tag }))
        }
      }
    })

    return {
      success: true,
      notionPageId: response.id,
      tags,
      keyPoints
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to save to Notion'
    })
  }
})