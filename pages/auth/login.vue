<!--
  File: pages/auth/login.vue
  Simple Google authentication login page using VueFire
-->
<template>
  <div class="min-h-dvh flex flex-col transition-colors duration-200">
    <!-- Top Bar -->
    <div class="sticky top-0 z-10 bg-inherit flex justify-between items-center px-4 py-4 border-b border-theme">
      <!-- Back Button -->
      <button 
        @click="router.back()"
        class="p-2 -ml-2 rounded-xl transition-colors flex items-center text-muted hover:bg-surface-hover"
      >
        <Icon name="material-symbols:arrow-back" class="w-5 h-5" />
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-sm text-center">
        <!-- Logo -->
        <div class="mb-8">
          <Logo class="h-12 w-auto mx-auto" />
          <h1 class="text-2xl font-semibold text-primary mt-6 mb-2">
            Welcome to Obiabedidi
          </h1>
          <p class="text-secondary">
            Join our cooking community to save recipes and share your culinary journey
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-500/10 text-red-500 text-sm">
          {{ error }}
        </div>

        <!-- Google Login Button -->
        <button
          @click="loginWithGoogle"
          :disabled="isLoading"
          class="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-surface border-theme hover:bg-surface-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon 
            v-if="isLoading"
            name="material-symbols:progress-activity"
            class="w-5 h-5 animate-spin"
          />
          <Icon 
            v-else
            name="flat-color-icons:google" 
            class="w-5 h-5" 
          />
          <span class="text-sm font-medium text-primary">
            {{ isLoading ? 'Signing in...' : 'Continue with Google' }}
          </span>
        </button>

        <!-- Terms Notice -->
        <p class="mt-6 text-xs text-muted flex gap-1 flex-wrap justify-center">
          By continuing, you agree to our
          <button class="text-primary hover:text-muted transition-colors">Terms of Service</button>
          and
          <button class="text-primary hover:text-muted transition-colors">Privacy Policy</button>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

// Router
const router = useRouter()

// Auth state
const { isLoading, error, loginWithGoogle } = useAuth()

// Watch auth state to redirect if already logged in
const { isAuthenticated } = useAuth()
watchEffect(() => {
  if (isAuthenticated.value) {
    router.push('/')
  }
})

// SEO
useHead({
  title: 'Login - Obiabedidi',
  meta: [
    {
      name: 'description',
      content: 'Join Obiabedidi to discover and save authentic Ghanaian recipes'
    }
  ]
})
</script> 