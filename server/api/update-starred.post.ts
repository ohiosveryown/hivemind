import { Client } from '@notionhq/client'

export default defineEventHandler(async (event) => {
  try {
    const { entryId, starred } = await readBody(event)
    const config = useRuntimeConfig()

    if (entryId === undefined || starred === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Entry ID and starred status are required'
      })
    }

    // Initialize Notion client
    const notion = new Client({
      auth: config.notionApiKey
    })

    // Update the page with starred status
    await notion.pages.update({
      page_id: entryId,
      properties: {
        'Starred': {
          checkbox: starred
        }
      }
    })

    return {
      success: true,
      entryId,
      starred
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to update starred status'
    })
  }
})