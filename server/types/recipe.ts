// File: server/types/recipe.ts
// This file contains the type definitions for our recipe data structure

export interface Ingredient {
  name: string;
  amount: string;
  notes?: string;
}

export interface CookingStep {
  step: number;
  description: string;
  duration?: string; // Optional cooking duration for this step
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  region?: string; // Specific region in Ghana where this dish is popular
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: CookingStep[];
  imageUrl?: string;
  tags: string[]; // For categories like 'Soup', 'Main Course', 'Vegetarian', etc.
  createdAt: string;
  updatedAt: string;
} 