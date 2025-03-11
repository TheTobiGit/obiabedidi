<!--
  File: pages/studio/index.vue
  Cooking Studio page with various cooking tools and utilities
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
          Cooking Studio
        </h1>
      </div>
    </div>

    <!-- Main Content -->
    <main 
      class="flex-1 overflow-y-auto overscroll-contain p-4 pb-safe-bottom transition-all duration-300"
      :class="{ 'content-blurred': activeTool }"
    >
      <div class="max-w-md mx-auto space-y-6">
        <!-- Introduction -->
        <div class="text-center">
          <h2 class="text-xl font-semibold text-primary mb-2">Cooking Tools</h2>
          <p class="text-muted">Helpful utilities to enhance your cooking experience</p>
        </div>

        <!-- Tools Section -->
        <div class="flex flex-col gap-3">
          <!-- Unit Converter Card -->
          <button 
            @click="openTool('converter')"
            class="flex items-center gap-4 p-5 rounded-xl border border-theme bg-surface hover:bg-surface-hover transition-colors duration-200 text-left"
          >
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="material-symbols:scale" class="w-7 h-7 text-primary" />
            </div>
            
            <div class="flex-1">
              <h3 class="text-base font-semibold text-primary">Unit Converter</h3>
              <p class="text-muted text-sm mt-1">Convert between different cooking measurements</p>
            </div>
            
            <Icon name="material-symbols:chevron-right" class="w-5 h-5 text-muted flex-shrink-0" />
          </button>

          <!-- Cooking Timer Card -->
          <button 
            @click="openTool('timer')"
            class="flex items-center gap-4 p-5 rounded-xl border border-theme bg-surface hover:bg-surface-hover transition-colors duration-200 text-left"
          >
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="material-symbols:timer" class="w-7 h-7 text-primary" />
            </div>
            
            <div class="flex-1">
              <h3 class="text-base font-semibold text-primary">Cooking Timer</h3>
              <p class="text-muted text-sm mt-1">Set multiple timers for different dishes</p>
            </div>
            
            <Icon name="material-symbols:chevron-right" class="w-5 h-5 text-muted flex-shrink-0" />
          </button>

          <!-- Recipe Finder Card -->
          <button 
            @click="openTool('finder')"
            class="flex items-center gap-4 p-5 rounded-xl border border-theme bg-surface hover:bg-surface-hover transition-colors duration-200 text-left"
          >
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="material-symbols:search" class="w-7 h-7 text-primary" />
            </div>
            
            <div class="flex-1">
              <h3 class="text-base font-semibold text-primary">Ingredient Finder</h3>
              <p class="text-muted text-sm mt-1">Find recipes based on ingredients you have</p>
            </div>
            
            <Icon name="material-symbols:chevron-right" class="w-5 h-5 text-muted flex-shrink-0" />
          </button>

          <!-- Cooking Tips Card -->
          <button 
            @click="openTool('tips')"
            class="flex items-center gap-4 p-5 rounded-xl border border-theme bg-surface hover:bg-surface-hover transition-colors duration-200 text-left"
          >
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="material-symbols:lightbulb" class="w-7 h-7 text-primary" />
            </div>
            
            <div class="flex-1">
              <h3 class="text-base font-semibold text-primary">Cooking Tips</h3>
              <p class="text-muted text-sm mt-1">Helpful tips and tricks for better cooking</p>
            </div>
            
            <Icon name="material-symbols:chevron-right" class="w-5 h-5 text-muted flex-shrink-0" />
          </button>
        </div>

        <!-- Coming Soon Section -->
        <div class="pt-4 border-t border-theme">
          <h3 class="text-lg font-semibold text-primary mb-3">Coming Soon</h3>
          
          <!-- Meal Planner Card -->
          <div class="flex items-center gap-4 p-5 rounded-xl border border-theme bg-surface/50 opacity-75 cursor-not-allowed">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="material-symbols:calendar-month" class="w-7 h-7 text-primary/50" />
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-base font-semibold text-primary/75">Meal Planner</h3>
                <span class="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary/75">Soon</span>
              </div>
              <p class="text-muted text-sm mt-1">Plan your meals for the week with automatic shopping lists</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Tool Modal -->
    <Transition name="fade">
      <div v-if="activeTool" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
        <div 
          class="w-full max-w-md bg-surface rounded-xl shadow-xl overflow-hidden transition-transform duration-300 flex flex-col max-h-[90vh]"
          :class="{ 'scale-100': activeTool, 'scale-90': !activeTool }"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-4 border-b border-theme sticky top-0 bg-surface z-10">
            <h2 class="text-lg font-semibold text-primary">{{ getToolTitle }}</h2>
            <button 
              @click="activeTool = null"
              class="p-2 rounded-lg text-muted hover:bg-surface-hover transition-colors"
            >
              <Icon name="material-symbols:close" class="w-5 h-5" />
            </button>
          </div>
          
          <!-- Modal Content -->
          <div class="p-6 overflow-y-auto flex-1">
            <!-- Tool Content -->
            <template v-if="activeTool === 'converter'">
              <UnitConverter />
            </template>
            
            <template v-else-if="activeTool === 'timer'">
              <CookingTimer />
            </template>
            
            <!-- Placeholder Content for Other Tools -->
            <template v-else>
              <!-- Tool Icon -->
              <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon :name="getToolIcon" class="w-9 h-9 text-primary" />
              </div>
              
              <!-- Tool Description -->
              <p class="text-secondary text-center mb-6">{{ getToolDescription }}</p>
              
              <!-- Development Notice -->
              <div class="p-3 rounded-lg bg-primary/5 text-center">
                <p class="text-muted text-sm">This feature is currently under development</p>
                <p class="text-primary text-xs mt-1">Check back soon for updates!</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// Import necessary composables
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import UnitConverter from '~/components/studio/UnitConverter.vue'
import CookingTimer from '~/components/studio/CookingTimer.vue'

// Router for navigation
const router = useRouter()

// Active tool state
const activeTool = ref<'converter' | 'timer' | 'finder' | 'tips' | null>(null)

/**
 * Open a specific tool
 * @param tool The tool to open
 */
function openTool(tool: 'converter' | 'timer' | 'finder' | 'tips') {
  activeTool.value = tool
}

// Computed properties for tool information
const getToolTitle = computed(() => {
  switch (activeTool.value) {
    case 'converter': return 'Unit Converter'
    case 'timer': return 'Cooking Timer'
    case 'finder': return 'Ingredient Finder'
    case 'tips': return 'Cooking Tips'
    default: return ''
  }
})

const getToolIcon = computed(() => {
  switch (activeTool.value) {
    case 'converter': return 'material-symbols:scale'
    case 'timer': return 'material-symbols:timer'
    case 'finder': return 'material-symbols:search'
    case 'tips': return 'material-symbols:lightbulb'
    default: return ''
  }
})

const getToolDescription = computed(() => {
  switch (activeTool.value) {
    case 'converter': return 'Convert between different cooking measurements like cups, tablespoons, grams, and ounces.'
    case 'timer': return 'Set and manage multiple timers for different dishes you\'re cooking simultaneously.'
    case 'finder': return 'Enter ingredients you have on hand to find recipes you can make with them.'
    case 'tips': return 'Browse helpful cooking tips and techniques to improve your culinary skills.'
    default: return ''
  }
})
</script>

<style scoped>
/* Transition for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Blur effect for main content when modal is active */
.content-blurred {
  filter: blur(4px);
  opacity: 0.7;
  transform: scale(0.98);
  pointer-events: none; /* Prevent interaction with blurred content */
}

/* Safe bottom padding for notched devices */
.pb-safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style> 