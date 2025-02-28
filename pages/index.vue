<template>
  <div class="flex flex-col min-h-dvh gap-5 lg:hidden">
    <section class="flex flex-col gap-5 p-4">
      <!-- Header -->
      <div>
        <img src="/assets/logo.svg" alt="logo" class="h-13" />
      </div>

      <!-- Tip of the day -->
      <div class="flex justify-center items-center gap-1 text-sm">
        <Icon name="material-symbols:tips-and-updates" />
        <p>wash your hands before and after cooking</p>
      </div>

      <!-- Recipe Cards Container -->
      <div class="flex flex-col gap-4 w-full">
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          v-bind="recipe"
        />
      </div>
    </section>

    <!-- Floating Action Button -->
    <button 
      class="fixed bottom-6 right-6 w-14 h-14 bg-white/90 border border-black/40 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-black/80 hover:shadow-xl hover:scale-110 active:scale-95 group z-50"
    >
      <Icon 
        name="material-symbols:action-key" 
        size="28"
        class="w-10 h-10 text-black transition-transform duration-300 group-hover:rotate-90" 
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from "~/types/recipe";
import recipesData from "~/data/recipes.json";

// Type assertion for the imported JSON data
const recipes = recipesData.recipes as Recipe[];
</script>

<style></style>
