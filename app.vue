<!-- File: app.vue -->
<!-- Main app layout with dark mode and mobile-first design -->

<template>
  <NuxtLayout>
    <Transition name="page" mode="out-in">
      <NuxtPage />
    </Transition>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Get color mode for dynamic favicon color
const colorMode = useColorMode()

// Configure app-wide head metadata
useHead({
  title: 'Obiabedidi - Ghanaian Recipes',
  link: [
    { 
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/assets/logo.svg'
    }
  ],
  meta: [
    {
      name: 'description',
      content: 'Discover and cook authentic Ghanaian recipes with Obiabedidi'
    },
    {
      name: 'theme-color',
      content: () => colorMode.value === 'dark' ? '#1C1C1E' : '#F9FAFB'
    }
  ]
})
</script>

<style>
:root {
  -webkit-tap-highlight-color: transparent;
}

/* Apply smooth scrolling globally and prevent scrollbar issues during transitions */
html {
  scroll-behavior: smooth;
  overflow-x: hidden; /* Prevent horizontal scrollbar */
}

/* Ensure proper height on mobile */
body {
  min-height: 100vh;
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: scale(0.95);
  filter: blur(2px);
}

.page-leave-to {
  opacity: 0;
  transform: scale(1.05);
  filter: blur(2px);
}

/* Desktop-specific styles */
@media (min-width: 768px) {
  html {
    scrollbar-gutter: stable;
  }

  /* Hide scrollbars during transitions on desktop */
  .page-enter-active,
  .page-leave-active {
    overflow: hidden !important;
  }

  /* Custom scrollbar styling for desktop */
  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 1px;
  }

  /* Firefox scrollbar styling */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
  }
}
</style>
