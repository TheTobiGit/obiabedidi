<!-- File: layouts/default.vue -->
<!-- Default layout with modern mobile app design and bottom navigation -->

<script setup lang="ts">
// Navigation items for bottom bar
const navItems = [
  { name: 'Home', icon: 'heroicons:home', route: '/' },
  { name: 'Search', icon: 'heroicons:magnifying-glass', route: '/search' },
  { name: 'Favorites', icon: 'heroicons:heart', route: '/favorites' },
  { name: 'Profile', icon: 'heroicons:user-circle', route: '/profile' },
]

// Get current route for active state
const route = useRoute()

// Check if route is active
const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <div class="flex flex-col min-h-[100dvh] bg-neutral-50 text-neutral-900">
    <!-- Main content area with safe area padding -->
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
    
    <!-- Bottom navigation bar - fixed and elevated for app-like feel -->
    <div class="pb-safe-bottom bg-neutral-50">
      <nav class="mx-4 mb-4 rounded-2xl bg-white shadow-lg border border-neutral-100">
        <div class="flex justify-around items-center h-16">
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.name" 
            :to="item.route"
            class="flex flex-col items-center justify-center flex-1 py-2"
            :class="[
              isActive(item.route) 
                ? 'text-primary relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full' 
                : 'text-neutral-400'
            ]"
          >
            <!-- Icon with active/inactive states -->
            <Icon 
              :name="item.icon" 
              :size="24" 
              class="mb-1 transition-all duration-200"
              :class="isActive(item.route) ? 'scale-110' : ''"
            />
            
            <!-- Label -->
            <span class="text-[10px] font-medium transition-colors">{{ item.name }}</span>
          </NuxtLink>
        </div>
      </nav>
    </div>
  </div>
</template>

<style>
/* Base styles for app-like feel */
html {
  background-color: #F9FAFB;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  min-height: 100%;
  overflow-x: hidden;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior-y: none; /* Prevent pull-to-refresh */
}

/* Smooth scrolling */
* {
  scroll-behavior: smooth;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

/* Apply a subtle fade transition between route changes */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>