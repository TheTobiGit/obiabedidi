/**
 * Difficulty levels for recipes
 */
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

/**
 * Ghanaian ethnic/regional cuisines
 */
export type GhanaianCuisine = 'GA' | 'Ewe' | 'Fante' | 'Ashanti' | 'Northern'

/**
 * Recipe interface representing a Ghanaian dish
 */
export interface Recipe {
  /** Unique identifier for the recipe */
  id: string
  /** Name of the dish */
  name: string
  /** Detailed description of the dish */
  description: string
  /** Time required to prepare and cook */
  cookingTime: string
  /** Chef who created or provided the recipe */
  chef: string
  /** Difficulty level of preparation */
  difficulty: Difficulty
  /** Number of people the recipe serves */
  servings: number
  /** Rating out of 5 */
  rating: number
  /** Number of reviews received */
  numReviews: number
  /** Ethnic/regional classification */
  cuisineType: GhanaianCuisine
  /** Dietary and characteristic tags */
  dietaryTags: string[]
  /** List of allergens, if any */
  allergens: string[]
  /** URL to the dish image */
  imageUrl: string
} 