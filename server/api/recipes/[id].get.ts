// File: server/api/recipes/[id].get.ts
// GET endpoint for fetching a single recipe by ID

import { recipes } from '../../data/recipes'

export default defineEventHandler((event) => {
  // Get recipe ID from route parameter
  const id = getRouterParam(event, 'id')

  // Find recipe by ID
  const recipe = recipes.find(r => r.id === id)

  // Return 404 if recipe not found
  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Recipe not found'
    })
  }

  return recipe
}) 