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
      ref="mainRef"
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
                    class="relative px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                    :class="[
                      selectedFilters.mealTypes.includes(type)
                        ? 'bg-primary text-white'
                        : 'text-muted hover:bg-surface-hover bg-surface border-theme'
                    ]"
                  >
                    <!-- Selected indicator -->
                    <div 
                      v-if="selectedFilters.mealTypes.includes(type)"
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
            </div>
          </div>

          <!-- Recipe List -->
          <div class="space-y-4">
            <!-- Loading Skeleton -->
            <div 
              v-if="isLoading && !recipes.length"
              class="space-y-4"
            >
              <div 
                v-for="i in 3" 
                :key="i"
                class="p-4 rounded-2xl bg-surface animate-pulse"
              >
                <div class="flex items-start gap-4">
                  <div class="w-20 h-20 rounded-xl bg-surface-hover"></div>
                  <div class="flex-1">
                    <div class="h-5 w-32 bg-surface-hover rounded-lg"></div>
                    <div class="h-4 w-24 bg-surface-hover rounded-lg mt-2"></div>
                    <div class="flex items-center gap-4 mt-3">
                      <div class="h-4 w-16 bg-surface-hover rounded-lg"></div>
                      <div class="h-4 w-16 bg-surface-hover rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div 
              v-else-if="error"
              class="p-4 rounded-2xl bg-red-500/10 text-red-500"
            >
              <div class="flex items-center gap-2">
                <Icon name="material-symbols:error" class="w-5 h-5" />
                <p>{{ error }}</p>
              </div>
              <button
                @click="loadRecipes"
                class="mt-2 text-sm hover:underline"
              >
                Try again
              </button>
            </div>

            <!-- No Results -->
            <div 
              v-else-if="!recipes.length"
              class="p-4 rounded-2xl bg-surface text-center"
            >
              <Icon 
                name="material-symbols:search-off" 
                class="w-8 h-8 text-muted mx-auto"
              />
              <p class="mt-2 text-secondary">No recipes found</p>
              <button
                @click="clearFilters"
                class="mt-2 text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>

            <!-- Recipe Cards -->
            <div 
              v-else
              v-for="recipe in recipes" 
              :key="recipe.id"
              class="p-4 rounded-2xl transition-all duration-200 bg-surface hover:bg-surface-hover border-theme cursor-pointer"
              @click="router.push(`/recipes/${recipe.id}`)"
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
                      <p class="text-sm text-muted mt-1">By {{ recipe.authorName }}</p>
                      
                      <div class="flex items-center gap-4 mt-3">
                        <div class="flex items-center gap-1">
                          <Icon name="material-symbols:star" class="w-4 h-4 text-yellow-500" />
                          <span class="text-sm text-secondary">{{ recipe.rating?.average?.toFixed(1) || '0.0' }}</span>
                          <span class="text-xs text-muted">({{ recipe.rating?.count || 0 }})</span>
                        </div>
                        
                        <div class="flex items-center gap-1">
                          <Icon name="material-symbols:timer-outline" class="w-4 h-4 text-muted" />
                          <span class="text-sm text-secondary">{{ recipe.cookTime || 0 }}m</span>
                        </div>
                      </div>
                    </div>

                    <!-- Allergy Warning -->
                    <div v-if="recipe.allergens?.length" class="flex items-center gap-1">
                      <Icon 
                        name="material-symbols:warning" 
                        class="w-4 h-4 text-amber-500"
                      />
                      <span class="text-xs font-medium text-amber-500">
                        Contains: {{ recipe.allergens?.join(', ') || '' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Load More -->
            <div 
              v-if="hasMore && recipes.length"
              class="py-4 text-center"
            >
              <button
                @click="loadMore"
                class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-muted hover:bg-surface-hover disabled:opacity-50"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Loading...</span>
                <span v-else>Load more</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Speed Dial (only for authenticated users) -->
    <SpeedDial v-if="isAuthReady && isAuthenticated" />
  </div>
</template>

<script setup lang="ts">
const { 
  isAuthReady,
  isAuthenticated, 
} = useAuth()

const router = useRouter()
const colorMode = useColorMode()

// Get recipes composable
const { 
  recipes,
  isLoading,
  error,
  hasMore,
  getAllRecipes 
} = useRecipes()

// Refs
const mainRef = ref<HTMLElement | null>(null)
const showScrollToTop = ref(false)

// Filter states
const isFilterOpen = ref(false)
const activeFilter = ref<'all' | 'trending' | 'new' | 'top-rated'>('all')
const selectedFilters = reactive({
  mealTypes: [] as string[]
})

// Filter options
const filters = [
  { id: 'all' as const, name: 'All', icon: 'material-symbols:grid-view' },
  { id: 'trending' as const, name: 'Trending', icon: 'material-symbols:local-fire-department' },
  { id: 'new' as const, name: 'New', icon: 'material-symbols:new-releases' },
  { id: 'top-rated' as const, name: 'Top Rated', icon: 'material-symbols:star' }
]

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

// Computed properties
const hasActiveFilters = computed(() => {
  return selectedFilters.mealTypes.length > 0
})

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedFilters.mealTypes.length) count++
  return count
})

// Methods
function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  showScrollToTop.value = target.scrollTop > 200

  // Check if we need to load more
  if (!isLoading.value && hasMore.value) {
    const { scrollTop, clientHeight, scrollHeight } = target
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMore()
    }
  }
}

function scrollToTop() {
  mainRef.value?.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

async function loadRecipes() {
  try {
    await getAllRecipes({
      filter: activeFilter.value === 'all' ? undefined : activeFilter.value,
      mealTypes: selectedFilters.mealTypes.length ? selectedFilters.mealTypes : undefined,
      pageSize: 10
    })
  } catch (e) {
    console.error('Error loading recipes:', e)
  }
}

async function loadMore() {
  try {
    await getAllRecipes({
      filter: activeFilter.value === 'all' ? undefined : activeFilter.value,
      mealTypes: selectedFilters.mealTypes.length ? selectedFilters.mealTypes : undefined,
      pageSize: 10,
      loadMore: true
    })
  } catch (e) {
    console.error('Error loading more recipes:', e)
  }
}

function toggleFilter(id: 'all' | 'trending' | 'new' | 'top-rated') {
  activeFilter.value = id
  loadRecipes()
}

function toggleMealType(type: string) {
  const index = selectedFilters.mealTypes.indexOf(type)
  if (index === -1) {
    selectedFilters.mealTypes.push(type)
  } else {
    selectedFilters.mealTypes.splice(index, 1)
  }
  loadRecipes()
}

function clearFilters() {
  selectedFilters.mealTypes = []
  activeFilter.value = 'all'
  loadRecipes()
}

// Initial load
onMounted(() => {
  loadRecipes()
})
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