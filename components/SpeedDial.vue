<!--
  File: components/SpeedDial.vue
  Floating Action Button with speed dial menu
-->
<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Main FAB -->
    <button
      @click="isOpen = !isOpen"
      class="relative flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg transition-all duration-200 hover:bg-primary/90 border border-white/10"
      :class="{ 'rotate-45': isOpen }"
    >
      <Icon 
        name="material-symbols:add" 
        class="w-7 h-7 transition-transform"
      />
    </button>

    <!-- Speed Dial Menu -->
    <div 
      v-show="isOpen"
      class="absolute bottom-full right-0 mb-4 min-w-[180px]"
    >
      <div class="flex flex-col gap-3">
        <!-- Add Recipe -->
        <button
          @click="handleAction('recipe')"
          class="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface text-primary shadow-lg transition-all duration-200 hover:bg-surface-hover"
        >
          <Icon name="material-symbols:restaurant-menu" class="w-5 h-5" />
          <span class="text-sm font-medium">Add Recipe</span>
        </button>

        <!-- Add Collection -->
        <button
          @click="handleAction('collection')"
          class="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface text-primary shadow-lg transition-all duration-200 hover:bg-surface-hover"
        >
          <Icon name="material-symbols:collections-bookmark" class="w-5 h-5" />
          <span class="text-sm font-medium">Add Collection</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// State
const isOpen = ref(false)
const router = useRouter()

// Close menu when clicking outside
onClickOutside(getCurrentInstance()?.proxy?.$el, () => {
  isOpen.value = false
})

// Handle menu item clicks
function handleAction(type: 'recipe' | 'collection') {
  // Close menu
  isOpen.value = false
  
  // Navigate based on action type
  switch (type) {
    case 'recipe':
      router.push('/recipes/new')
      break
    case 'collection':
      router.push('/collections/new')
      break
  }
}
</script> 