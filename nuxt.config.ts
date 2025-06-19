export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["./assets/style/reset.scss"],
  runtimeConfig: {
    claudeApiKey: process.env.CLAUDE_API_KEY,
    notionApiKey: process.env.NOTION_API_KEY,
    notionDatabaseId: process.env.NOTION_DATABASE_ID,
  },
})