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
            placeholder="Enter a recipe name or ingredients you have (e.g., 'jollof rice' or 'corn, tilapia')"
            class="w-full px-6 pt-4 pb-14 rounded-2xl resize-none border-0 outline-none transition-all duration-200 max-h-[300px] overflow-y-auto bg-surface text-primary placeholder-muted focus:ring-2 focus:ring-muted"
            @input="adjustTextareaHeight"
            @keydown.enter.prevent="handleSearch"
          />
          
          <!-- Bottom Action Bar -->
          <div class="absolute bottom-3 left-0 right-0 px-6 flex items-center justify-between">
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
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all duration-200"
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
              class="p-2 rounded-xl transition-colors text-muted hover:bg-surface-hover"
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
  
  // Navigate to search page with query
  router.push({
    path: '/search',
    query: { q: searchInput.value }
  })
}

onMounted(() => {
  adjustTextareaHeight()
})
</script>
