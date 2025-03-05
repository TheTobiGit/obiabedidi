// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  // devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    '@pinia/nuxt', 
    '@vueuse/nuxt', 
    '@nuxt/icon', 
    '@nuxt/image', 
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts'
  ],
  
  // Color mode configuration
  colorMode: {
    // Use system preference by default
    preference: 'system',
    // Light theme fallback for SSR consistency
    fallback: 'light',
    // Remove -mode suffix from classes
    classSuffix: '',
    // Use data-theme attribute for theme switching
    dataValue: 'theme',
    // Storage key for persisting theme preference
    storageKey: 'nuxt-color-mode',
  },
  
  googleFonts: {
    families: {
      'Plus+Jakarta+Sans': [500, 600]
    },
    display: 'swap'
  },

  // Add viewport configuration for notch support
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ]
    }
  }
})