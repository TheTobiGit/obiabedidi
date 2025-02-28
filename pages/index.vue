<template>
  <div class="flex flex-col h-screen p-4 gap-5">
    <div>
      <img src="/assets/logo.svg" alt="logo" class="h-13">
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
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import recipesData from '~/data/recipes.json'

// Type assertion for the imported JSON data
const recipes = recipesData.recipes as Recipe[]
</script>

<style>

</style>