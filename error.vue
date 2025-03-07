<!--
  File: error.vue
  Custom error page for 404 and other errors
-->
<template>
  <div class="min-h-dvh flex flex-col transition-colors duration-200">
    <!-- Top Bar -->
    <div class="sticky top-0 z-10 bg-inherit flex justify-between items-center px-4 py-4 border-b border-theme">
      <div class="flex items-center gap-1">
        <Logo class="h-8 w-auto" />
        <span class="text-xl font-semibold tracking-tighter transition-colors -ml-1 text-primary">
          Obiabedidi
        </span>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-sm text-center">
        <!-- Error Icon -->
        <div class="mb-8 relative">
          <div class="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center">
            <Icon 
              :name="error?.statusCode === 404 ? 'material-symbols:restaurant' : 'material-symbols:error'"
              class="w-12 h-12 text-muted"
            />
          </div>
          <div class="absolute -bottom-2 right-1/3 w-12 h-12 bg-surface rounded-full flex items-center justify-center">
            <Icon 
              name="material-symbols:question-mark"
              class="w-6 h-6 text-muted"
            />
          </div>
        </div>

        <!-- Error Message -->
        <h1 class="text-2xl font-semibold text-primary mb-2">
          {{ error?.statusCode === 404 ? 'Recipe not found' : 'Oops! Something went wrong' }}
        </h1>
        <p class="text-secondary mb-8">
          {{ error?.statusCode === 404 
            ? "We couldn't find the recipe you're looking for. Maybe try searching for something else?"
            : "We're having trouble in the kitchen. Please try again later."
          }}
        </p>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="handleError"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all"
          >
            <Icon name="material-symbols:home" class="w-5 h-5" />
            <span>Return Home</span>
          </button>

          <button
            @click="navigateTo('/browse')"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface text-primary font-medium hover:bg-surface-hover transition-all border-theme"
          >
            <Icon name="material-symbols:view-list" class="w-5 h-5" />
            <span>Browse Recipes</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Get error from props
defineProps({
  error: Object
})

// Handle error clearance
function handleError() {
  // Clear error and return to home
  clearError()
  navigateTo('/')
}

// SEO
useHead({
  title: 'Page Not Found - Obiabedidi',
  meta: [
    {
      name: 'description',
      content: 'The page you are looking for could not be found.'
    }
  ]
})
</script> 