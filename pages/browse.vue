<!--
  File: pages/browse.vue
  Browse page for listing all available recipes
  Maintains consistent design with index page
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
          Browse Recipes
        </h1>
      </div>

      <!-- Scroll to Top -->
      <button
        v-show="showScrollToTop"
        @click="scrollToTop"
        class="p-2 rounded-xl transition-colors flex items-center text-muted hover:bg-surface-hover"
        aria-label="Scroll to top"
      >
        <Icon name="material-symbols:arrow-upward" class="w-5 h-5" />
      </button>
    </div>

    <!-- Main Content -->
    <main 
      class="flex-1 overflow-y-auto overscroll-contain" 
      @scroll="handleScroll"
    >
      <div class="px-4 py-6">
        <div class="max-w-2xl mx-auto">
          <!-- Filters -->
          <div class="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div class="flex gap-2 min-w-max">
              <button
                v-for="filter in filters"
                :key="filter.id"
                @click="toggleFilter(filter.id)"
                class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                :class="[
                  activeFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-surface-hover'
                ]"
              >
                <div class="flex items-center gap-2">
                  <Icon :name="filter.icon" class="w-4 h-4" />
                  <span>{{ filter.name }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Filter By Button and Panel -->
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <button
                @click="isFilterOpen = !isFilterOpen"
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                :class="[
                  hasActiveFilters
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-surface-hover'
                ]"
              >
                <Icon 
                  name="material-symbols:filter-list" 
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': isFilterOpen }"
                />
                <span>Filter by</span>
                <span 
                  v-if="activeFilterCount > 0"
                  class="ml-1 px-1.5 py-0.5 text-xs rounded-md bg-white/20"
                >
                  {{ activeFilterCount }}
                </span>
              </button>

              <!-- Clear Filters -->
              <button
                v-if="hasActiveFilters"
                @click="clearFilters"
                class="text-sm transition-colors text-muted hover:text-primary"
              >
                Clear all
              </button>
            </div>

            <!-- Expandable Filter Section -->
            <div
              v-show="isFilterOpen"
              class="mt-4 space-y-6 overflow-hidden transition-all duration-200"
            >
              <!-- Ethnic Group -->
              <div>
                <h4 class="text-sm font-medium mb-3 text-primary">
                  Ethnic Group
                </h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="group in ethnicGroups"
                    :key="group"
                    @click="toggleEthnicGroup(group)"
                    class="px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                    :class="[
                      selectedFilters.ethnicGroup.includes(group)
                        ? 'bg-primary text-white'
                        : 'text-muted hover:bg-surface-hover bg-surface border-theme'
                    ]"
                  >
                    {{ group }}
                  </button>
                </div>
              </div>

              <!-- Serving Size -->
              <div>
                <h4 class="text-sm font-medium mb-3 text-primary">
                  Serving Size
                </h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="size in servingSizes"
                    :key="size.id"
                    @click="toggleServingSize(size.id)"
                    class="px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                    :class="[
                      selectedFilters.servingSize === size.id
                        ? 'bg-primary text-white'
                        : 'text-muted hover:bg-surface-hover bg-surface border-theme'
                    ]"
                  >
                    {{ size.label }}
                  </button>
                </div>
              </div>

              <!-- Difficulty -->
              <div>
                <h4 class="text-sm font-medium mb-3 text-primary">
                  Difficulty
                </h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="level in difficultyLevels"
                    :key="level"
                    @click="toggleDifficulty(level)"
                    class="px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                    :class="[
                      selectedFilters.difficulty === level
                        ? 'bg-primary text-white'
                        : 'text-muted hover:bg-surface-hover bg-surface border-theme'
                    ]"
                  >
                    {{ level }}
                  </button>
                </div>
              </div>

              <!-- Meal Type -->
              <div>
                <h4 class="text-sm font-medium mb-3 text-primary">
                  Meal Type
                </h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="type in mealTypes"
                    :key="type"
                    @click="toggleMealType(type)"
                    class="px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                    :class="[
                      selectedFilters.mealType === type
                        ? 'bg-primary text-white'
                        : 'text-muted hover:bg-surface-hover bg-surface border-theme'
                    ]"
                  >
                    {{ type }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recipe List -->
          <div class="space-y-4">
            <div 
              v-for="recipe in filteredRecipes" 
              :key="recipe.id"
              class="p-4 rounded-2xl transition-all duration-200 bg-surface hover:bg-surface-hover border-theme cursor-pointer"
              @click="router.push(`/${recipe.id}`)"
            >
              <div class="flex items-start gap-4">
                <!-- Recipe Image -->
                <img 
                  :src="recipe.imageUrl" 
                  :alt="recipe.name"
                  class="w-20 h-20 rounded-xl object-cover"
                />

                <div class="flex-1">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="font-medium text-primary">{{ recipe.name }}</h3>
                      <p class="text-sm text-muted mt-1">By {{ recipe.author }}</p>
                      
                      <div class="flex items-center gap-4 mt-3">
                        <div class="flex items-center gap-1">
                          <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-500" />
                          <span class="text-sm text-secondary">{{ recipe.rating }}</span>
                          <span class="text-xs text-muted">({{ recipe.numReviews }})</span>
                        </div>
                        
                        <div class="flex items-center gap-1">
                          <Icon name="material-symbols:timer-outline" class="w-4 h-4 text-muted" />
                          <span class="text-sm text-secondary">{{ recipe.cookingTime }}m</span>
                        </div>
                      </div>
                    </div>

                    <!-- Allergy Warning -->
                    <div v-if="recipe.allergens.length > 0" class="flex items-center gap-1">
                      <Icon 
                        name="material-symbols:warning" 
                        class="w-4 h-4 text-amber-500"
                      />
                      <span class="text-xs font-medium text-amber-500">
                        Contains: {{ recipe.allergens.join(', ') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const colorMode = useColorMode()

// Import recipes data
import recipesData from '@/data/recipes.json'
const recipes = recipesData.recipes

// Scroll to top functionality
const showScrollToTop = ref(false)

function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  showScrollToTop.value = target.scrollTop > 200
}

function scrollToTop() {
  const mainElement = document.querySelector('main')
  if (mainElement) {
    mainElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

// Filter states
const isFilterOpen = ref(false)
const activeFilter = ref('all')
const selectedFilters = reactive({
  ethnicGroup: [] as string[],
  servingSize: '',
  difficulty: '',
  mealType: ''
})

// Filter options
const filters = [
  { id: 'all', name: 'All', icon: 'material-symbols:grid-view' },
  { id: 'trending', name: 'Trending', icon: 'material-symbols:local-fire-department' },
  { id: 'new', name: 'New', icon: 'material-symbols:new-releases' },
  { id: 'top-rated', name: 'Top Rated', icon: 'material-symbols:star' }
]

// Get unique ethnic groups from recipes
const ethnicGroups = [...new Set(recipes.map(r => r.ethnicGroup))]

const servingSizes = [
  { id: 'small', label: '1-2 people' },
  { id: 'medium', label: '3-4 people' },
  { id: 'large', label: '5+ people' }
]
const difficultyLevels = ['Easy', 'Medium', 'Hard']
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

// Computed properties
const hasActiveFilters = computed(() => {
  return selectedFilters.ethnicGroup.length > 0 ||
    selectedFilters.servingSize !== '' ||
    selectedFilters.difficulty !== '' ||
    selectedFilters.mealType !== ''
})

const activeFilterCount = computed(() => {
  let count = selectedFilters.ethnicGroup.length
  if (selectedFilters.servingSize) count++
  if (selectedFilters.difficulty) count++
  if (selectedFilters.mealType) count++
  return count
})

const filteredRecipes = computed(() => {
  let result = [...recipes]

  // Apply main filter
  if (activeFilter.value !== 'all') {
    switch (activeFilter.value) {
      case 'trending':
        result = result.filter(r => r.isTrending)
        break
      case 'new':
        result = result.filter(r => r.isNew)
        break
      case 'top-rated':
        result = result.filter(r => parseFloat(r.rating) >= 4.5)
        break
    }
  }

  // Apply detailed filters
  if (selectedFilters.ethnicGroup.length > 0) {
    result = result.filter(r => selectedFilters.ethnicGroup.includes(r.ethnicGroup))
  }
  if (selectedFilters.servingSize) {
    result = result.filter(r => r.servingSize === selectedFilters.servingSize)
  }
  if (selectedFilters.difficulty) {
    result = result.filter(r => r.difficulty === selectedFilters.difficulty)
  }
  if (selectedFilters.mealType) {
    result = result.filter(r => r.mealType === selectedFilters.mealType)
  }

  return result
})

// Methods
function toggleFilter(id: string) {
  activeFilter.value = id
}

function toggleEthnicGroup(group: string) {
  const index = selectedFilters.ethnicGroup.indexOf(group)
  if (index === -1) {
    selectedFilters.ethnicGroup.push(group)
  } else {
    selectedFilters.ethnicGroup.splice(index, 1)
  }
}

function toggleServingSize(size: string) {
  selectedFilters.servingSize = selectedFilters.servingSize === size ? '' : size
}

function toggleDifficulty(level: string) {
  selectedFilters.difficulty = selectedFilters.difficulty === level ? '' : level
}

function toggleMealType(type: string) {
  selectedFilters.mealType = selectedFilters.mealType === type ? '' : type
}

function clearFilters() {
  selectedFilters.ethnicGroup = []
  selectedFilters.servingSize = ''
  selectedFilters.difficulty = ''
  selectedFilters.mealType = ''
  activeFilter.value = 'all'
}
</script>

<style>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Ensure proper height on iOS */
@supports (-webkit-touch-callout: none) {
  .h-dvh {
    height: -webkit-fill-available;
  }
}
</style> 