<template>
  <div class="container">
    <header class="header">
      <h1>URL Summarizer</h1>
      <p>Enter a URL to get a 30-word summary powered by Claude AI</p>
    </header>

    <section class="form-section">
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <input
            v-model="url"
            type="url"
            placeholder="https://example.com/article"
            class="url-input"
            required
            :disabled="isLoading"
          />
          <button
            type="submit"
            class="submit-btn"
            :disabled="isLoading || !url.trim()"
          >
            <span
              v-if="isLoading"
              class="loading"
            >
              <div class="spinner"></div>
              Processing...
            </span>
            <span v-else>Summarize</span>
          </button>
        </div>
      </form>

      <div
        v-if="message.text"
        :class="['message', message.type]"
      >
        {{ message.text }}
      </div>
    </section>

    <section class="entries-section">
      <h2>Recent Summaries</h2>

      <!-- Loading state -->
      <div
        v-if="pending"
        class="loading-entries"
      >
        <div class="spinner"></div>
        Loading summaries...
      </div>

      <!-- Error state -->
      <div
        v-if="error"
        class="error-message"
      >
        Failed to load summaries. Please refresh the page.
      </div>

      <!-- Entries grid -->
      <div
        v-else-if="data?.entries && data.entries.length > 0"
        class="entries-grid"
      >
        <div
          v-for="entry in data.entries"
          :key="entry.id"
          class="entry-card"
        >
          <h3 class="entry-title">{{ entry.title }}</h3>
          <a
            :href="entry.url"
            target="_blank"
            class="entry-url"
          >
            {{ entry.url }}
          </a>
          <p class="entry-summary">{{ entry.summary }}</p>
          <small class="entry-date">
            {{ formatDate(entry.created) }}
          </small>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="no-entries"
      >
        No summaries yet. Be the first to add one!
      </div>
    </section>
  </div>
</template>

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

    // Remove the "..." suffix that we add in the API
    const cleanContent = content.replace(/\s*\.\.\.$/, '')

    // Split into sentences and find the first meaningful one
    const sentences = cleanContent
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 10)

    if (sentences.length === 0) return ''

    // Take the first sentence, clean it up, and limit length
    const title = sentences[0]
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .substring(0, 100)

    return title
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString()
  }
</script>

<style scoped>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      sans-serif;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .header h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .header p {
    color: #666;
    font-size: 1.1rem;
  }

  .form-section {
    margin-bottom: 3rem;
  }

  .input-group {
    display: flex;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .url-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .url-input:focus {
    outline: none;
    border-color: #007bff;
  }

  .submit-btn {
    padding: 0.75rem 1.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    white-space: nowrap;
  }

  .submit-btn:hover:not(:disabled) {
    background: #0056b3;
  }

  .submit-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .message {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    text-align: center;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .message.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .entries-section h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .loading-entries {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    color: #666;
    font-size: 1.1rem;
  }

  .error-message {
    text-align: center;
    padding: 2rem;
    color: #721c24;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    margin: 0 auto;
    max-width: 600px;
  }

  .entries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .entry-card {
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .entry-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .entry-title {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.2rem;
    line-height: 1.4;
  }

  .entry-url {
    display: block;
    color: #007bff;
    text-decoration: none;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    word-break: break-all;
  }

  .entry-url:hover {
    text-decoration: underline;
  }

  .entry-summary {
    color: #555;
    line-height: 1.6;
    margin: 0 0 1rem 0;
  }

  .entry-date {
    color: #888;
    font-size: 0.85rem;
  }

  .no-entries {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.1rem;
    background: #f8f9fa;
    border-radius: 12px;
    border: 2px dashed #dee2e6;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .input-group {
      flex-direction: column;
    }

    .entries-grid {
      grid-template-columns: 1fr;
    }

    .header h1 {
      font-size: 2rem;
    }
  }
</style>
