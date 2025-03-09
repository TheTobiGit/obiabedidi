<!--
  File: pages/recipes/create/simple.vue
  Simple recipe creation page
  Allows users to create recipes with minimal details
-->
<template>
  <div class="min-h-dvh flex flex-col transition-colors duration-200">
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
          Simple Recipe
        </h1>
      </div>
      
      <!-- Save Button -->
      <button
        @click="saveRecipe"
        :disabled="!isFormValid || isSaving"
        class="px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="isFormValid ? 'bg-primary text-white' : 'bg-surface text-muted'"
      >
        <span v-if="isSaving">Saving...</span>
        <span v-else>Save</span>
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto overscroll-contain p-4">
      <div class="max-w-md mx-auto">
        <!-- Form -->
        <form @submit.prevent="saveRecipe" class="space-y-6">
          <!-- Recipe Name -->
          <div class="space-y-2">
            <label for="name" class="block text-sm font-medium text-primary">
              Recipe Name <span class="text-error">*</span>
            </label>
            <input
              id="name"
              v-model="recipe.name"
              type="text"
              placeholder="e.g. Jollof Rice"
              class="w-full px-4 py-2 rounded-xl border border-theme bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>

          <!-- Description (Optional) -->
          <div class="space-y-2">
            <label for="description" class="block text-sm font-medium text-primary">
              Description <span class="text-muted text-xs">(optional)</span>
            </label>
            <textarea
              id="description"
              v-model="recipe.description"
              placeholder="Briefly describe your recipe..."
              rows="3"
              class="w-full px-4 py-2 rounded-xl border border-theme bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            ></textarea>
          </div>

          <!-- Ingredients -->
          <div class="space-y-2">
            <label for="ingredients" class="block text-sm font-medium text-primary">
              Ingredients <span class="text-error">*</span>
              <span class="text-muted text-xs ml-1">(one per line)</span>
            </label>
            <textarea
              id="ingredients"
              v-model="ingredientsText"
              placeholder="2 cups rice&#10;1 onion, chopped&#10;2 tomatoes, diced"
              rows="5"
              class="w-full px-4 py-2 rounded-xl border border-theme bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
              required
            ></textarea>
          </div>

          <!-- Photo Upload -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-primary">
              Recipe Photo <span class="text-error">*</span>
            </label>
            
            <!-- Photo Preview -->
            <div 
              v-if="photoPreview" 
              class="relative w-full h-48 rounded-xl overflow-hidden border border-theme"
            >
              <img 
                :src="photoPreview" 
                alt="Recipe preview" 
                class="w-full h-full object-cover"
              />
              <button
                @click="removePhoto"
                class="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                type="button"
              >
                <Icon name="material-symbols:close" class="w-5 h-5" />
              </button>
            </div>
            
            <!-- Upload Button -->
            <div v-else>
              <label 
                for="photo-upload" 
                class="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-theme bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <Icon name="material-symbols:add-photo-alternate-outline" class="w-10 h-10 text-muted mb-2" />
                  <p class="text-sm text-muted">
                    <span class="font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p class="text-xs text-muted mt-1">PNG, JPG or WEBP (max. 5MB)</p>
                </div>
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                  required
                />
              </label>
            </div>
          </div>

          <!-- Video URL (Optional) -->
          <div class="space-y-2">
            <label for="video-url" class="block text-sm font-medium text-primary">
              Instruction Video URL <span class="text-muted text-xs">(optional)</span>
            </label>
            <input
              id="video-url"
              v-model="recipe.videoUrl"
              type="url"
              placeholder="e.g. https://youtube.com/watch?v=..."
              class="w-full px-4 py-2 rounded-xl border border-theme bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Import necessary composables and types
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Recipe } from '~/types/recipe'

// Router for navigation
const router = useRouter()

// Form state
const isSaving = ref(false)
const photoPreview = ref<string | null>(null)
const photoFile = ref<File | null>(null)
const ingredientsText = ref('')

// Recipe object
const recipe = ref<Partial<Recipe>>({
  name: '',
  description: '',
  videoUrl: '',
  creationMode: 'simple',
})

// Computed properties
const isFormValid = computed(() => {
  return !!recipe.value.name && 
         !!ingredientsText.value.trim() && 
         !!photoPreview.value
})

/**
 * Handle photo upload
 * @param event The file input change event
 */
function handlePhotoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  
  const file = input.files[0]
  photoFile.value = file
  
  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

/**
 * Remove the selected photo
 */
function removePhoto() {
  photoPreview.value = null
  photoFile.value = null
  
  // Reset the file input
  const input = document.getElementById('photo-upload') as HTMLInputElement
  if (input) input.value = ''
}

/**
 * Save the recipe
 * This is just a UI placeholder - actual implementation will be added later
 */
async function saveRecipe() {
  if (!isFormValid.value) return
  
  isSaving.value = true
  
  try {
    // Convert ingredients text to array
    const ingredients = ingredientsText.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    // Update recipe object
    recipe.value.ingredients = ingredients
    
    // TODO: Implement actual save functionality
    console.log('Recipe to save:', recipe.value)
    console.log('Photo file:', photoFile.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Navigate back to recipes list
    router.push('/recipes')
  } catch (error) {
    console.error('Error saving recipe:', error)
  } finally {
    isSaving.value = false
  }
}
</script> 