// File: server/api/recipes/index.get.ts
// GET endpoint for fetching all recipes with optional filtering

import { recipes } from '../../data/recipes'

export default defineEventHandler((event) => {
  // Get query parameters
  const query = getQuery(event)
  let filteredRecipes = [...recipes]

  // Filter by region if specified
  if (query.region) {
    filteredRecipes = filteredRecipes.filter(
      recipe => recipe.region?.toLowerCase() === query.region?.toString().toLowerCase()
    )
  }

  // Filter by difficulty if specified
  if (query.difficulty) {
    filteredRecipes = filteredRecipes.filter(
      recipe => recipe.difficulty.toLowerCase() === query.difficulty?.toString().toLowerCase()
    )
  }

  // Filter by tags if specified
  if (query.tag) {
    filteredRecipes = filteredRecipes.filter(
      recipe => recipe.tags.some(tag => 
        tag.toLowerCase() === query.tag?.toString().toLowerCase()
      )
    )
  }

  // Search by name or description
  if (query.search) {
    const searchTerm = query.search.toString().toLowerCase()
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm)
    )
  }

  return {
    recipes: filteredRecipes,
    total: filteredRecipes.length
  }
}) 