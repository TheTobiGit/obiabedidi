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
        <div class="space-y-4">
          <!-- Simple Mode Card -->
          <button 
            @click="selectMode('simple')"
            class="w-full p-5 rounded-xl border border-theme bg-surface hover:bg-surface-hover transition-colors duration-200 text-left"
          >
            <div class="flex items-start gap-4">
              <!-- Icon -->
              <div class="p-3 rounded-lg bg-primary/10 text-primary">
                <Icon name="material-symbols:cooking-outline" class="w-8 h-8" />
              </div>
              
              <!-- Content -->
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-primary mb-1">Simple Mode</h3>
                <p class="text-muted text-sm mb-3">Quick and easy recipe creation with minimal details</p>
                
                <!-- Features -->
                <ul class="space-y-2 text-sm">
                  <li class="flex items-center gap-2">
                    <Icon name="material-symbols:check-circle" class="w-4 h-4 text-success" />
                    <span>Recipe name and description</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <Icon name="material-symbols:check-circle" class="w-4 h-4 text-success" />
                    <span>Simple ingredients list</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <Icon name="material-symbols:check-circle" class="w-4 h-4 text-success" />
                    <span>Photo upload</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <Icon name="material-symbols:check-circle" class="w-4 h-4 text-success" />
                    <span>Video link (optional)</span>
                  </li>
                </ul>
                
                <!-- Complexity Indicator -->
                <div class="flex items-center gap-1 mt-4">
                  <div class="w-2 h-2 rounded-full bg-primary"></div>
                  <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <span class="text-xs text-muted ml-2">Quick (2-3 minutes)</span>
                </div>
              </div>
            </div>
          </button>

          <!-- Advanced Mode Card -->
          <button 
            @click="selectMode('advanced')"
            class="w-full p-5 rounded-xl border border-theme bg-surface hover:bg-surface-hover transition-colors duration-200 text-left"
          >
            <div class="flex items-start gap-4">
              <!-- Icon -->
              <div class="p-3 rounded-lg bg-primary/10 text-primary">
                <Icon name="material-symbols:restaurant-menu" class="w-8 h-8" />
              </div>
              
              <!-- Content -->
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-primary mb-1">Advanced Mode</h3>
                <p class="text-muted text-sm mb-3">Detailed recipe creation with comprehensive information</p>
                
                <!-- Features -->
                <ul class="space-y-2 text-sm">
                  <li class="flex items-center gap-2">
                    <Icon name="material-symbols:check-circle" class="w-4 h-4 text-success" />
                    <span>All simple mode features</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <Icon name="material-symbols:check-circle" class="w-4 h-4 text-success" />
                    <span>Structured ingredients with amounts</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <Icon name="material-symbols:check-circle" class="w-4 h-4 text-success" />
                    <span>Step-by-step instructions</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <Icon name="material-symbols:check-circle" class="w-4 h-4 text-success" />
                    <span>Detailed categorization and timing</span>
                  </li>
                </ul>
                
                <!-- Complexity Indicator -->
                <div class="flex items-center gap-1 mt-4">
                  <div class="w-2 h-2 rounded-full bg-primary"></div>
                  <div class="w-2 h-2 rounded-full bg-primary"></div>
                  <div class="w-2 h-2 rounded-full bg-primary"></div>
                  <span class="text-xs text-muted ml-2">Detailed (5-10 minutes)</span>
                </div>
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