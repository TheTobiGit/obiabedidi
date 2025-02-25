// File: server/api/recipes/search.get.ts
// Advanced search endpoint for recipes with multiple criteria

import { recipes } from '../../data/recipes'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  let results = [...recipes]

  // Advanced search with multiple criteria
  if (query.ingredients) {
    // Search for recipes containing any of the specified ingredients
    const searchIngredients = query.ingredients.toString().toLowerCase().split(',')
    results = results.filter(recipe =>
      recipe.ingredients.some(ingredient =>
        searchIngredients.some(searchTerm =>
          ingredient.name.toLowerCase().includes(searchTerm.trim())
        )
      )
    )
  }

  // Filter by cooking time range
  if (query.maxCookTime) {
    const maxMinutes = parseInt(query.maxCookTime.toString())
    results = results.filter(recipe => {
      const cookTimeMinutes = parseInt(recipe.cookTime.split(' ')[0]) // Assumes format "X mins" or "X hour"
      return cookTimeMinutes <= maxMinutes
    })
  }

  // Filter by difficulty level(s)
  if (query.difficulties) {
    const difficultyLevels = query.difficulties.toString().toLowerCase().split(',')
    results = results.filter(recipe =>
      difficultyLevels.includes(recipe.difficulty.toLowerCase())
    )
  }

  // Filter by multiple tags (AND condition)
  if (query.tags) {
    const searchTags = query.tags.toString().toLowerCase().split(',')
    results = results.filter(recipe =>
      searchTags.every(tag =>
        recipe.tags.some(recipeTag =>
          recipeTag.toLowerCase().includes(tag.trim())
        )
      )
    )
  }

  // Sort results
  if (query.sortBy) {
    const sortField = query.sortBy.toString()
    const sortOrder = query.sortOrder?.toString()?.toLowerCase() === 'desc' ? -1 : 1

    results.sort((a: any, b: any) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder
      if (a[sortField] > b[sortField]) return 1 * sortOrder
      return 0
    })
  }

  return {
    recipes: results,
    total: results.length,
    filters: {
      ingredients: query.ingredients,
      maxCookTime: query.maxCookTime,
      difficulties: query.difficulties,
      tags: query.tags,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder
    }
  }
}) 