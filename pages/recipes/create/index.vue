<!--
  File: pages/recipes/create/index.vue
  Recipe creation mode selection page
  Allows users to choose between simple and advanced recipe creation modes
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
          Create Recipe
        </h1>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto overscroll-contain p-4">
      <div class="max-w-md mx-auto">
        <!-- Introduction -->
        <div class="mb-6 text-center">
          <h2 class="text-xl font-semibold text-primary mb-2">Choose Creation Mode</h2>
          <p class="text-muted">Select how you want to create your recipe</p>
        </div>

        <!-- Mode Selection Cards -->
        <div class="space-y-3">
          <!-- Simple Mode Card -->
          <button 
            @click="selectMode('simple')"
            class="w-full p-4 rounded-xl border border-theme bg-surface hover:bg-surface-hover transition-colors duration-200 text-left"
          >
            <div class="flex items-center gap-3">
              <!-- Icon -->
              <div class="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Icon name="material-symbols:cooking-outline" class="w-6 h-6" />
              </div>
              
              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold text-primary">Simple Mode</h3>
                  <span class="text-xs text-muted px-2 py-1 rounded-full bg-surface-hover">2-3 min</span>
                </div>
                <p class="text-muted text-sm mt-1">Quick recipe creation with basic details and ingredients list</p>
              </div>
            </div>
          </button>

          <!-- Advanced Mode Card -->
          <button 
            disabled
            class="w-full p-4 rounded-xl border border-theme bg-surface/50 opacity-75 cursor-not-allowed transition-colors duration-200 text-left"
          >
            <div class="flex items-center gap-3">
              <!-- Icon -->
              <div class="p-2.5 rounded-lg bg-primary/10 text-primary/50">
                <Icon name="material-symbols:restaurant-menu" class="w-6 h-6" />
              </div>
              
              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold text-primary/75">Advanced Mode</h3>
                  <span class="text-xs text-muted px-2 py-1 rounded-full bg-surface-hover/50">Coming Soon</span>
                </div>
                <p class="text-muted text-sm mt-1">Detailed recipe with structured ingredients and step-by-step instructions</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Import necessary composables and types
import { useRouter } from 'vue-router'
import type { CreationMode } from '~/types/recipe'

// Router for navigation
const router = useRouter()

/**
 * Handle mode selection and navigate to the appropriate creation page
 * @param mode The selected creation mode (simple or advanced)
 */
function selectMode(mode: CreationMode) {
  // Navigate to the specific mode page
  router.push(`/recipes/create/${mode}`)
}
</script> 