<!-- File: components/RecipeCard.vue -->
<template>
  <div 
    class="group relative w-full h-24 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl"
    :class="{
      'allergen-corner': allergens?.length
    }"
  >
    <!-- Background Image with Multiple Gradients -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent opacity-100 group-hover:opacity-85 transition-opacity duration-300 z-10"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
    <NuxtImg
      :src="imageUrl"
      :alt="name"
      class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 ease-out"
      loading="lazy"
    />

    <!-- Content Overlay -->
    <div class="relative z-20 h-full flex items-center">
      <!-- Left Side Content -->
      <div class="flex-1 p-3 text-white">
        <!-- Title and Rating -->
        <div class="flex items-center justify-between mb-1.5 group-hover:translate-x-1 transition-transform duration-300">
          <div class="flex items-center gap-2">
            <div class="w-1 h-4 bg-orange-400 rounded-full transition-all duration-300 group-hover:h-5 group-hover:bg-orange-300"></div>
            <h3 class="font-medium text-sm truncate pr-2 group-hover:text-orange-200 transition-colors duration-300">
              {{ name }}
            </h3>
          </div>
          <div 
            class="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 transition-all duration-300 group-hover:bg-black/50 group-hover:pr-3"
          >
            <Icon 
              name="material-symbols:star" 
              class="w-3 h-3 text-yellow-400 transition-transform duration-300 group-hover:scale-110"
            />
            <span class="text-[10px] font-medium">{{ rating }}</span>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="flex items-center gap-2 mb-1.5">
          <div 
            class="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-all duration-300"
            :class="{
              'bg-green-400/10 text-green-300 group-hover:bg-green-400/20': difficulty === 'Easy',
              'bg-yellow-400/10 text-yellow-300 group-hover:bg-yellow-400/20': difficulty === 'Medium',
              'bg-red-400/10 text-red-300 group-hover:bg-red-400/20': difficulty === 'Hard'
            }"
          >
            <Icon name="material-symbols:signal-cellular-alt" class="w-3 h-3"/>
            {{ difficulty }}
          </div>
          <div class="w-0.5 h-2 bg-white/20 rounded-full"></div>
          <div class="flex items-center gap-1 text-[10px] group-hover:text-orange-200 transition-colors duration-300">
            <Icon name="emojione-monotone:stopwatch" class="w-3 h-3"/>
            {{ cookingTime }}
          </div>
          <div class="w-0.5 h-2 bg-white/20 rounded-full"></div>
          <div class="flex items-center gap-1 text-[10px] group-hover:text-orange-200 transition-colors duration-300">
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
            </div>
          </template>
        </div>

        <!-- Tags -->
        <div class="flex gap-1.5 items-center group-hover:translate-x-0.5 transition-transform duration-300">
          <span 
            class="px-2 py-0.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-[10px] font-medium text-blue-100 border border-blue-400/20 group-hover:bg-blue-500/30 transition-all duration-300"
          >
            {{ cuisineType }}
          </span>
          <span 
            v-for="tag in dietaryTags.slice(0, 2)" 
            :key="tag"
            class="px-2 py-0.5 bg-green-500/20 backdrop-blur-sm rounded-full text-[10px] font-medium text-green-100 border border-green-400/20 group-hover:bg-green-500/30 transition-all duration-300"
          >
            {{ tag }}
          </span>
          <span 
            v-if="dietaryTags.length > 2"
            class="px-1.5 py-0.5 bg-white/10 backdrop-blur-sm rounded-full text-[10px] text-white/90 group-hover:bg-white/20 transition-all duration-300"
          >
            +{{ dietaryTags.length - 2 }}
          </span>
        </div>
      </div>

      <!-- Right Side - Chef & Action -->
      <div 
        class="h-full w-12 flex flex-col items-center justify-between py-2 px-1 bg-black/30 backdrop-blur-sm transition-all duration-500 group-hover:w-16 group-hover:bg-black/40 border-l border-white/10"
      >
        <div 
          class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:from-orange-400/30 group-hover:to-orange-500/30 border border-orange-500/30"
        >
          <Icon 
            name="emojione-monotone:pot-of-food" 
            class="w-4 h-4 text-orange-100 transition-all duration-300 group-hover:rotate-12" 
          />
        </div>
        <div class="text-[10px] font-medium text-white/90 text-center leading-tight transition-all duration-300 group-hover:text-orange-200">
          by<br>{{ chef.split(' ')[0] }}
        </div>
      </div>
    </div>

    <!-- Shine Effect -->
    <div 
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-30"
      style="background: linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)"
    ></div>
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
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.1);
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
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
  clip-path: polygon(0 0, 100% 0, 0 100%);
  animation: cornerPulse 1s ease-in-out infinite;
  z-index: 25;
  pointer-events: none;
}

.allergen-corner:hover::before {
  opacity: 1;
  transform: scale(1.2);
  animation: none;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(239, 68, 68, 0.5) 100%);
}
</style> 