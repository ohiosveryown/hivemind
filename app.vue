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
        <!-- Loading summaries... -->
      </div>

      <!-- Error state -->
      <div v-if="error">Failed to load summaries. Please refresh the page.</div>

      <!-- Table -->
      <table>
        <thead>
          <tr>
            <th class="table-header meta">S</th>
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
            :class="{ starred: onStars[entry.id] }"
          >
            <td class="star-container">
              <svg
                class="sticker star"
                :class="{ on: onStars[entry.id] }"
                @click="handleStarClick(entry.id)"
                width="26"
                height="25"
                viewBox="0 0 26 25"
                fill="none"
              >
                <g filter="url(#filter0_d_96_470)">
                  <path
                    d="M14.2068 4.68989C14.5222 4.018 15.4778 4.018 15.7932 4.68989L18.0902 9.58359L23.3143 10.3818C24.0193 10.4895 24.3072 11.3494 23.8092 11.8598L20 15.7639L20.8898 21.2191C21.0076 21.941 20.2413 22.4809 19.6012 22.127L15 19.5836L10.3988 22.127C9.75871 22.4809 8.9924 21.941 9.11015 21.2191L10 15.7639L6.19085 11.8598C5.6928 11.3494 5.98067 10.4895 6.68567 10.3818L11.9098 9.58359L14.2068 4.68989Z"
                    fill="#B8B8B8"
                  />
                  <path
                    d="M13.3691 4.13477C14.1036 2.82805 16.0439 2.87119 16.6982 4.26465L18.7676 8.6748L23.4658 9.39355C24.975 9.62452 25.5917 11.4657 24.5254 12.5586L21.0684 16.0996L21.877 21.0586C22.1287 22.6041 20.4878 23.7596 19.1172 23.002L15 20.7256L10.8828 23.002C9.51225 23.7596 7.87131 22.6041 8.12305 21.0586L8.93066 16.0996L5.47461 12.5586C4.40831 11.4657 5.02496 9.62452 6.53418 9.39355L11.2314 8.6748L13.3018 4.26465L13.3691 4.13477Z"
                    stroke="white"
                    stroke-width="2"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_96_470"
                    x="0.938477"
                    y="0.186035"
                    width="28.123"
                    height="28.0571"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood
                      flood-opacity="0"
                      result="BackgroundImageFix"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feComposite
                      in2="hardAlpha"
                      operator="out"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_96_470"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_96_470"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>

              <svg
                class="sparkle"
                :class="{ 'sparkle-active': activeSparkle === entry.id }"
                width="51"
                height="55"
                fill="none"
              >
                <path
                  stroke="#000"
                  stroke-linecap="round"
                  stroke-opacity=".22"
                  stroke-width="2"
                  d="m42.613 22.842 4.83-1.294M3.418 33.344l4.655-1.248M38.009 40.025l3.535 3.535M9.316 11.332l3.408 3.408M20.826 44.629l-1.294 4.829M31.328 5.434l-1.247 4.655"
                />
              </svg>
            </td>

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
                <span
                  v-if="onStars[entry.id]"
                  class="tag starred-tag"
                >
                  Starred
                </span>
              </div>
              <div
                v-else-if="onStars[entry.id]"
                class="tag-list"
              >
                <span class="tag starred-tag"> Starred </span>
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

  th.meta {
    border: none;
    padding: 0;
    opacity: 0;
    // width: 47px;
  }

  tr:hover .star-container {
    opacity: 1;
    transition: opacity 200ms ease 200ms;
  }

  .star-container {
    border: none;
    position: relative;
    margin-top: 0.88rem;
    padding: 0 1.8rem 0 0;
    opacity: 0;
    transition: opacity 300ms ease;
  }

  tr.starred .star-container {
    opacity: 1;
  }

  .sticker {
    cursor: pointer;
    transition: all 300ms ease;
  }

  .sticker:hover {
    transform: scale(0.92);
  }

  .sticker:active {
    transform: scale(0.86) rotate(-8deg);
    transition: transform 0.6s cubic-bezier(0.37, 0, 0.24, 4);
  }

  .sticker.on {
    transform: scale(1.15) rotate(8deg);
    transition: transform 2s
      linear(
        0,
        0.03,
        0.0803,
        0.219,
        0.424,
        0.664,
        0.914,
        1.15,
        1.34,
        1.49,
        1.56,
        1.58,
        1.53,
        1.44,
        1.31,
        1.17,
        1.02,
        0.881,
        0.772,
        0.696,
        0.657,
        0.657,
        0.692,
        0.753,
        0.833,
        0.922,
        1.01,
        1.09,
        1.15,
        1.19,
        1.21,
        1.2,
        1.18,
        1.14,
        1.09,
        1.03,
        0.982,
        0.938,
        0.904,
        0.883,
        0.876,
        0.882,
        0.899,
        0.925,
        0.956,
        0.988,
        1.02,
        1.04,
        1.06,
        1.07,
        1.07,
        1.07,
        1.06,
        1.04,
        1.02,
        1,
        0.984,
        0.97,
        0.961,
        0.956,
        0.956,
        0.96,
        0.968,
        0.979,
        0.99,
        1,
        1.01,
        1.02,
        1.02,
        1.03,
        1.03,
        1.02,
        1.02,
        1.01,
        1,
        0.998,
        0.992,
        0.988,
        0.985,
        0.984,
        0.985,
        0.987,
        0.99,
        0.994,
        0.998,
        1,
        1.01,
        1.01,
        1.01,
        1.01,
        1.01,
        1.01,
        1,
        1,
        1,
        0.998,
        0.997,
        0.995,
        0.995,
        0.995,
        0.995,
        0.996,
        0.997,
        0.999,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      );
  }

  .sticker.star.on {
    fill: #ffb517;
  }

  .star {
    position: absolute;
    z-index: var(--z1);
    top: 0.86rem;
  }

  .sparkle {
    position: absolute;
    z-index: var(--z0);
    top: -0.15rem;
    left: -1.1rem;
    transform: scale(0.6);
    opacity: 0;
    pointer-events: none;
  }

  .sparkle-active {
    animation: sparkles 500ms forwards;
  }

  @keyframes sparkles {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(1.4);
    }
  }

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
    width: calc(100% - 42px);
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
    margin: 0.32rem 0 0 2.5rem;
    font-size: 1.4rem;
    font-weight: 500;
    opacity: 0.48;
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

  // .starred-tag {
  //   background: #fff3cd;
  //   color: #856404;
  //   border: 1px solid #ffeaa7;
  //   font-weight: 600;
  // }

  .no-tags {
    opacity: 0.4;
    font-style: italic;
  }
</style>

<script setup>
  const url = ref('')
  const isLoading = ref(false)
  const message = ref({ text: '', type: '' })
  const onStars = ref({})
  const activeSparkle = ref(null)

  // Use useFetch for reactive data fetching with loading states
  const { data, pending, error, refresh } = await useFetch('/api/entries')

  // Initialize onStars with actual starred status from API
  watchEffect(() => {
    if (data.value?.entries) {
      const starredEntries = {}
      data.value.entries.forEach((entry) => {
        starredEntries[entry.id] = entry.starred || false
      })
      onStars.value = starredEntries
    }
  })

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
    const date = new Date(dateStr)
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
    return date.toLocaleDateString('en-US', options)
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

  const handleStarClick = async (entryId) => {
    // Check if we're starring (turning on) or unstarring (turning off)
    const isStarring = !onStars.value[entryId]

    // Optimistically update the UI
    onStars.value[entryId] = !onStars.value[entryId]

    // Only trigger sparkle animation when starring (turning on)
    if (isStarring) {
      activeSparkle.value = entryId

      // Remove the active class after animation completes
      setTimeout(() => {
        activeSparkle.value = null
      }, 500) // Match the animation duration
    }

    try {
      // Call API to update starred status
      await $fetch('/api/update-starred', {
        method: 'POST',
        body: {
          entryId,
          starred: onStars.value[entryId],
        },
      })

      // Refresh the data to ensure tags column updates properly
      await refresh()
    } catch (error) {
      // Revert the UI change if API call fails
      onStars.value[entryId] = !onStars.value[entryId]
      console.error('Failed to update starred status:', error)

      // Show error message to user
      message.value = {
        text: 'Failed to update starred status. Please try again.',
        type: 'error',
      }

      // Clear error message after 3 seconds
      setTimeout(() => {
        message.value = { text: '', type: '' }
      }, 3000)
    }
  }
</script>
