import { Client } from '@notionhq/client'
import { extractFaviconUrl } from '~/utils/faviconExtractor'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()

    const notion = new Client({
      auth: config.notionApiKey
    })

    // Get all entries
    const response = await notion.databases.query({
      database_id: config.notionDatabaseId,
      page_size: 100
    })

    const results = []

    for (const page of response.results) {
      // Type guard to ensure we have a page with properties
      if ('properties' in page && page.properties) {
        const urlProperty = page.properties.URL
        const faviconProperty = page.properties.Favicon

        const url = urlProperty?.type === 'url' ? urlProperty.url : null
        const existingFavicon = faviconProperty?.type === 'url' ? faviconProperty.url : null

        if (url && !existingFavicon) {
          try {
            // Extract favicon
            const faviconUrl = await extractFaviconUrl(url as string)

            // Update the page with favicon
            await notion.pages.update({
              page_id: page.id,
              properties: {
                'Favicon': {
                  url: faviconUrl || null
                }
              }
            })

            results.push({
              id: page.id,
              url,
              faviconUrl,
              success: true
            })

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100))

          } catch (error: any) {
            console.error(`Failed to update favicon for ${url}:`, error)
            results.push({
              id: page.id,
              url,
              faviconUrl: '',
              success: false,
              error: error?.message || 'Unknown error'
            })
          }
        }
      }
    }

    return {
      success: true,
      updated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to migrate favicons'
    })
  }
})