<!-- File: app.vue -->
<!-- Main app layout with dark mode and mobile-first design -->

<template>
  <NuxtLayout>
    <NuxtPage />
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

/* Apply smooth scrolling globally */
html {
  scroll-behavior: smooth;
}

/* Ensure proper height on mobile */
body {
  min-height: 100vh;
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available;
}
</style>
