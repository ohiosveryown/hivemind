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

    const entries = response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.text?.content || 'Untitled',
      url: page.properties.URL?.url || '',
      summary: page.properties.Summary?.rich_text?.[0]?.text?.content || '',
      created: page.properties.Created?.created_time || page.created_time
    }))

    return { entries }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch entries'
    })
  }
})