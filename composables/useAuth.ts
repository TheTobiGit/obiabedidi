/*
  File: composables/useAuth.ts
  Auth state management composable
*/

import { useFirebaseAuth } from 'vuefire'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'

export function useAuth() {
  // Get Firebase auth instance
  const auth = useFirebaseAuth()
  
  // Reactive refs
  const isAuthReady = ref(false)
  const isAuthenticated = computed(() => !!auth?.currentUser)
  const user = computed(() => auth?.currentUser as User | null)
  const isLoading = ref(false)
  const error = ref('')
  
  // Initialize auth state
  onMounted(() => {
    if (!auth) return

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, () => {
      isAuthReady.value = true
    })

    // Cleanup listener on unmount
    onUnmounted(() => unsubscribe())
  })

  // User display info
  const userInitial = computed(() => {
    if (!user.value?.displayName) return '?'
    return user.value.displayName.charAt(0).toUpperCase()
  })

  const userPhotoURL = computed(() => {
    return user.value?.photoURL || null
  })

  const firstName = computed(() => {
    if (!user.value?.displayName) return null
    return user.value.displayName.split(' ')[0]
  })

  // Time-based greeting
  const greeting = computed(() => {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) {
      return 'Good morning'
    } else if (hour === 12) {
      return 'Good noon'
    } else if (hour > 12 && hour < 17) {
      return 'Good afternoon'
    } else if (hour >= 17 && hour < 22) {
      return 'Good evening'
    } else {
      return 'Good night'
    }
  })

  // Sign in with Google
  async function loginWithGoogle() {
    if (!auth) return

    try {
      error.value = '' // Clear any previous errors
      isLoading.value = true

      // Create Google auth provider
      const provider = new GoogleAuthProvider()
      
      // Sign in with popup
      const { user } = await signInWithPopup(auth, provider)

      // Success - redirect to home
      navigateTo('/')

      return user
    } catch (e: any) {
      // Handle specific error cases
      switch (e.code) {
        case 'auth/popup-closed-by-user':
          error.value = 'Sign in was cancelled'
          break
        case 'auth/popup-blocked':
          error.value = 'Sign in popup was blocked. Please allow popups and try again'
          break
        default:
          error.value = 'Failed to sign in. Please try again'
          console.error('Auth error:', e)
      }
      throw e
    } finally {
      isLoading.value = false
    }
  }

  // Sign out
  async function logout() {
    if (!auth) return
    
    try {
      error.value = '' // Clear any previous errors
      isLoading.value = true
      
      await signOut(auth)
      // Redirect to home
      navigateTo('/')
    } catch (e) {
      error.value = 'Failed to sign out. Please try again'
      console.error('Logout error:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isAuthReady,
    isAuthenticated,
    user,
    userInitial,
    userPhotoURL,
    firstName,
    greeting,
    isLoading,
    error,
    loginWithGoogle,
    logout
  }
} 