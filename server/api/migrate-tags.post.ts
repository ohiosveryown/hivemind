import { Client } from '@notionhq/client'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()

    // Initialize Notion client
    const notion = new Client({
      auth: config.notionApiKey
    })

    // Fetch all existing entries
    const response = await notion.databases.query({
      database_id: config.notionDatabaseId,
      page_size: 100 // Adjust if you have more than 100 entries
    })

    const results = []
    const errors = []

    // Process each entry
    for (const page of response.results) {
      try {
        // Type assertion for page properties
        const pageProperties = (page as any).properties

        const title = pageProperties.Title?.title?.[0]?.text?.content || ''
        const summary = pageProperties.Summary?.rich_text?.[0]?.text?.content || ''
        const url = pageProperties.URL?.url || ''

        // Generate new tags using the improved system
        const tagResponse = await $fetch('/api/generate-tags', {
          method: 'POST',
          body: { title, summary, content: summary } // Use summary as content
        })

        const newTags = tagResponse.tags || []

        // Update the page with new tags
        await notion.pages.update({
          page_id: page.id,
          properties: {
            'Tags': {
              multi_select: newTags.map(tag => ({ name: tag }))
            }
          }
        })

        results.push({
          id: page.id,
          title,
          oldTags: pageProperties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
          newTags,
          url
        })

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error: any) {
        errors.push({
          id: page.id,
          title: (page as any).properties.Title?.title?.[0]?.text?.content || 'Unknown',
          error: error.message
        })
      }
    }

    return {
      success: true,
      processed: results.length,
      errors: errors.length,
      results,
      errorDetails: errors
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to migrate tags'
    })
  }
})