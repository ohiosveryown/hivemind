import { Client } from '@notionhq/client'
import { extractFaviconUrl } from '~/utils/faviconExtractor'

export default defineEventHandler(async (event) => {
  try {
    const { url, summary, title, keyPoints } = await readBody(event)
    const config = useRuntimeConfig()

    if (!url || !summary) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL and summary are required'
      })
    }

    // Extract favicon URL
    let faviconUrl = ''
    try {
      faviconUrl = await extractFaviconUrl(url)
    } catch (faviconError) {
      console.warn('Failed to extract favicon:', faviconError)
      // Continue without favicon if extraction fails
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
                content: keyPoints && keyPoints.length > 0 ? keyPoints.join('\n') : ''
              }
            }
          ]
        },
        'Tags': {
          multi_select: tags.map(tag => ({ name: tag }))
        },
        'Favicon': {
          url: faviconUrl || null
        }
      }
    })

    return {
      success: true,
      notionPageId: response.id,
      tags,
      faviconUrl
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to save to Notion'
    })
  }
})