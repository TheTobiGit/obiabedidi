// File: server/data/recipes.ts
// This file contains dummy data for Ghanaian recipes
// Each recipe includes detailed ingredients, instructions, and metadata

import { Recipe } from '../types/recipe'
import { v4 as uuidv4 } from 'uuid'

export const recipes: Recipe[] = [
  {
    id: uuidv4(),
    name: 'Jollof Rice',
    description: 'A beloved Ghanaian dish made with rice cooked in spiced tomato sauce, creating a flavorful and aromatic one-pot meal.',
    region: 'Greater Accra',
    prepTime: '30 mins',
    cookTime: '1 hour',
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Long grain rice', amount: '3 cups', notes: 'Washed and drained' },
      { name: 'Tomatoes', amount: '6 medium', notes: 'Blended' },
      { name: 'Onions', amount: '2 large', notes: '1 blended, 1 diced' },
      { name: 'Tomato paste', amount: '3 tablespoons' },
      { name: 'Vegetable oil', amount: '1/2 cup' },
      { name: 'Chicken stock', amount: '3 cups' },
      { name: 'Garlic', amount: '4 cloves', notes: 'Minced' },
      { name: 'Ginger', amount: '2 inches', notes: 'Grated' },
      { name: 'Scotch bonnet pepper', amount: '1', notes: 'Adjust to taste' },
      { name: 'Curry powder', amount: '1 tablespoon' },
      { name: 'Thyme', amount: '1 teaspoon' },
      { name: 'Bay leaves', amount: '2' },
      { name: 'Salt', amount: 'To taste' }
    ],
    instructions: [
      { 
        step: 1, 
        description: 'Blend tomatoes, one onion, garlic, ginger, and scotch bonnet pepper until smooth.',
        duration: '5 mins'
      },
      {
        step: 2,
        description: 'Heat oil in a large pot and sauté diced onions until translucent.',
        duration: '5 mins'
      },
      {
        step: 3,
        description: 'Add tomato paste and fry for a few minutes until the oil slightly separates.',
        duration: '3-5 mins'
      },
      {
        step: 4,
        description: 'Pour in the blended tomato mixture and cook until the oil rises to the top.',
        duration: '15-20 mins'
      },
      {
        step: 5,
        description: 'Add chicken stock, curry powder, thyme, bay leaves, and salt. Bring to a boil.',
        duration: '5 mins'
      },
      {
        step: 6,
        description: 'Add rice, stir, reduce heat, cover and simmer until rice is cooked and liquid is absorbed.',
        duration: '20-25 mins'
      }
    ],
    imageUrl: '/images/jollof-rice.jpg',
    tags: ['Main Course', 'Rice Dishes', 'Popular', 'Party Favorite'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Waakye',
    description: 'A traditional Ghanaian dish of rice and beans cooked together with dried millet stalks or sorghum leaves, giving it its characteristic color.',
    region: 'Northern Region',
    prepTime: '45 mins',
    cookTime: '1.5 hours',
    servings: 8,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Rice', amount: '3 cups' },
      { name: 'Black-eyed peas', amount: '2 cups', notes: 'Soaked overnight' },
      { name: 'Waakye leaves', amount: '5-6 pieces', notes: 'Or sorghum leaves' },
      { name: 'Baking soda', amount: '1/2 teaspoon' },
      { name: 'Salt', amount: 'To taste' }
    ],
    instructions: [
      {
        step: 1,
        description: 'Wash and soak beans overnight. Drain and set aside.',
        duration: 'Overnight'
      },
      {
        step: 2,
        description: 'Boil beans with waakye leaves and baking soda until half cooked.',
        duration: '45 mins'
      },
      {
        step: 3,
        description: 'Add rice and salt, continue cooking until both rice and beans are tender.',
        duration: '25-30 mins'
      }
    ],
    imageUrl: '/images/waakye.jpg',
    tags: ['Main Course', 'Breakfast', 'Street Food', 'Vegetarian'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
] 