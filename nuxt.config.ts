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
    '@nuxtjs/google-fonts',
    'nuxt-vuefire'
  ],

  vuefire: {
    auth: {
      enabled: true
    },
    config: {
      apiKey: "AIzaSyCLdCx-nlU_u-SbZU6uw-dRVR7PGdUw9u4",
      authDomain: "obiabedidi-app.firebaseapp.com",
      projectId: "obiabedidi-app",
      storageBucket: "obiabedidi-app.firebasestorage.app",
      messagingSenderId: "426559370936",
      appId: "1:426559370936:web:202c04c732fe239a8ae64d",
      measurementId: "G-QKGRLTF111"
    }
  },

  ssr: false,
  
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