<!--
  File: pages/auth/login.vue
  Simple Google authentication login page
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

        <!-- Google Login Button -->
        <button
          @click="handleGoogleLogin"
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
// Router
const router = useRouter()

// Loading state
const isLoading = ref(false)

// Google login
async function handleGoogleLogin() {
  try {
    isLoading.value = true
    // TODO: Implement Google login
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
    
    // Success - redirect to home
    router.push('/')
  } catch (error) {
    console.error('Google login error:', error)
  } finally {
    isLoading.value = false
  }
}

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