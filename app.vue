<template>
  <div>
    <header>
      <h1>URL Summarizer</h1>
      <p>Enter a URL to get a 30-word summary powered by Claude AI</p>
    </header>

    <section>
      <form @submit.prevent="handleSubmit">
        <div>
          <input
            v-model="url"
            type="url"
            placeholder="https://example.com/article"
            required
            :disabled="isLoading"
          />
          <button
            type="submit"
            :disabled="isLoading || !url.trim()"
          >
            <span v-if="isLoading">
              <div></div>
              Processing...
            </span>
            <span v-else>Summarize</span>
          </button>
        </div>
      </form>

      <div v-if="message.text">
        {{ message.text }}
      </div>
    </section>

    <section>
      <h2>Recent Summaries</h2>

      <!-- Loading state -->
      <div v-if="pending">
        <div></div>
        Loading summaries...
      </div>

      <!-- Error state -->
      <div v-if="error">Failed to load summaries. Please refresh the page.</div>

      <!-- Entries grid -->
      <div v-else-if="data?.entries && data.entries.length > 0">
        <div
          v-for="entry in data.entries"
          :key="entry.id"
        >
          <h3>{{ entry.title }}</h3>
          <a
            :href="entry.url"
            target="_blank"
          >
            {{ entry.url }}
          </a>
          <p>{{ entry.summary }}</p>
          <small>
            {{ formatDate(entry.created) }}
          </small>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else>No summaries yet. Be the first to add one!</div>
    </section>
  </div>
</template>

<style scoped></style>

<script setup>
  const url = ref('')
  const isLoading = ref(false)
  const message = ref({ text: '', type: '' })

  // Use useFetch for reactive data fetching with loading states
  const { data, pending, error, refresh } = await useFetch('/api/entries')

  const handleSubmit = async () => {
    if (!url.value.trim()) return

    isLoading.value = true
    message.value = { text: '', type: '' }

    try {
      // Step 1: Summarize the URL
      const summaryResult = await $fetch('/api/summarize', {
        method: 'POST',
        body: { url: url.value },
      })

      // Step 2: Save to Notion
      await $fetch('/api/save-to-notion', {
        method: 'POST',
        body: {
          url: summaryResult.url,
          summary: summaryResult.summary,
          title:
            summaryResult.h1Content ||
            extractTitle(summaryResult.content) ||
            summaryResult.url,
        },
      })

      // Step 3: Refresh entries
      await refresh()

      // Clear form
      url.value = ''
    } catch (error) {
      message.value = {
        text: error.data?.message || 'Failed to process URL. Please try again.',
        type: 'error',
      }
    } finally {
      isLoading.value = false
    }
  }

  const extractTitle = (content) => {
    if (!content) return ''

    // First try to get a clean title from the content
    let title = content

    // Remove the "..." suffix that we add in the API
    title = title.replace(/\s*\.\.\.$/, '')

    // Remove common separators and everything after them
    const separators = ['|', '»', '–', '-', '•', ':', '｜']
    for (const separator of separators) {
      const parts = title.split(separator)
      if (parts.length > 1) {
        // Take the first part before the separator
        title = parts[0]
      }
    }

    // Clean up whitespace and normalize
    title = title
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .substring(0, 100) // Limit length

    return title
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString()
  }
</script>
