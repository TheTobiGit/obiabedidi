/**
 * Difficulty levels for recipes
 */
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

/**
 * Serving sizes for recipes
 */
export type ServingSize = 'small' | 'medium' | 'large'

/**
 * Meal types
 */
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'

/**
 * Ghanaian ethnic/regional cuisines
 */
export type GhanaianCuisine = 'GA' | 'Ewe' | 'Fante' | 'Ashanti' | 'Northern'

/**
 * Recipe ingredient
 */
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

/**
 * Recipe instruction step
 */
export interface Instruction {
  step: number;
  text: string;
}

/**
 * Recipe interface representing a Ghanaian dish
 */
export interface Recipe {
  /** Unique identifier for the recipe */
  id: string;
  /** Name of the dish */
  name: string;
  /** Detailed description of the dish */
  description: string;
  /** Time required to prepare and cook in minutes */
  cookingTime: number;
  /** Author/Chef who created or provided the recipe */
  author: string;
  /** Difficulty level of preparation */
  difficulty: Difficulty;
  /** Size of serving */
  servingSize: ServingSize;
  /** Rating out of 5 */
  rating: string;
  /** Number of reviews received */
  numReviews: number;
  /** Ethnic/regional classification */
  ethnicGroup: GhanaianCuisine;
  /** Type of meal */
  mealType: MealType;
  /** List of allergens, if any */
  allergens: string[];
  /** URL to the dish image */
  imageUrl: string;
  /** Whether the recipe is new */
  isNew: boolean;
  /** Whether the recipe is trending */
  isTrending: boolean;
  /** List of ingredients */
  ingredients: Ingredient[];
  /** List of instructions */
  instructions: Instruction[];
  /** URL to the recipe video */
  videoUrl: string;
} 