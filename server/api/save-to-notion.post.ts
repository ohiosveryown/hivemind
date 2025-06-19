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
        }
      }
    })

    return {
      success: true,
      notionPageId: response.id
    }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to save to Notion'
    })
  }
})