<!--
  File: pages/recipes/create/simple.vue
  Simple recipe creation page
  Allows users to create recipes with minimal details
-->
<template>
  <div class="min-h-dvh flex flex-col transition-colors duration-200">
    <!-- Top Bar -->
    <div 
      class="sticky top-0 z-10 flex justify-between items-center px-4 py-4  backdrop-blur-xl bg-background/80 shadow-sm transition-all duration-200"
    >
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
        :disabled="isSubmitDisabled"
        class="px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="isFormValid ? 'bg-primary text-white' : 'bg-surface text-muted'"
      >
        <span v-if="isSaving">
          <Icon name="material-symbols:sync" class="w-4 h-4 animate-spin mr-1" />
          Saving...
        </span>
        <span v-else-if="isUploading">
          <Icon name="material-symbols:sync" class="w-4 h-4 animate-spin mr-1" />
          Uploading...
        </span>
        <span v-else>Save</span>
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto overscroll-contain p-4">
      <div class="max-w-md mx-auto">
        <!-- Success Message -->
        <div 
          v-if="successMessage" 
          class="mb-4 p-3 rounded-xl bg-success/10 text-success text-sm flex items-center gap-2"
        >
          <Icon name="material-symbols:check-circle" class="w-5 h-5 flex-shrink-0" />
          <span>{{ successMessage }}</span>
        </div>
        
        <!-- Error Message -->
        <div 
          v-if="errorMessage" 
          class="mb-4 p-3 rounded-xl bg-error/10 text-error text-sm flex items-center gap-2"
        >
          <Icon name="material-symbols:error" class="w-5 h-5 flex-shrink-0" />
          <span>{{ errorMessage }}</span>
        </div>
        
        <!-- Form -->
        <form @submit.prevent="saveRecipe" class="space-y-6">
          <!-- Recipe Name -->
          <div class="space-y-2">
            <label for="name" class="block text-sm font-medium text-primary">
              Recipe Name <span class="text-red-500 font-bold text-lg">*</span>
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
          
          <!-- Cooking Time -->
          <div class="space-y-2">
            <label for="cooking-time" class="block text-sm font-medium text-primary">
              Cooking Time (minutes) <span class="text-red-500 font-bold text-lg">*</span>
            </label>
            <input
              id="cooking-time"
              v-model.number="recipe.cookTime"
              type="number"
              min="0"
              placeholder="e.g. 45"
              class="w-full px-4 py-2 rounded-xl border border-theme bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            />
          </div>
          
          <!-- Meal Type -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-primary">
              Meal Type <span class="text-red-500 font-bold text-lg">*</span>
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="type in mealTypes"
                :key="type"
                type="button"
                @click="recipe.mealType = recipe.mealType?.includes(type) ? recipe.mealType.filter(t => t !== type) : [...(recipe.mealType || []), type]"
                class="relative px-3 py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                :class="[
                  recipe.mealType?.includes(type)
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-surface-hover bg-surface border-theme'
                ]"
              >
                <!-- Selected indicator -->
                <div 
                  v-if="recipe.mealType?.includes(type)"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center shadow-lg"
                >
                  <Icon name="material-symbols:check" class="w-3.5 h-3.5 text-white" />
                </div>
                <Icon 
                  :name="type === 'Breakfast' 
                    ? 'material-symbols:breakfast-dining'
                    : type === 'Lunch'
                    ? 'material-symbols:lunch-dining'
                    : type === 'Dinner'
                    ? 'material-symbols:dinner-dining'
                    : 'material-symbols:restaurant'"
                  class="w-5 h-5"
                />
                {{ type }}
              </button>
            </div>
          </div>
          
          <!-- Allergens -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-primary">
              Common Allergens <span class="text-muted text-xs">(select all that apply)</span>
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="allergen in commonAllergens"
                :key="allergen"
                type="button"
                @click="toggleAllergen(allergen)"
                class="relative px-3 py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                :class="[
                  recipe.allergens?.includes(allergen)
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-surface-hover bg-surface border-theme'
                ]"
              >
                <!-- Selected indicator -->
                <div 
                  v-if="recipe.allergens?.includes(allergen)"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center shadow-lg"
                >
                  <Icon name="material-symbols:check" class="w-3.5 h-3.5 text-white" />
                </div>
                <Icon 
                  :name="allergen === 'Dairy' 
                    ? 'material-symbols:water-drop'
                    : allergen === 'Eggs'
                    ? 'game-icons:spotted-egg'
                    : allergen === 'Nuts'
                    ? 'game-icons:walnut'
                    : allergen === 'Gluten'
                    ? 'game-icons:wheat'
                    : allergen === 'Seafood'
                    ? 'game-icons:fish'
                    : allergen === 'Soy'
                    ? 'game-icons:soy'
                    : 'game-icons:wheat'"
                  class="w-5 h-5"
                />
                {{ allergen }}
              </button>
              <!-- None option -->
              <button
                type="button"
                @click="toggleNoAllergens"
                class="relative px-3 py-2 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
                :class="[
                  noAllergens
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-surface-hover bg-surface border-theme'
                ]"
              >
                <!-- Selected indicator -->
                <div 
                  v-if="noAllergens"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center shadow-lg"
                >
                  <Icon name="material-symbols:check" class="w-3.5 h-3.5 text-white" />
                </div>
                <Icon name="material-symbols:check-circle" class="w-5 h-5" />
                None
              </button>
            </div>
          </div>

          <!-- Ingredients -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-primary">
              Ingredients <span class="text-red-500 font-bold text-lg">*</span>
            </label>
            
            <!-- Ingredients List -->
            <div class="space-y-2">
              <div 
                v-for="(ingredient, index) in ingredients" 
                :key="index"
                class="flex items-center gap-2"
              >
                <input
                  v-model="ingredients[index]"
                  type="text"
                  :placeholder="'e.g. 2 cups rice'"
                  class="flex-1 px-4 py-2 rounded-xl border border-theme bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
                <button
                  @click="removeIngredient(index)"
                  type="button"
                  class="p-2 rounded-xl text-error hover:bg-surface-hover transition-colors"
                >
                  <Icon name="material-symbols:delete-outline" class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Add Ingredient Button -->
              <button
                @click="addIngredient"
                type="button"
                class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-theme bg-surface hover:bg-surface-hover transition-colors"
              >
                <Icon name="material-symbols:add" class="w-5 h-5 text-primary" />
                <span class="text-sm text-primary">Add Ingredient</span>
              </button>
            </div>
          </div>

          <!-- Photos Upload -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-primary">
              Recipe Photos <span class="text-red-500 font-bold text-lg">*</span>
            </label>
            
            <!-- Cloudinary Image Upload Component -->
            <ImageUpload
              ref="imageUploadRef"
              label=""
              :multiple="true"
              :maxFiles="5"
              previewSize="md"
              :required="true"
              @error="handleUploadError"
            />
          </div>

          <!-- Video URL -->
          <div class="space-y-2">
            <label for="video-url" class="block text-sm font-medium text-primary">
              Instruction Video URL <span class="text-red-500 font-bold text-lg">*</span>
            </label>
            <div class="space-y-2">
              <input
                id="video-url"
                v-model="videoUrl"
                type="url"
                placeholder="e.g. https://youtube.com/watch?v=..."
                class="w-full px-4 py-2 rounded-xl border border-theme bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                :class="{ 'border-error': videoInfo.error }"
                required
              />
              
              <!-- Error message -->
              <p v-if="videoInfo.error" class="text-sm text-error">
                {{ videoInfo.error }}
              </p>
              
              <!-- Video thumbnail -->
              <div 
                v-if="videoUrl && !videoInfo.error" 
                class="relative aspect-video rounded-xl overflow-hidden bg-surface border border-theme"
              >
                <!-- Loading state -->
                <div 
                  v-if="isLoadingThumbnail"
                  class="absolute inset-0 flex items-center justify-center bg-surface"
                >
                  <Icon name="material-symbols:sync" class="w-8 h-8 animate-spin text-primary" />
                </div>
                
                <!-- Thumbnail -->
                <template v-else>
                  <img 
                    v-if="videoInfo.thumbnailUrl"
                    :src="videoInfo.thumbnailUrl" 
                    alt="Video thumbnail"
                    class="w-full h-full object-cover"
                    @error="handleThumbnailError"
                  />
                  <!-- Fallback when no thumbnail is available -->
                  <div 
                    v-else 
                    class="absolute inset-0 flex items-center justify-center bg-surface"
                  >
                    <Icon 
                      :name="videoInfo.provider === 'youtube' 
                        ? 'logos:youtube-icon' 
                        : videoInfo.provider === 'vimeo'
                        ? 'logos:vimeo-icon'
                        : videoInfo.provider === 'facebook'
                        ? 'logos:facebook'
                        : videoInfo.provider === 'instagram'
                        ? 'logos:instagram-icon'
                        : videoInfo.provider === 'tiktok'
                        ? 'logos:tiktok-icon'
                        : videoInfo.provider === 'dailymotion'
                        ? 'simple-icons:dailymotion'
                        : 'material-symbols:video-library'"
                      class="w-12 h-12 opacity-50"
                    />
                  </div>
                </template>
                
                <!-- Platform overlay -->
                <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <div class="flex items-center gap-2">
                    <Icon 
                      :name="videoInfo.provider === 'youtube' 
                        ? 'logos:youtube-icon' 
                        : videoInfo.provider === 'vimeo'
                        ? 'logos:vimeo-icon'
                        : videoInfo.provider === 'facebook'
                        ? 'logos:facebook'
                        : videoInfo.provider === 'instagram'
                        ? 'logos:instagram-icon'
                        : videoInfo.provider === 'tiktok'
                        ? 'logos:tiktok-icon'
                        : videoInfo.provider === 'dailymotion'
                        ? 'simple-icons:dailymotion'
                        : 'material-symbols:video-library'"
                      class="w-5 h-5"
                    />
                    <span class="text-sm text-white font-medium">
                      {{ videoInfo.provider 
                        ? videoInfo.provider.charAt(0).toUpperCase() + videoInfo.provider.slice(1)
                        : 'Video' 
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Import necessary composables and types
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Recipe, MealType } from '~/types/recipe'
import { useRecipes } from '~/composables/useRecipes'
import { useAuth } from '~/composables/useAuth'
import { useVideoUrl } from '~/composables/useVideoUrl'
import ImageUpload from '~/components/ImageUpload.vue'

// Router for navigation
const router = useRouter()

// Get recipes composable
const { createRecipe, isLoading: isCreating, error: createError } = useRecipes()

// Get auth state
const { isAuthenticated, user } = useAuth()

// Refs for components
const imageUploadRef = ref<InstanceType<typeof ImageUpload> | null>(null)

// Form state
const isSaving = ref(false)
const isUploading = ref(false) // Track Cloudinary upload state
const ingredients = ref<string[]>(['']) // Start with one empty ingredient
const successMessage = ref('')
const errorMessage = ref('')
const uploadedImageUrls = ref<string[]>([]) // Store Cloudinary URLs
const noAllergens = ref(false) // Track "None" allergen checkbox

// Common allergens list
const commonAllergens = [
  'Dairy',
  'Eggs',
  'Nuts',
  'Gluten',
  'Seafood',
  'Soy',
  'Wheat'
]

// Meal types
const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

// Recipe object
const recipe = ref<Partial<Recipe>>({
  name: '',
  description: '',
  videoUrl: '',
  cookTime: 0,
  allergens: [],
  mealType: [], // Initialize as empty array since it's MealType[]
  creationMode: 'simple',
})

// Video URL handling
const { videoUrl, videoInfo, isLoading: isLoadingThumbnail } = useVideoUrl(recipe.value.videoUrl || '')

// Watch for video URL changes and update recipe
watch(videoUrl, (newUrl) => {
  recipe.value.videoUrl = newUrl
})

// Computed properties
const isFormValid = computed(() => {
  // Check if image upload component has files selected
  const hasSelectedImages = imageUploadRef.value?.hasSelectedFiles || uploadedImageUrls.value.length > 0
  
  // Check if cooking time is valid (greater than 0)
  const hasValidCookTime = typeof recipe.value.cookTime === 'number' && recipe.value.cookTime > 0
  
  return !!recipe.value.name && 
         ingredients.value.length > 0 && 
         ingredients.value.every(ing => ing.trim().length > 0) &&
         hasSelectedImages &&
         !!recipe.value.videoUrl &&
         hasValidCookTime &&
         Array.isArray(recipe.value.mealType) &&
         recipe.value.mealType.length > 0
})

const isSubmitDisabled = computed(() => {
  return !isFormValid.value || isSaving.value || isUploading.value
})

/**
 * Add a new empty ingredient to the list
 */
function addIngredient() {
  ingredients.value.push('')
}

/**
 * Remove an ingredient from the list
 * @param index The index of the ingredient to remove
 */
function removeIngredient(index: number) {
  ingredients.value.splice(index, 1)
  
  // Always keep at least one ingredient
  if (ingredients.value.length === 0) {
    ingredients.value.push('')
  }
}

/**
 * Toggle an allergen selection
 * @param allergen The allergen to toggle
 */
function toggleAllergen(allergen: string) {
  if (noAllergens.value) {
    noAllergens.value = false
  }
  
  if (!recipe.value.allergens) {
    recipe.value.allergens = []
  }
  
  const index = recipe.value.allergens.indexOf(allergen)
  if (index === -1) {
    recipe.value.allergens.push(allergen)
  } else {
    recipe.value.allergens.splice(index, 1)
  }
}

/**
 * Toggle the "None" allergens option
 */
function toggleNoAllergens() {
  noAllergens.value = !noAllergens.value
  if (noAllergens.value) {
    recipe.value.allergens = []
  }
}

/**
 * Handle upload errors
 * @param error Error message from the upload process
 */
function handleUploadError(error: string) {
  errorMessage.value = error
  isUploading.value = false
}

/**
 * Handle thumbnail errors
 * @param event Error event from the thumbnail loading process
 */
function handleThumbnailError(event: Event) {
  const img = event.target as HTMLImageElement
  // Fall back to hqdefault thumbnail for YouTube
  if (videoInfo.value.provider === 'youtube' && videoInfo.value.videoId) {
    img.src = `https://i.ytimg.com/vi/${videoInfo.value.videoId}/hqdefault.jpg`
  }
}

/**
 * Save the recipe to Firestore
 */
async function saveRecipe() {
  if (!isFormValid.value) return
  if (!isAuthenticated.value) {
    errorMessage.value = 'You must be logged in to create a recipe'
    return
  }
  
  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    // Upload images if there are any selected
    if (imageUploadRef.value?.hasSelectedFiles) {
      isUploading.value = true
      
      try {
        // Upload the images to Cloudinary
        uploadedImageUrls.value = await imageUploadRef.value.uploadFiles()
      } catch (error: any) {
        errorMessage.value = error.message || 'Failed to upload images. Please try again.'
        isSaving.value = false
        isUploading.value = false
        return
      }
      
      isUploading.value = false
    }
    
    // If we still don't have any image URLs, show an error
    if (uploadedImageUrls.value.length === 0) {
      errorMessage.value = 'At least one image is required'
      isSaving.value = false
      return
    }
    
    // Filter out any empty ingredients
    const filteredIngredients = ingredients.value
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0)
    
    // Ensure cooking time is a valid number
    const cookTime = typeof recipe.value.cookTime === 'number' 
      ? recipe.value.cookTime 
      : parseInt(recipe.value.cookTime as unknown as string, 10) || 0
    
    // Ensure allergens is a valid array (empty array means no allergens)
    const allergens = Array.isArray(recipe.value.allergens) 
      ? recipe.value.allergens 
      : []

    // Ensure meal type is a valid array
    const mealType = Array.isArray(recipe.value.mealType)
      ? recipe.value.mealType
      : []
    
    // Update recipe object with all fields
    const recipeData: Partial<Recipe> = {
      ...recipe.value,
      ingredients: filteredIngredients,
      imageUrl: uploadedImageUrls.value[0], // Main image is the first one
      gallery: uploadedImageUrls.value, // All images in the gallery
      cookTime: cookTime, // Ensure cookTime is a number
      allergens: allergens, // Ensure allergens is an array
      mealType: mealType, // Ensure mealType is properly set
      creationMode: 'simple',
      status: 'published',
      isPublic: true
    }
    
    // Create the recipe in Firestore
    const createdRecipe = await createRecipe(recipeData, [])
    
    // Show success message
    successMessage.value = 'Recipe created successfully!'
    
    // Reset the image upload component
    imageUploadRef.value?.reset()
    
    // Navigate to the recipe detail page
    setTimeout(() => {
      router.push(`/recipes/${createdRecipe.id}`)
    }, 1500)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to create recipe. Please try again.'
    console.error('Error saving recipe:', error)
  } finally {
    isSaving.value = false
  }
}
</script> 