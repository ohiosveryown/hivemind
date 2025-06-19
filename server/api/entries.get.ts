import { Client } from '@notionhq/client'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()

    const notion = new Client({
      auth: config.notionApiKey
    })

    const response = await notion.databases.query({
      database_id: config.notionDatabaseId,
      sorts: [
        {
          property: 'Created',
          direction: 'descending'
        }
      ],
      page_size: 50
    })

    const entries = response.results.map((page: any) => {
      const createdTime = page.properties.Created?.created_time || page.created_time
      const createdDate = createdTime ? new Date(createdTime).toISOString().split('T')[0] : ''

      return {
        id: page.id,
        title: page.properties.Title?.title?.[0]?.text?.content || 'Untitled',
        url: page.properties.URL?.url || '',
        summary: page.properties.Summary?.rich_text?.[0]?.text?.content || '',
        created: createdDate
      }
    })

    return { entries }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch entries'
    })
  }
})