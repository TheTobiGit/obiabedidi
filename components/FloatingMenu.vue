<!-- File: components/FloatingMenu.vue -->
<template>
  <div>
    <!-- Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        @click="isOpen = false"
      ></div>
    </Transition>

    <!-- Menu Container -->
    <div class="fixed bottom-6 right-6 z-50">
      <!-- Secondary Buttons -->
      <TransitionGroup 
        name="menu-item"
        tag="div"
        class="flex flex-col-reverse gap-4 items-center mb-4"
      >
        <button
          v-if="isOpen"
          v-for="(button, index) in secondaryButtons"
          :key="button.id"
          class="w-14 h-14 bg-white/95 border border-black/40 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:bg-black/80 hover:shadow-xl hover:scale-110 active:scale-95 group"
          :style="{
            '--delay': `${(secondaryButtons.length - index) * 0.05}s`
          }"
        >
          <Icon 
            :name="button.icon"
            size="28"
            class="w-10 h-10 text-black transition-transform duration-300 group-hover:text-white group-hover:rotate-12"
          />
        </button>
      </TransitionGroup>

      <!-- Main FAB -->
      <button 
        class="w-14 h-14 bg-white/95 border border-black/40 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-black/80 hover:shadow-xl hover:scale-110 active:scale-95 group"
        @click="isOpen = !isOpen"
      >
        <Icon 
          name="material-symbols:action-key" 
          size="28"
          class="w-10 h-10 text-black transition-transform duration-300 group-hover:text-white"
          :class="{ 'rotate-90': isOpen }"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

// Secondary buttons configuration
const secondaryButtons = [
  {
    id: 'search',
    icon: 'material-symbols:search',
  },
  {
    id: 'tools',
    icon: 'game-icons:camp-cooking-pot',
  }
]

// Close menu when pressing escape
onKeyStroke('Escape', () => {
  isOpen.value = false
})

// Close menu when clicking outside
onClickOutside(ref(null), () => {
  isOpen.value = false
})
</script>

<style scoped>
/* Backdrop transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Menu items transition */
.menu-item-enter-active,
.menu-item-leave-active {
  transition: all 0.3s ease-out;
  transition-delay: var(--delay, 0s);
}

.menu-item-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.menu-item-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style> 