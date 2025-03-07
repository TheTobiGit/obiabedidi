<template>
  <div class="min-h-dvh flex flex-col transition-colors duration-200 relative">
    <!-- Top Bar -->
    <div class="flex justify-between items-center px-4 py-4">
      <!-- Logo -->
      <div class="flex items-center gap-1">
        <Logo class="h-8 w-auto" />
        <span class="text-xl font-semibold tracking-tighter transition-colors -ml-1 text-primary">
          Obiabedidi
        </span>
      </div>

      <!-- Login Button -->
      <button 
        @click="navigateTo('/auth/login')"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 bg-surface text-primary hover:bg-surface-hover"
      >
        <Icon name="material-symbols:login" class="w-5 h-5" />
        <span>Login</span>
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center px-4">
      <div class="w-full max-w-2xl text-center mb-8">
        <h1 class="text-2xl mb-2 transition-colors text-primary">
          Good evening, Chef.
        </h1>
        <p class="text-lg transition-colors text-secondary">
          What would you like to cook today?
        </p>
      </div>

      <div class="w-full max-w-2xl">
        <!-- Search Container -->
        <div class="relative mb-4">
          <textarea
            ref="textareaRef"
            v-model="searchInput"
            rows="1"
            placeholder="Search by recipe name or ingredients..."
            class="w-full px-4 pt-3 pb-12 rounded-2xl resize-none border-0 outline-none transition-all duration-200 max-h-[300px] overflow-y-auto bg-surface text-primary placeholder-muted focus:ring-2 focus:ring-muted"
            @input="adjustTextareaHeight"
            @keydown.enter.prevent="handleSearch"
          />
          
          <!-- Bottom Action Bar -->
          <div class="absolute bottom-2 left-0 right-0 px-4 flex items-center justify-between">
            <!-- Left Side Actions -->
            <div class="flex items-center gap-2">
              <!-- AI Toggle Button -->
              <button 
                @click="toggleAI"
                :class="[
                  isAIEnabled 
                    ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                    : 'text-muted hover:bg-surface-hover'
                ]"
                class="flex items-center gap-1.5 px-2 py-1 rounded-xl text-sm transition-all duration-200"
              >
                <Icon 
                  name="material-symbols:robot" 
                  class="w-4 h-4 transition-transform"
                  :class="{ 'scale-110': isAIEnabled }"
                />
                <span class="text-xs">AI {{ isAIEnabled ? 'ON' : 'OFF' }}</span>
              </button>
            </div>

            <!-- Right Side Submit -->
            <button 
              @click="handleSearch"
              class="p-1.5 rounded-xl transition-colors text-muted hover:bg-surface-hover"
            >
              <Icon name="material-symbols:arrow-upward" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Browse Button -->
        <button 
          @click="showAll"
          class="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-medium transition-all duration-200 bg-surface text-primary hover:bg-surface-hover"
        >
          <Icon name="material-symbols:view-list" class="w-5 h-5" />
          <span>Browse recipes</span>
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center text-sm transition-colors text-muted">
      <p>Find your next favorite Ghanaian recipe</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const isAIEnabled = ref(false)
const colorMode = useColorMode()
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const searchInput = ref('')
const router = useRouter()

// Update meta theme-color when colorMode changes
useHead(() => ({
  meta: [
    {
      name: 'theme-color',
      content: colorMode.value === 'dark' ? '#1C1C1E' : '#F9FAFB'
    }
  ]
}))

// Common words to filter out from search
const commonWords = [
  'i', 'want', 'need', 'looking', 'for', 'to', 'cook', 'make', 'a', 'an', 'the',
  'some', 'recipe', 'recipes', 'food', 'dish', 'meal', 'with', 'and', 'or', 'please',
  'help', 'me', 'find', 'show', 'give', 'how', 'can', 'would', 'like', 'about'
]

function cleanSearchQuery(query: string): string[] {
  // Split by common delimiters and clean
  const words = query.toLowerCase()
    .replace(/[,.?!]/g, ' ')
    .split(/\s+/)
    .map(word => word.trim())
    .filter(word => word.length > 0)
    
  // Filter out common words
  return words.filter(word => !commonWords.includes(word))
}

function toggleAI() {
  isAIEnabled.value = !isAIEnabled.value
}

function showAll() {
  navigateTo('/browse')
}

function adjustTextareaHeight() {
  const textarea = textareaRef.value
  if (!textarea) return
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`
}

function handleSearch() {
  if (!searchInput.value.trim()) return
  
  // Clean the search query
  const searchTerms = cleanSearchQuery(searchInput.value)
  
  // Navigate to search page with query
  router.push({
    path: '/search',
    query: { q: searchTerms.length > 0 ? searchTerms.join(' ') : searchInput.value.trim() }
  })
}

onMounted(() => {
  adjustTextareaHeight()
})
</script>
