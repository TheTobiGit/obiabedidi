<!--
  File: pages/search.vue
  Search results page with chat-like interface
  Displays search results in a conversational format
-->
<template>
  <div class="min-h-dvh h-dvh flex flex-col transition-colors duration-200 overflow-hidden">
    <!-- Top Bar -->
    <div class="sticky top-0 z-10 bg-inherit flex justify-between items-center px-4 py-4 border-b border-theme">
      <!-- Back Button and Title -->
      <div class="flex items-center gap-3">
        <button 
          @click="router.back()"
          class="p-2 -ml-2 rounded-xl transition-colors flex items-center text-muted hover:bg-surface-hover"
        >
          <Icon name="material-symbols:arrow-back" class="w-5 h-5" />
        </button>
        <h1 class="text-lg font-semibold transition-colors text-primary">
          Search
        </h1>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <main class="flex-1 overflow-y-auto overscroll-contain p-4">
      <div class="max-w-2xl mx-auto space-y-4">
        <!-- Initial Message -->
        <div class="flex justify-start">
          <div class="bg-surface rounded-2xl rounded-tl-none px-4 py-3 text-secondary max-w-[80%]">
            What would you like to cook today?
          </div>
        </div>

        <!-- Search Query -->
        <div v-if="searchQuery" class="flex justify-end">
          <div class="bg-primary text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
            {{ searchQuery }}
          </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="flex justify-start">
          <div class="bg-surface rounded-2xl rounded-tl-none p-4 max-w-[80%] w-full space-y-4">
            <div 
              v-for="recipe in searchResults" 
              :key="recipe.id"
              class="flex gap-3 p-3 rounded-xl border border-theme hover:bg-surface-hover transition-all cursor-pointer"
              @click="router.push(`/${recipe.id}`)"
            >
              <!-- Recipe Image -->
              <img 
                :src="recipe.imageUrl" 
                :alt="recipe.name"
                class="w-16 h-16 rounded-lg object-cover"
              />

              <div class="flex-1">
                <h3 class="font-medium text-primary">{{ recipe.name }}</h3>
                <p class="text-sm text-muted mt-1">By {{ recipe.author }}</p>
                
                <div class="flex items-center gap-4 mt-2">
                  <div class="flex items-center gap-1">
                    <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-500" />
                    <span class="text-sm text-secondary">{{ recipe.rating }}</span>
                  </div>
                  
                  <div class="flex items-center gap-1">
                    <Icon name="material-symbols:timer-outline" class="w-4 h-4 text-muted" />
                    <span class="text-sm text-secondary">{{ recipe.cookingTime }}m</span>
                  </div>
                </div>

                <!-- Matching Ingredients -->
                <div v-if="recipe.matchingIngredients?.length" class="mt-2">
                  <div class="flex items-center gap-1 text-sm text-green-500">
                    <Icon name="material-symbols:check-circle" class="w-4 h-4" />
                    <span>{{ recipe.matchingIngredients.length }} matching ingredients:</span>
                  </div>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span 
                      v-for="ingredient in recipe.matchingIngredients" 
                      :key="ingredient"
                      class="px-2 py-0.5 rounded-lg bg-green-500/10 text-green-500 text-xs"
                    >
                      {{ ingredient }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div v-else-if="searchQuery" class="flex justify-start">
          <div class="bg-surface rounded-2xl rounded-tl-none px-4 py-3 text-secondary max-w-[80%]">
            No recipes found. Try a different search term.
          </div>
        </div>
      </div>
    </main>

    <!-- Search Input -->
    <div class="sticky bottom-0 bg-inherit border-t border-theme p-4">
      <div class="max-w-2xl mx-auto">
        <div class="relative">
          <textarea
            ref="textareaRef"
            v-model="searchInput"
            rows="1"
            placeholder="Search by recipe name or ingredients you have (e.g., 'jollof rice' or 'corn, tilapia')"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

// Import recipes data and types
import recipesData from '@/data/recipes.json'
import type { Recipe } from '@/types/recipe'

// Types
interface RecipeWithMatches extends Recipe {
  matchingIngredients: string[];
}

// State
const isAIEnabled = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const searchInput = ref('')
const searchQuery = ref('')
const searchResults = ref<RecipeWithMatches[]>([])

// Get initial search query from route query
onMounted(() => {
  const query = route.query.q as string
  if (query) {
    searchInput.value = query
    searchQuery.value = query
    performSearch(query)
  }
})

// Watch route query changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery && typeof newQuery === 'string') {
    searchInput.value = newQuery
    searchQuery.value = newQuery
    performSearch(newQuery)
  }
})

function toggleAI() {
  isAIEnabled.value = !isAIEnabled.value
}

function adjustTextareaHeight() {
  const textarea = textareaRef.value
  if (!textarea) return
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`
}

function handleSearch() {
  if (!searchInput.value.trim()) return
  
  // Update URL with search query
  router.push({
    path: '/search',
    query: { q: searchInput.value }
  })
  
  searchQuery.value = searchInput.value
  performSearch(searchInput.value)
  searchInput.value = ''
}

function performSearch(query: string) {
  // Split search query into ingredients (by comma or space)
  const searchIngredients = query.toLowerCase()
    .split(/[,\s]+/)
    .map(i => i.trim())
    .filter(i => i.length > 0)

  // Search in recipe names, descriptions, and ingredients
  const results: RecipeWithMatches[] = (recipesData.recipes as Recipe[]).map(recipe => {
    // Check for matching ingredients
    const matchingIngredients = recipe.ingredients
      .filter(ing => searchIngredients.some(searchIng => 
        ing.name.toLowerCase().includes(searchIng)
      ))
      .map(ing => ing.name)

    return {
      ...recipe,
      matchingIngredients
    }
  }).filter(recipe => 
    // Include recipe if it matches ingredients or other fields
    recipe.matchingIngredients.length > 0 ||
    recipe.name.toLowerCase().includes(query.toLowerCase()) ||
    recipe.description.toLowerCase().includes(query.toLowerCase()) ||
    recipe.ethnicGroup.toLowerCase().includes(query.toLowerCase()) ||
    recipe.mealType.toLowerCase().includes(query.toLowerCase())
  )

  // Sort by number of matching ingredients (most matches first)
  results.sort((a, b) => b.matchingIngredients.length - a.matchingIngredients.length)

  searchResults.value = results
}

// Update page metadata
useHead({
  title: 'Search - Obiabedidi',
  meta: [
    {
      name: 'description',
      content: 'Search for your favorite Ghanaian recipes'
    }
  ]
})
</script>

<style scoped>
/* Ensure proper height on iOS */
@supports (-webkit-touch-callout: none) {
  .h-dvh {
    height: -webkit-fill-available;
  }
}
</style> 