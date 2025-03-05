<!--
  File: pages/[id].vue
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

      <!-- Share Button -->
      <button
        @click="shareRecipe"
        class="p-2 rounded-xl transition-colors flex items-center text-muted hover:bg-surface-hover"
        aria-label="Share recipe"
      >
        <Icon name="material-symbols:share" class="w-5 h-5" />
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto overscroll-contain">
      <div v-if="recipe" class="pb-safe-bottom">
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
              <p class="text-sm text-white/80">By {{ recipe.author }}</p>
              <button
                @click="showTipModal = true"
                class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform hover:scale-105"
              >
                <Icon name="material-symbols:payments-outline" class="w-5 h-5" />
                <span>Support Chef</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Recipe Info -->
        <div class="px-4 py-6 space-y-6">
          <!-- Quick Info -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <Icon name="material-symbols:star" class="w-5 h-5 text-yellow-500" />
              <span class="text-secondary">{{ recipe.rating }}</span>
              <span class="text-sm text-muted">({{ recipe.numReviews }})</span>
            </div>
            
            <!-- Start Cooking Button -->
            <button
              @click="showCookingMode = true"
              class="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              <Icon name="material-symbols:cooking" class="w-5 h-5" />
              <span>Start Cooking</span>
            </button>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-lg font-medium text-primary mb-2">About</h3>
            <p class="text-secondary">{{ recipe.description }}</p>
          </div>

          <!-- Allergens Warning -->
          <div v-if="recipe.allergens.length > 0" class="p-4 rounded-xl bg-amber-500/10">
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
              <div class="flex items-center justify-between py-2 border-b border-theme">
                <span class="text-secondary">Ethnic Group</span>
                <span class="text-primary">{{ recipe.ethnicGroup }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-theme">
                <span class="text-secondary">Meal Type</span>
                <span class="text-primary">{{ recipe.mealType }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-theme">
                <span class="text-secondary">Difficulty</span>
                <span class="text-primary">{{ recipe.difficulty }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-secondary">Cooking Time</span>
                <span class="text-primary">{{ recipe.cookingTime }} minutes</span>
              </div>
            </div>
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

          <!-- Ingredients Section -->
          <div class="p-4 rounded-xl bg-surface border-theme">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-primary">Ingredients</h3>
              <span class="text-sm text-muted">{{ recipe.ingredients.length }} items</span>
            </div>
            <ul class="space-y-3">
              <li 
                v-for="ingredient in recipe.ingredients" 
                :key="ingredient.name"
                class="flex items-center justify-between"
              >
                <span class="text-secondary">{{ ingredient.name }}</span>
                <span class="text-primary">
                  {{ ingredient.amount }} {{ ingredient.unit }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Instructions Section -->
          <div class="p-4 rounded-xl bg-surface border-theme">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-primary">Instructions</h3>
              <span class="text-sm text-muted">{{ recipe.instructions.length }} steps</span>
            </div>
            <ol class="space-y-4">
              <li 
                v-for="instruction in recipe.instructions" 
                :key="instruction.step"
                class="flex gap-4"
              >
                <div 
                  class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium"
                >
                  {{ instruction.step }}
                </div>
                <p class="flex-1 text-secondary pt-1.5">
                  {{ instruction.text }}
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="p-4">
        <div class="animate-pulse space-y-4">
          <div class="h-64 bg-surface rounded-xl" />
          <div class="h-8 bg-surface rounded-lg w-3/4" />
          <div class="space-y-2">
            <div class="h-4 bg-surface rounded w-1/2" />
            <div class="h-4 bg-surface rounded w-1/3" />
          </div>
        </div>
      </div>
    </main>

    <!-- Tip Modal -->
    <div
      v-if="showTipModal"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="showTipModal = false"
      />

      <!-- Modal Content -->
      <div class="relative w-full max-w-sm bg-surface rounded-2xl p-6 space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-primary">Support {{ recipe?.author }}</h3>
          <p class="text-sm text-secondary mt-1">Show your appreciation for this amazing recipe</p>
        </div>

        <!-- Tip Amount Selection -->
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="amount in tipAmounts"
            :key="amount"
            @click="selectedTipAmount = amount"
            class="p-3 rounded-xl border transition-all text-center"
            :class="[
              selectedTipAmount === amount
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-theme text-secondary hover:border-primary/30'
            ]"
          >
            <span class="block font-medium">GH₵{{ amount }}</span>
            <span class="text-xs text-muted">Cedis</span>
          </button>
        </div>

        <!-- Custom Amount -->
        <div>
          <label class="block text-sm font-medium text-secondary mb-2">
            Or enter custom amount
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted">GH₵</span>
            <input
              v-model="customTipAmount"
              type="number"
              min="1"
              step="1"
              placeholder="0"
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-surface border-theme focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        <!-- Payment Method Selection -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-secondary">
            Select payment method
          </label>
          <button
            v-for="method in paymentMethods"
            :key="method.id"
            @click="selectedPaymentMethod = method.id"
            class="w-full flex items-center gap-3 p-3 rounded-xl border transition-all"
            :class="[
              selectedPaymentMethod === method.id
                ? 'border-primary bg-primary/10'
                : 'border-theme hover:border-primary/30'
            ]"
          >
            <Icon :name="method.icon" class="w-5 h-5 text-primary" />
            <div class="flex-1">
              <span class="text-secondary">{{ method.name }}</span>
              <p class="text-xs text-muted">{{ method.description }}</p>
            </div>
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="showTipModal = false"
            class="flex-1 py-2.5 rounded-xl border border-theme text-secondary hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            @click="processTip"
            class="flex-1 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canProcessTip"
          >
            Send Tip
          </button>
        </div>
      </div>
    </div>

    <!-- Cooking Mode Modal -->
    <div
      v-if="showCookingMode"
      class="fixed inset-0 z-50 flex items-stretch"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="confirmExitCookingMode"
      />

      <!-- Modal Content -->
      <div class="relative w-full max-w-2xl mx-auto bg-surface flex flex-col h-full">
        <!-- Top Bar -->
        <div class="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-theme bg-inherit">
          <div class="flex items-center gap-3">
            <button 
              @click="confirmExitCookingMode"
              class="p-2 -ml-2 rounded-xl transition-colors flex items-center text-muted hover:bg-surface-hover"
            >
              <Icon name="material-symbols:close" class="w-5 h-5" />
            </button>
            <h2 class="text-lg font-semibold text-primary">Cooking Mode</h2>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto p-4 space-y-6">
          <!-- Main Timer Section -->
          <div class="text-center p-6 rounded-2xl bg-surface border-theme space-y-4">
            <div class="flex items-center justify-center gap-3">
              <Icon 
                name="material-symbols:timer" 
                class="w-8 h-8 text-primary"
                :class="{ 'animate-pulse': activeTimer && !activeTimer.isPaused }"
              />
              <h3 class="text-4xl font-semibold text-primary font-mono">
                {{ activeTimer ? formatTime(activeTimer.remaining) : '00:00' }}
              </h3>
            </div>
            <div class="flex items-center justify-center gap-3">
              <button
                v-if="!activeTimer"
                @click="showTimerModal = true"
                class="px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                Set Timer
              </button>
              <template v-else>
                <button
                  @click="pauseTimer"
                  class="px-4 py-2 rounded-xl border border-theme text-secondary hover:bg-surface-hover transition-colors"
                >
                  {{ activeTimer.isPaused ? 'Resume' : 'Pause' }}
                </button>
                <button
                  @click="stopTimer"
                  class="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Stop
                </button>
              </template>
            </div>
          </div>

          <!-- Video Section (if available) -->
          <div v-if="recipe?.videoUrl" class="rounded-2xl overflow-hidden bg-surface border-theme">
            <div class="relative w-full pb-[56.25%]">
              <iframe
                :src="getEmbedUrl(recipe.videoUrl)"
                class="absolute inset-0 w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <!-- Progress Indicator -->
          <div class="flex items-center justify-between px-4">
            <!-- ... existing progress indicator code ... -->
          </div>

          <!-- Dynamic Content Section (Ingredients or Instructions) -->
          <div class="space-y-4">
            <!-- Ingredients Section (shown when not all checked) -->
            <div v-if="!allIngredientsChecked">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-primary">Ingredients Checklist</h3>
                <button
                  @click="toggleAllIngredients"
                  class="text-sm text-primary hover:text-primary/80"
                >
                  Check All
                </button>
              </div>
              <div class="space-y-2 mt-4">
                <label
                  v-for="ingredient in recipe?.ingredients || []"
                  :key="ingredient.name"
                  class="flex items-center gap-3 p-3 rounded-xl border border-theme hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    v-model="checkedIngredients"
                    :value="ingredient.name"
                    class="w-5 h-5 rounded-lg text-primary focus:ring-primary"
                  />
                  <span 
                    class="flex-1 text-secondary"
                    :class="{ 'line-through text-muted': checkedIngredients.includes(ingredient.name) }"
                  >
                    {{ ingredient.name }}
                  </span>
                  <span 
                    class="text-primary"
                    :class="{ 'text-muted': checkedIngredients.includes(ingredient.name) }"
                  >
                    {{ ingredient.amount }} {{ ingredient.unit }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Instructions Section (shown when all ingredients checked) -->
            <div v-else>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-primary">Instructions</h3>
                <button
                  @click="toggleAllIngredients"
                  class="text-sm text-primary hover:text-primary/80"
                >
                  Back to Ingredients
                </button>
              </div>
              <div class="space-y-3 mt-4">
                <div
                  v-for="instruction in recipe?.instructions || []"
                  :key="instruction.step"
                  class="flex gap-4 p-4 rounded-xl border border-theme"
                  :class="[
                    completedSteps.includes(instruction.step)
                      ? 'bg-primary/5 border-primary/20'
                      : currentStep === instruction.step
                      ? 'bg-surface-hover'
                      : ''
                  ]"
                >
                  <div 
                    class="flex-none w-8 h-8 rounded-full flex items-center justify-center font-medium"
                    :class="[
                      completedSteps.includes(instruction.step)
                        ? 'bg-primary/20 text-primary'
                        : 'bg-primary text-white'
                    ]"
                  >
                    {{ instruction.step }}
                  </div>
                  <div class="flex-1 space-y-2">
                    <p 
                      class="text-secondary pt-1"
                      :class="{ 'line-through text-muted': completedSteps.includes(instruction.step) }"
                    >
                      {{ instruction.text }}
                    </p>
                    <button
                      @click="toggleStep(instruction.step)"
                      class="text-sm text-primary hover:text-primary/80"
                    >
                      {{ completedSteps.includes(instruction.step) ? 'Mark Incomplete' : 'Mark Complete' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Finish Cooking Button (shown when all steps completed) -->
            <div 
              v-if="allIngredientsChecked && completedSteps.length === recipe?.instructions.length"
              class="mt-8 text-center"
            >
              <button
                @click="showReviewModal = true"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform hover:scale-105"
              >
                <Icon name="material-symbols:done-all" class="w-5 h-5" />
                <span>Finish Cooking</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Timer Modal -->
    <div
      v-if="showTimerModal"
      class="fixed inset-0 z-[60] flex items-center justify-center px-4"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50"
        @click="showTimerModal = false"
      />

      <!-- Modal Content -->
      <div class="relative w-full max-w-sm bg-surface rounded-2xl p-6 space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-primary">Set Timer</h3>
          <p class="text-sm text-secondary mt-1">Choose duration in minutes</p>
        </div>

        <!-- Timer Presets -->
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="duration in [5, 10, 15, 20, 30, 45]"
            :key="duration"
            @click="setTimer(duration)"
            class="p-3 rounded-xl border transition-all text-center hover:border-primary/30"
          >
            <span class="block font-medium text-secondary">{{ duration }}m</span>
          </button>
        </div>

        <!-- Custom Duration -->
        <div>
          <label class="block text-sm font-medium text-secondary mb-2">
            Or enter custom duration
          </label>
          <div class="flex gap-3">
            <input
              v-model="customDuration"
              type="number"
              min="1"
              placeholder="Minutes"
              class="flex-1 px-4 py-2 rounded-lg bg-surface border-theme focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            <button
              @click="setTimer(Number(customDuration))"
              class="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              :disabled="!customDuration"
            >
              Set
            </button>
          </div>
        </div>

        <!-- Active Timer -->
        <div v-if="activeTimer" class="text-center space-y-4">
          <div>
            <h4 class="text-2xl font-semibold text-primary">{{ formatTime(activeTimer.remaining) }}</h4>
            <p class="text-sm text-muted">Time Remaining</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="pauseTimer"
              class="flex-1 py-2 rounded-xl border border-theme text-secondary hover:bg-surface-hover transition-colors"
            >
              {{ activeTimer.isPaused ? 'Resume' : 'Pause' }}
            </button>
            <button
              @click="stopTimer"
              class="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Exit Cooking Mode Confirmation -->
    <div
      v-if="showExitConfirmation"
      class="fixed inset-0 z-[70] flex items-center justify-center px-4"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50"
        @click="showExitConfirmation = false"
      />

      <!-- Modal Content -->
      <div class="relative w-full max-w-sm bg-surface rounded-2xl p-6 space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-primary">Exit Cooking Mode?</h3>
          <p class="text-sm text-secondary mt-1">Your progress will be lost</p>
        </div>

        <div class="flex gap-3">
          <button
            @click="showExitConfirmation = false"
            class="flex-1 py-2.5 rounded-xl border border-theme text-secondary hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            @click="exitCookingMode"
            class="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div
      v-if="showReviewModal"
      class="fixed inset-0 z-[70] flex items-center justify-center px-4"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        @click="showReviewModal = false"
      />

      <!-- Modal Content -->
      <div class="relative w-full max-w-sm bg-surface rounded-2xl p-6 space-y-6">
        <div class="text-center">
          <h3 class="text-xl font-semibold text-primary">Rate Your Experience</h3>
          <p class="text-sm text-secondary mt-1">How was your cooking experience?</p>
        </div>

        <!-- Star Rating -->
        <div class="flex items-center justify-center gap-2">
          <button
            v-for="star in 5"
            :key="star"
            @click="reviewRating = star"
            class="p-1 transition-transform hover:scale-110"
          >
            <Icon
              name="material-symbols:star"
              class="w-8 h-8"
              :class="star <= reviewRating ? 'text-yellow-500' : 'text-muted'"
            />
          </button>
        </div>

        <!-- Review Text -->
        <div>
          <label class="block text-sm font-medium text-secondary mb-2">
            Share your thoughts (optional)
          </label>
          <textarea
            v-model="reviewText"
            rows="3"
            placeholder="How did the recipe turn out? Any tips for others?"
            class="w-full px-4 py-3 rounded-xl bg-surface border-theme focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="showReviewModal = false"
            class="flex-1 py-2.5 rounded-xl border border-theme text-secondary hover:bg-surface-hover transition-colors"
          >
            Cancel
          </button>
          <button
            @click="submitReview"
            class="flex-1 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
            :disabled="!reviewRating"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

// Import recipes data
import recipesData from '@/data/recipes.json'

// Get recipe by ID from route params
const recipe = computed(() => {
  return recipesData.recipes.find(r => r.id === route.params.id)
})

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

// Function to convert YouTube URL to embed URL
function getEmbedUrl(url: string) {
  const videoId = url.split('v=')[1]
  return `https://www.youtube.com/embed/${videoId}`
}

// Tipping functionality
const showTipModal = ref(false)
const tipAmounts = [10, 20, 50]
const selectedTipAmount = ref(0)
const customTipAmount = ref('')
const selectedPaymentMethod = ref('')

const paymentMethods = [
  { 
    id: 'momo',
    name: 'Mobile Money',
    description: 'MTN, Vodafone, or AirtelTigo',
    icon: 'material-symbols:smartphone'
  },
  { 
    id: 'card',
    name: 'Card Payment',
    description: 'Local and International cards accepted',
    icon: 'material-symbols:credit-card'
  }
]

// Computed property to check if tip can be processed
const canProcessTip = computed(() => {
  const amount = selectedTipAmount.value || Number(customTipAmount.value)
  return amount > 0 && selectedPaymentMethod.value
})

// Process tip
async function processTip() {
  const amount = selectedTipAmount.value || Number(customTipAmount.value)
  
  try {
    // TODO: Implement actual payment processing
    console.log('Processing tip:', {
      amount,
      paymentMethod: selectedPaymentMethod.value,
      chef: recipe.value?.author,
      recipe: recipe.value?.name
    })
    
    // Show success message
    // TODO: Add toast notification
    showTipModal.value = false
  } catch (error) {
    console.error('Error processing tip:', error)
  }
}

// Cooking mode state
const showCookingMode = ref(false)
const showExitConfirmation = ref(false)
const checkedIngredients = ref<string[]>([])
const completedSteps = ref<number[]>([])
const currentStep = ref(1)

// Timer functionality
const showTimerModal = ref(false)
const customDuration = ref('')
const activeTimer = ref<{
  duration: number
  remaining: number
  isPaused: boolean
  intervalId?: ReturnType<typeof setInterval>
} | null>(null)

// Computed for ingredients checklist
const allIngredientsChecked = computed(() => {
  if (!recipe.value) return false
  return checkedIngredients.value.length === recipe.value.ingredients.length
})

// Toggle all ingredients
function toggleAllIngredients() {
  if (!recipe.value) return
  if (allIngredientsChecked.value) {
    checkedIngredients.value = []
  } else {
    checkedIngredients.value = recipe.value.ingredients.map(i => i.name)
  }
}

// Toggle instruction step completion
function toggleStep(step: number) {
  const index = completedSteps.value.indexOf(step)
  if (index === -1) {
    completedSteps.value.push(step)
    if (step === currentStep.value && recipe.value) {
      currentStep.value = Math.min(currentStep.value + 1, recipe.value.instructions.length)
    }
  } else {
    completedSteps.value.splice(index, 1)
  }
}

// Timer functions
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function setTimer(minutes: number) {
  if (activeTimer.value) {
    stopTimer()
  }
  
  const seconds = minutes * 60
  activeTimer.value = {
    duration: seconds,
    remaining: seconds,
    isPaused: false
  }
  
  startTimer()
  showTimerModal.value = false
  customDuration.value = ''
}

function startTimer() {
  if (!activeTimer.value || activeTimer.value.intervalId) return
  
  activeTimer.value.intervalId = setInterval(() => {
    if (activeTimer.value && !activeTimer.value.isPaused) {
      if (activeTimer.value.remaining <= 0) {
        stopTimer()
        // TODO: Show notification
        return
      }
      activeTimer.value.remaining--
    }
  }, 1000) as ReturnType<typeof setInterval>
}

function pauseTimer() {
  if (!activeTimer.value) return
  activeTimer.value.isPaused = !activeTimer.value.isPaused
}

function stopTimer() {
  if (!activeTimer.value) return
  if (activeTimer.value.intervalId) {
    clearInterval(activeTimer.value.intervalId)
  }
  activeTimer.value = null
}

function startStepTimer(instruction: { text: string }) {
  // Extract time from instruction text (e.g., "cook for 10 minutes")
  const timeMatch = instruction.text.match(/(\d+)\s*(?:minute|min|minutes)/i)
  if (timeMatch) {
    const minutes = parseInt(timeMatch[1])
    showTimerModal.value = true
    customDuration.value = minutes.toString()
  } else {
    showTimerModal.value = true
  }
}

// Exit confirmation
function confirmExitCookingMode() {
  if (checkedIngredients.value.length > 0 || completedSteps.value.length > 0) {
    showExitConfirmation.value = true
  } else {
    exitCookingMode()
  }
}

// Update page metadata
useHead(() => ({
  title: recipe.value ? `${recipe.value.name} - Obiabedidi` : 'Recipe - Obiabedidi',
  meta: [
    {
      name: 'description',
      content: recipe.value?.description || 'Discover authentic Ghanaian recipes'
    }
  ]
}))

// Review state
const showReviewModal = ref(false)
const reviewRating = ref(0)
const reviewText = ref('')

// Submit review
async function submitReview() {
  if (!recipe.value || !reviewRating.value) return

  try {
    // TODO: Implement actual review submission
    console.log('Submitting review:', {
      recipeId: recipe.value.id,
      rating: reviewRating.value,
      text: reviewText.value,
      date: new Date().toISOString()
    })
    
    // Reset state and exit cooking mode
    showReviewModal.value = false
    exitCookingMode()
    
    // TODO: Show success toast
  } catch (error) {
    console.error('Error submitting review:', error)
    // TODO: Show error toast
  }
}

// Update exitCookingMode to reset review state
function exitCookingMode() {
  stopTimer()
  showCookingMode.value = false
  showExitConfirmation.value = false
  showReviewModal.value = false
  checkedIngredients.value = []
  completedSteps.value = []
  currentStep.value = 1
  reviewRating.value = 0
  reviewText.value = ''
}
</script>

<style scoped>
.pb-safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style> 