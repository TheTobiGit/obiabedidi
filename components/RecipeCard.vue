<!-- File: components/RecipeCard.vue -->
<template>
  <div 
    class="group relative w-full h-24 rounded-xl overflow-hidden cursor-pointer will-change-transform"
    :class="{
      'allergen-corner': allergens?.length
    }"
  >
    <!-- Background Image with Multiple Gradients -->
    <div class="absolute inset-0 bg-black/50 z-10"></div>
    <NuxtImg
      :src="imageUrl"
      :alt="name"
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
      fetchpriority="high"
    />

    <!-- Content Overlay -->
    <div class="relative z-20 h-full flex items-center">
      <!-- Left Side Content -->
      <div class="flex-1 p-3 text-white">
        <!-- Title and Rating -->
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <div class="w-1 h-4 bg-orange-400 rounded-full"></div>
            <h3 class="font-medium text-sm truncate pr-2">
              {{ name }}
            </h3>
          </div>
          <div 
            class="flex items-center gap-1 bg-black/40 rounded-full px-2 py-0.5"
          >
            <Icon 
              name="material-symbols:star" 
              class="w-3 h-3 text-yellow-400" 
            />
            <span class="text-[10px] font-medium">{{ rating }}</span>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="flex items-center gap-2 mb-1.5">
          <div 
            class="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            :class="{
              'bg-green-400/10 text-green-300': difficulty === 'Easy',
              'bg-yellow-400/10 text-yellow-300': difficulty === 'Medium',
              'bg-red-400/10 text-red-300': difficulty === 'Hard'
            }"
          >
            <Icon name="material-symbols:signal-cellular-alt" class="w-3 h-3"/>
            {{ difficulty }}
          </div>
          <div class="w-0.5 h-2 bg-white/20 rounded-full"></div>
          <div class="flex items-center gap-1 text-[10px]">
            <Icon name="emojione-monotone:stopwatch" class="w-3 h-3"/>
            {{ cookingTime }}
          </div>
          <div class="w-0.5 h-2 bg-white/20 rounded-full"></div>
          <div class="flex items-center gap-1 text-[10px]">
            <Icon name="material-symbols:group" class="w-3 h-3"/>
            {{ servings }}
          </div>
          <!-- Allergen Indicator in Stats -->
          <template v-if="allergens?.length">
            <div class="w-0.5 h-2 bg-white/20 rounded-full"></div>
            <div 
              class="relative group/allergen flex items-center gap-1 text-[10px] text-red-300"
            >
              <span class="font-medium">{{ allergens.length }} allergen{{ allergens.length > 1 ? 's' : '' }}</span>
              <!-- Allergen Tooltip -->
              <div 
                class="absolute bottom-full right-0 mb-2 w-48 p-2 rounded-lg bg-black/90 text-white text-[10px] font-medium opacity-0 group-hover/allergen:opacity-100 transition-opacity duration-200 pointer-events-none z-[100] shadow-xl"
              >
                <div class="relative">
                  <p class="mb-1">Contains allergens:</p>
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="allergen in allergens" 
                      :key="allergen"
                      class="px-1.5 py-0.5 bg-red-500/20 rounded-full"
                    >
                      {{ allergen }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Tags -->
        <div class="flex gap-1.5 items-center">
          <span 
            class="px-2 py-0.5 bg-blue-500/20 rounded-full text-[10px] font-medium text-blue-100 border border-blue-400/20"
          >
            {{ cuisineType }}
          </span>
          <span 
            v-for="tag in dietaryTags.slice(0, 2)" 
            :key="tag"
            class="px-2 py-0.5 bg-green-500/20 rounded-full text-[10px] font-medium text-green-100 border border-green-400/20"
          >
            {{ tag }}
          </span>
          <span 
            v-if="dietaryTags.length > 2"
            class="px-1.5 py-0.5 bg-white/10 rounded-full text-[10px] text-white/90"
          >
            +{{ dietaryTags.length - 2 }}
          </span>
        </div>
      </div>

      <!-- Right Side - Chef & Action -->
      <div 
        class="h-full w-12 flex flex-col items-center justify-between py-2 px-1 bg-black/30 border-l border-white/10"
      >
        <div 
          class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center border border-orange-500/30"
        >
          <Icon 
            name="emojione-monotone:pot-of-food" 
            class="w-4 h-4 text-orange-100" 
          />
        </div>
        <div class="text-[10px] font-medium text-white/90 text-center leading-tight">
          by<br>{{ chef.split(' ')[0] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define props for the recipe card
defineProps<{
  name: string
  description: string
  cookingTime: string
  chef: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  servings: number
  rating: number
  numReviews: number
  cuisineType: string
  dietaryTags: string[]
  imageUrl: string
  allergens?: string[]
}>()
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Allergen Corner Animation */
@keyframes cornerPulse {
  0%, 100% { 
    opacity: 0.6;
  }
  50% { 
    opacity: 1;
  }
}

.allergen-corner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(239, 68, 68, 0.4) 100%);
  clip-path: polygon(0 0, 100% 0, 0 100%);
  animation: cornerPulse 1s ease-in-out infinite;
  z-index: 25;
  pointer-events: none;
  will-change: opacity;
}

.group:hover {
  transform: translateY(-2px);
}
</style> 