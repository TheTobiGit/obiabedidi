<!--
  File: pages/recipes/[id].vue
  Recipe details page showing full recipe information
  Uses dynamic route parameter to fetch specific recipe
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
          Recipe Details
        </h1>
      </div>

      <!-- Actions Menu -->
      <div class="flex items-center gap-2">
        <!-- Save Button -->
        <button
          @click="toggleSaved"
          class="p-2 rounded-xl transition-colors flex items-center text-muted hover:bg-surface-hover"
          aria-label="Save recipe"
        >
          <Icon 
            :name="isSaved ? 'material-symbols:bookmark' : 'material-symbols:bookmark-outline'" 
            class="w-5 h-5"
            :class="{ 'text-primary': isSaved }"
          />
        </button>
        
        <!-- Share Button -->
        <button
          @click="shareRecipe"
          class="p-2 rounded-xl transition-colors flex items-center text-muted hover:bg-surface-hover"
          aria-label="Share recipe"
        >
          <Icon name="material-symbols:share" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto overscroll-contain">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4">
        <div class="animate-pulse space-y-4">
          <div class="h-64 bg-surface rounded-xl" />
          <div class="h-8 bg-surface rounded-lg w-3/4 mt-4" />
          <div class="h-4 bg-surface rounded w-1/2 mt-2" />
          
          <div class="flex items-center justify-between mt-6">
            <div class="h-6 bg-surface rounded w-24" />
            <div class="h-10 bg-surface rounded-xl w-32" />
          </div>
          
          <div class="mt-6">
            <div class="h-6 bg-surface rounded w-20 mb-3" />
            <div class="h-4 bg-surface rounded w-full" />
            <div class="h-4 bg-surface rounded w-full mt-1" />
            <div class="h-4 bg-surface rounded w-2/3 mt-1" />
          </div>
          
          <div class="p-4 rounded-xl bg-surface mt-6">
            <div class="h-6 bg-surface-hover rounded w-32 mb-4" />
            <div class="space-y-3">
              <div class="h-4 bg-surface-hover rounded w-full" />
              <div class="h-4 bg-surface-hover rounded w-full" />
              <div class="h-4 bg-surface-hover rounded w-full" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div 
        v-else-if="error"
        class="p-4 flex flex-col items-center justify-center h-full"
      >
        <div class="p-6 rounded-2xl bg-error/10 text-center max-w-md">
          <Icon name="material-symbols:error" class="w-12 h-12 text-error mx-auto" />
          <h2 class="text-xl font-semibold text-error mt-4">Recipe Not Found</h2>
          <p class="text-secondary mt-2">
            {{ error }}
          </p>
          <button
            @click="router.push('/browse')"
            class="mt-6 px-4 py-2 rounded-xl bg-primary text-white font-medium"
          >
            Browse Recipes
          </button>
        </div>
      </div>
      
      <!-- Recipe Content -->
      <div v-else-if="recipe" class="pb-safe-bottom">
        <!-- Hero Section -->
        <div class="relative h-64 bg-surface">
          <img 
            :src="recipe.imageUrl" 
            :alt="recipe.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <!-- Recipe Title -->
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h2 class="text-2xl font-semibold text-white">{{ recipe.name }}</h2>
            <div class="flex items-center justify-between mt-1">
              <p class="text-sm text-white/80">By {{ recipe.authorName }}</p>
            </div>
          </div>
        </div>

        <!-- Recipe Info -->
        <div class="px-4 py-6 space-y-6">
          <!-- Quick Info -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <Icon name="material-symbols:star" class="w-5 h-5 text-yellow-500" />
                <span class="text-secondary">{{ recipe.rating?.average?.toFixed(1) || '0.0' }}</span>
                <span class="text-sm text-muted">({{ recipe.rating?.count || 0 }})</span>
              </div>
              
              <!-- Tip Button -->
              <button
                @click="handleTip"
                class="flex items-center gap-1.5 p-1 px-1.5 rounded-sm bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors shadow-sm hover:shadow-md"
              >
                <Icon name="material-symbols:payments-outline" class="w-5 h-5" />
                <span>Tip Chef</span>
              </button>
            </div>
            
            <!-- View Count -->
            <div class="flex items-center gap-1">
              <Icon name="material-symbols:visibility-outline" class="w-5 h-5 text-muted" />
              <span class="text-sm text-secondary">{{ recipe.viewCount || 0 }} view(s)</span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="recipe.description">
            <h3 class="text-lg font-medium text-primary mb-2">About</h3>
            <p class="text-secondary">{{ recipe.description }}</p>
          </div>

          <!-- Allergens Warning -->
          <div v-if="recipe.allergens?.length" class="p-4 rounded-xl bg-amber-500/10">
            <div class="flex items-center gap-2">
              <Icon 
                name="material-symbols:warning" 
                class="w-5 h-5 text-amber-500"
              />
              <h3 class="font-medium text-amber-500">Allergen Warning</h3>
            </div>
            <p class="mt-1 text-sm text-amber-500">
              This recipe contains: {{ recipe.allergens.join(', ') }}
            </p>
          </div>

          <!-- Recipe Details -->
          <div>
            <h3 class="text-lg font-medium text-primary mb-2">Details</h3>
            <div class="space-y-2">
              <!-- Meal Type -->
              <div v-if="recipe.mealType?.length" class="flex items-center justify-between py-2 border-b border-theme">
                <span class="text-secondary">Meal Type</span>
                <div class="flex flex-wrap gap-1 justify-end">
                  <span 
                    v-for="type in recipe.mealType" 
                    :key="type"
                    class="px-2 py-0.5 text-xs rounded-md bg-surface text-primary"
                  >
                    {{ type }}
                  </span>
                </div>
              </div>
              
              <!-- Cooking Time -->
              <div v-if="recipe.cookTime" class="flex items-center justify-between py-2">
                <span class="text-secondary">Cooking Time</span>
                <span class="text-primary">{{ recipe.cookTime }} minutes</span>
              </div>
            </div>
          </div>

          <!-- Ingredients Section -->
          <div class="p-4 rounded-xl bg-surface border-theme">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-primary">Ingredients</h3>
              <span class="text-sm text-muted">{{ 
                Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0 
              }} items</span>
            </div>
            
            <!-- Simple Mode Ingredients (string array) -->
            <ul v-if="recipe.creationMode === 'simple'" class="space-y-3">
              <li 
                v-for="(ingredient, index) in recipe.ingredients" 
                :key="index"
                class="flex items-center gap-2"
              >
                <div class="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                <span class="text-secondary">{{ ingredient }}</span>
              </li>
            </ul>
            
            <!-- Advanced Mode Ingredients (structured) -->
            <ul v-else class="space-y-3">
              <li 
                v-for="(ingredient, index) in recipe.ingredients" 
                :key="index"
                class="flex items-center justify-between"
              >
                <span class="text-secondary">{{ 
                  typeof ingredient === 'string' 
                    ? ingredient 
                    : ingredient.name 
                }}</span>
                <span v-if="typeof ingredient !== 'string'" class="text-primary">
                  {{ ingredient.amount }} {{ ingredient.unit }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Video Section -->
          <div v-if="recipe.videoUrl" class="p-4 rounded-xl bg-surface border-theme">
            <h3 class="text-lg font-medium text-primary mb-4">Watch Recipe Video</h3>
            <div class="relative w-full pb-[56.25%]">
              <iframe
                :src="getEmbedUrl(recipe.videoUrl)"
                class="absolute inset-0 w-full h-full rounded-lg"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <!-- Instructions Section -->
          <div v-if="showInstructions" class="p-4 rounded-xl bg-surface border-theme">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-primary">Instructions</h3>
              <span v-if="Array.isArray(recipe.instructions)" class="text-sm text-muted">
                {{ recipe.instructions.length }} steps
              </span>
            </div>
            
            <!-- Simple Mode Instructions (string) -->
            <div v-if="recipe.creationMode === 'simple' && typeof recipe.instructions === 'string' && recipe.instructions">
              <p class="text-secondary whitespace-pre-line">{{ recipe.instructions }}</p>
            </div>
            
            <!-- Advanced Mode Instructions (structured) -->
            <ol v-else-if="Array.isArray(recipe.instructions)" class="space-y-4">
              <li 
                v-for="(instruction, index) in recipe.instructions" 
                :key="index"
                class="flex gap-4"
              >
                <div 
                  class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium"
                >
                  {{ instruction.step || index + 1 }}
                </div>
                <p class="flex-1 text-secondary pt-1.5">
                  {{ instruction.text || instruction }}
                </p>
              </li>
            </ol>
          </div>
          
          <!-- Gallery Section -->
          <div v-if="recipe.gallery && recipe.gallery.length > 1" class="space-y-3">
            <h3 class="text-lg font-medium text-primary">Gallery</h3>
            <div class="grid grid-cols-2 gap-2">
              <img 
                v-for="(image, index) in recipe.gallery.slice(1)" 
                :key="index"
                :src="image" 
                :alt="`${recipe.name} image ${index + 1}`"
                class="w-full aspect-square object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Import necessary composables and types
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipes } from '~/composables/useRecipes'
import type { Recipe } from '~/types/recipe'

// Router and route
const router = useRouter()
const route = useRoute()

// Get recipe by ID from Firestore
const { 
  getRecipeById, 
  isLoading, 
  error,
  incrementViews
} = useRecipes()

// Recipe data
const recipe = ref<Recipe | null>(null)
const isSaved = ref(false)

// Constants
const VIEW_COOLDOWN = 1000 * 60 * 60 // 1 hour in milliseconds

/**
 * Check if enough time has passed since last view
 * @param recipeId The recipe ID to check
 * @returns boolean indicating if view should be counted
 */
function shouldCountView(recipeId: string): boolean {
  const lastViewKey = `recipe_${recipeId}_last_view`
  const lastView = localStorage.getItem(lastViewKey)
  
  if (!lastView) return true
  
  const timeSinceLastView = Date.now() - parseInt(lastView)
  return timeSinceLastView > VIEW_COOLDOWN
}

/**
 * Record view timestamp in localStorage
 * @param recipeId The recipe ID to record
 */
function recordView(recipeId: string) {
  const lastViewKey = `recipe_${recipeId}_last_view`
  localStorage.setItem(lastViewKey, Date.now().toString())
}

// Computed properties
const showInstructions = computed(() => {
  if (!recipe.value) return false
  
  // For simple mode, only show if instructions exist and are not empty
  if (recipe.value.creationMode === 'simple') {
    return typeof recipe.value.instructions === 'string' && !!recipe.value.instructions
  }
  
  // For advanced mode, show if instructions array exists and has items
  return Array.isArray(recipe.value.instructions) && recipe.value.instructions.length > 0
})

// Fetch recipe data
async function fetchRecipe() {
  try {
    const recipeId = route.params.id as string
    const fetchedRecipe = await getRecipeById(recipeId)
    recipe.value = fetchedRecipe
    
    // Check if we should count this view
    if (shouldCountView(recipeId)) {
      await incrementViews(recipeId)
      recordView(recipeId)
    }
  } catch (err) {
    console.error('Error fetching recipe:', err)
  }
}

// Share recipe functionality
async function shareRecipe() {
  if (!recipe.value) return

  const shareData = {
    title: recipe.value.name,
    text: `Check out this ${recipe.value.name} recipe on Obiabedidi!`,
    url: window.location.href
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(window.location.href)
      // TODO: Show toast notification
    }
  } catch (error) {
    console.error('Error sharing:', error)
  }
}

// Toggle saved state (UI only for now)
function toggleSaved() {
  isSaved.value = !isSaved.value
}

// Function to convert YouTube URL to embed URL
function getEmbedUrl(url: string) {
  if (!url) return ''
  
  // Handle YouTube URLs
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = ''
    
    if (url.includes('v=')) {
      // Regular YouTube URL
      videoId = url.split('v=')[1]
      // Remove any additional parameters
      const ampersandPosition = videoId.indexOf('&')
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition)
      }
    } else if (url.includes('youtu.be/')) {
      // Shortened YouTube URL
      videoId = url.split('youtu.be/')[1]
    }
    
    return `https://www.youtube.com/embed/${videoId}`
  }
  
  // Handle Vimeo URLs
  if (url.includes('vimeo.com')) {
    const vimeoId = url.split('vimeo.com/')[1]
    return `https://player.vimeo.com/video/${vimeoId}`
  }
  
  // Return original URL if not recognized
  return url
}

// Function to handle tipping (placeholder for now)
function handleTip() {
  // TODO: Implement tipping functionality
  console.log('Tip button clicked')
}

// Fetch recipe on mount
onMounted(() => {
  fetchRecipe()
})
</script>

<style scoped>
/* Ensure proper height on iOS */
@supports (-webkit-touch-callout: none) {
  .h-dvh {
    height: -webkit-fill-available;
  }
}

/* Safe bottom padding for notched devices */
.pb-safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style> 