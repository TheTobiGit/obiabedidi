/**
 * types/recipe.ts
 * 
 * Defines types for recipes in the Obiabedidi application
 */

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
 * Recipe creation modes
 */
export type CreationMode = 'simple' | 'advanced'

/**
 * Recipe status
 */
export type RecipeStatus = 'draft' | 'published' | 'archived'

/**
 * Recipe ingredient
 */
export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

/**
 * Recipe instruction step
 */
export interface Instruction {
  step: number;
  text: string;
  image?: string;
  timer?: number;
}

/**
 * Recipe interface representing a Ghanaian dish
 */
export interface Recipe {
  /** Unique identifier for the recipe */
  id: string;
  
  /** Name of the dish */
  name: string;
  
  /** Detailed description of the dish - optional for simple mode */
  description?: string;
  
  /** Creation and update timestamps */
  createdAt: Date;
  updatedAt: Date;
  
  /** Author information */
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  
  /** Recipe details - optional for simple mode */
  difficulty?: Difficulty;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  
  /** Media */
  imageUrl: string;
  gallery?: string[];
  videoUrl?: string;
  
  /** Recipe content */
  ingredients: Ingredient[] | string[]; // Structured for advanced, string array for simple
  instructions: Instruction[] | string; // Structured for advanced, string for simple
  
  /** Categorization - optional for simple mode */
  ethnicGroup?: GhanaianCuisine;
  region?: string;
  mealType?: MealType[];
  tags?: string[];
  allergens?: string[];
  
  /** Engagement metrics */
  viewCount: number;
  saveCount: number;
  rating: {
    average: number;
    count: number;
  };
  
  /** Status & visibility */
  status: RecipeStatus;
  isPublic: boolean;
  isFeatured?: boolean;
  
  /** Creation mode */
  creationMode: CreationMode;
}

/**
 * Type guard to check if ingredients are in simple format (string array)
 */
export function isSimpleIngredients(ingredients: Ingredient[] | string[]): ingredients is string[] {
  return ingredients.length === 0 || typeof ingredients[0] === 'string';
}

/**
 * Type guard to check if instructions are in simple format (string)
 */
export function isSimpleInstructions(instructions: Instruction[] | string): instructions is string {
  return typeof instructions === 'string';
}

/**
 * Type guard to check if a recipe was created in simple mode
 */
export function isSimpleRecipe(recipe: Recipe): boolean {
  return recipe.creationMode === 'simple';
} 