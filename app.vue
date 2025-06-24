<template>
  <div class="container">
    <header>
      <div class="logo">
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1750450902/hivemind/bee-1_exhzoz.webp"
          alt=""
          class="bee bee-1"
        />
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/a_hflip/hivemind/bee-2_de2izh"
          alt=""
          class="bee bee-2"
        />
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1750450904/hivemind/bee-3_zn97nk.webp"
          alt=""
          class="bee bee-3"
        />
        <img
          src="https://res.cloudinary.com/dn1q8h2ga/image/upload/v1750451525/hivemind/hive_2x_jeezh8.webp"
          alt=""
          class="hive"
        />
      </div>

      <h1>HiveMind</h1>
      <h2>
        It's like having a book report buddy do all the reading and tell you the
        important parts.
      </h2>
    </header>

    <section class="form">
      <form @submit.prevent="handleSubmit">
        <input
          v-model="url"
          type="url"
          placeholder="Add URL..."
          required
          :disabled="isLoading"
        />
        <button
          class="primary"
          type="submit"
          :disabled="isLoading || !url.trim()"
        >
          <span v-if="isLoading">
            <div></div>
            Processing...
          </span>
          <span
            class="button-wrapper"
            v-else
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
            >
              <g filter="url(#a)">
                <path
                  fill="#fff"
                  d="M8.75 3v4.25H13v1.5H8.75V13h-1.5V8.75H3v-1.5h4.25V3h1.5Z"
                />
              </g>
              <defs>
                <filter
                  id="a"
                  width="14"
                  height="14"
                  x="1"
                  y="2"
                  color-interpolation-filters="sRGB"
                  filterUnits="userSpaceOnUse"
                >
                  <feFlood
                    flood-opacity="0"
                    result="BackgroundImageFix"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  />
                  <feOffset dy="1" />
                  <feGaussianBlur stdDeviation="1" />
                  <feComposite
                    in2="hardAlpha"
                    operator="out"
                  />
                  <feColorMatrix
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                  />
                  <feBlend
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_27_2141"
                  />
                  <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_27_2141"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
            <span class="button-label">Add</span>
          </span>
        </button>
      </form>

      <div v-if="message.text">
        {{ message.text }}
      </div>
    </section>

    <section>
      <!-- Loading state -->
      <div v-if="pending">
        <div></div>
        Loading summaries...
      </div>

      <!-- Error state -->
      <div v-if="error">Failed to load summaries. Please refresh the page.</div>

      <!-- Table -->
      <table>
        <thead>
          <tr>
            <th class="table-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
              >
                <g fill="#55534E">
                  <path
                    d="M3.97 3.557h2.19l3.066 8.886H7.639l-.69-2H3.181l-.69 2H.904L3.97 3.557ZM3.7 8.943h2.733L5.09 5.057h-.052L3.7 8.943ZM13.596 7.264l.156-.373h1.344v5.552h-1.344l-.156-.637.004-.007a2.315 2.315 0 0 1-1.63.644c-1.46 0-2.624-1.21-2.624-2.908s1.165-2.909 2.625-2.909c.64 0 1.197.233 1.625.638Zm-2.75 2.268c0 .916.572 1.568 1.375 1.568s1.375-.652 1.375-1.568-.572-1.568-1.375-1.568-1.375.652-1.375 1.568Z"
                  />
                </g>
              </svg>
              Title
            </th>
            <th class="table-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
              >
                <path
                  fill="#55534E"
                  d="M14 3.25v1.5H2v-1.5h12ZM2 8.75h12v-1.5H2v1.5Zm0 4h6.3v-1.5H2v1.5Z"
                />
              </svg>
              Summary
            </th>
            <!-- <th class="table-header">
              <svg
                width="16"
                height="16"
                fill="none"
              >
                <path
                  fill="#55534E"
                  d="M5.5 4h5V2H12v2h2v10H2V4h2V2h1.5v2Zm-2 8.5h9V7h-9v5.5Z"
                />
              </svg>
              Date Added
            </th> -->
            <th class="table-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
              >
                <path
                  fill="#55534E"
                  d="M7.74 1.9c.33 0 .649.131.883.366l5.554 5.553a1.25 1.25 0 0 1 0 1.768l-4.59 4.59a1.25 1.25 0 0 1-1.768 0L2.265 8.623a1.25 1.25 0 0 1-.366-.884V3.15l.006-.128a1.252 1.252 0 0 1 1.116-1.117l.127-.006L7.74 1.9ZM3.397 3.4v4.236l5.305 5.304 4.237-4.237-5.305-5.305-4.237.001Zm1.52 1.519a1.07 1.07 0 1 1 1.515 1.514 1.07 1.07 0 0 1-1.514-1.514Z"
                />
              </svg>
              Tags
            </th>
          </tr>
        </thead>
        <tbody v-if="data?.entries && data.entries.length > 0">
          <tr
            v-for="entry in data.entries"
            :key="entry.id"
          >
            <td class="title">
              <img
                :src="entry.faviconUrl || getDefaultFavicon(entry.url)"
                :alt="`${entry.title} favicon`"
                :data-url="entry.url"
                class="favicon"
                @error="handleFaviconError"
              />
              <a
                :href="entry.url"
                target="_blank"
                rel="noopener noreferrer"
                class="title-link"
              >
                {{ entry.title }}
              </a>
              <span class="date-added">
                {{ formatDate(entry.created) }}
              </span>
            </td>
            <td class="summary">{{ entry.summary }}</td>
            <!-- <td class="created">
              {{ formatDate(entry.created) }}
            </td> -->
            <td class="tags">
              <div
                v-if="entry.tags && entry.tags.length > 0"
                class="tag-list"
              >
                <span
                  v-for="tag in entry.tags"
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
              <span
                v-else
                class="no-tags"
                >No tags</span
              >
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <!-- <div v-else>No summaries yet. Be the first to add one!</div> -->
    </section>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/style/grid.scss';

  .container {
    margin: 0 auto;
    max-width: 88vw;
    padding-bottom: 10rem;
    @include breakpoint(md) {
      max-width: var(--max-width);
      padding: 0 4rem 10rem;
    }
  }

  .logo {
    position: relative;
  }

  .bee {
    position: absolute;
    z-index: var(--z1);
    pointer-events: none;
  }

  .bee-1 {
    top: 0;
    left: 4.2rem;
    width: 1.6rem;
    height: auto;
    animation: hover 3.5s ease-in-out infinite 0.25s;
  }

  .bee-2 {
    top: 0rem;
    right: 4.2rem;
    width: 1.4rem;
    height: auto;
    animation: hover 3s ease-in-out infinite 0s;
  }

  .bee-3 {
    top: -1.6rem;
    left: 3.2rem;
    width: 1.4rem;
    height: auto;
    animation: hover 3.5s ease-in-out infinite;
  }

  @keyframes hover {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  header {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin: 7.6rem auto 3.2rem;
    text-align: center;
    @include breakpoint(md) {
      max-width: 44rem;
    }
  }

  header .logo {
    margin: 0 auto;
  }

  .hive {
    width: 13rem;
    height: auto;
    margin: 0 auto;
    pointer-events: none;
  }

  header h1 {
    margin-top: -2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .form {
    margin: 0 auto 3.2rem;
    @include breakpoint(md) {
      max-width: 28rem;
    }
  }

  input {
    width: 100%;
    padding: 1.2rem 1.2rem;
    font-weight: 550;
    font-size: 1.4rem;
    letter-spacing: -0.25px;
    border-radius: 11px;
    border: none;
    background: #f6f6f6;
    transition: all 0.2s ease;

    &::placeholder {
      color: #a0aec0;
    }

    &:focus {
      outline: none;
      border-color: #858586;
      box-shadow: 0 0 0 1px rgba(163, 166, 168, 0.32);
    }

    &:disabled {
      background: #f7fafc;
      cursor: not-allowed;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;
    letter-spacing: -0.25px;
  }

  th,
  td {
    padding: 1.2rem;
    text-align: left;
  }

  th {
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    opacity: 0.6;
  }

  th:last-child {
    border-right: none;
  }

  .table-header svg {
    display: inline-block;
    margin-right: 0.3rem;
    transform: translateY(0.3rem);
  }

  td {
    vertical-align: top;
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    font-weight: 500;
  }

  td:last-child {
    border-right: none;
  }

  td.title {
    max-width: 20rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .date-added {
    display: block;
    margin: 0.2rem 0 0 2.5rem;
    font-size: 1.4rem;
    font-weight: 400;
    opacity: 0.72;
  }

  .favicon {
    display: inline-block;
    margin: 0.4rem 0.8rem 0 0;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    flex-shrink: 0;
    object-fit: contain;
  }

  td.title a {
    font-weight: 600;
    text-decoration: underline;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td.summary {
    max-width: 36rem;
  }

  td.summary,
  td.created {
    opacity: 0.68;
  }

  td.tags {
    max-width: 20rem;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    background: #f7f7f7;
    border-radius: 0.8rem;
    font-size: 1.1rem;
    font-weight: 550;
    color: #555;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .no-tags {
    opacity: 0.4;
    font-style: italic;
  }
</style>

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
    return new Date(dateStr).toLocaleDateString()
  }

  const getDefaultFavicon = (url) => {
    try {
      const urlObj = new URL(url)
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
    } catch {
      return ''
    }
  }

  const handleFaviconError = (event) => {
    // If the favicon fails to load, try the default Google favicon service
    const url = event.target.dataset.url
    if (url) {
      event.target.src = getDefaultFavicon(url)
    }
  }
</script>
