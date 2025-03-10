/*
  File: composables/useRecipes.ts
  Recipe operations composable for creating, reading, updating, and deleting recipes
*/

import { useFirestore, useFirebaseStorage } from 'vuefire'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import type { Recipe } from '~/types/recipe'
import { useAuth } from './useAuth'

export function useRecipes() {
  // Get Firestore and Storage instances
  const db = useFirestore()
  const storage = useFirebaseStorage()
  
  // Get auth state
  const { user, isAuthenticated } = useAuth()
  
  // Reactive refs
  const isLoading = ref(false)
  const error = ref('')
  
  /**
   * Upload a photo to Firebase Storage
   * @param file The file to upload
   * @param path The storage path
   * @returns The download URL of the uploaded file
   */
  async function uploadPhoto(file: File, path: string): Promise<string> {
    if (!storage) throw new Error('Storage not initialized')
    
    // Create a reference to the file location
    const fileRef = storageRef(storage, path)
    
    // Upload the file
    await uploadBytes(fileRef, file)
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef)
    
    return downloadURL
  }
  
  /**
   * Create a new recipe
   * @param recipeData The recipe data
   * @param photoFiles The photo files to upload (can be empty if Cloudinary URLs are provided)
   * @returns The created recipe
   */
  async function createRecipe(
    recipeData: Partial<Recipe>, 
    photoFiles: File[]
  ): Promise<Recipe> {
    if (!db) throw new Error('Firestore not initialized')
    if (!isAuthenticated.value) throw new Error('User not authenticated')
    
    isLoading.value = true
    error.value = ''
    
    try {
      // Get current timestamp
      const now = Timestamp.now()
      
      // Prepare recipe data
      const recipe: Partial<Recipe> = {
        ...recipeData,
        authorId: user.value?.uid,
        authorName: user.value?.displayName || 'Anonymous',
        authorPhoto: user.value?.photoURL || undefined,
        createdAt: now,
        updatedAt: now,
        viewCount: 0,
        saveCount: 0,
        rating: {
          average: 0,
          count: 0
        },
        status: 'published',
        isPublic: true
      }
      
      // Upload photos if provided and Cloudinary URLs aren't already set
      if (photoFiles.length > 0 && !recipe.imageUrl) {
        const photoUrls: string[] = []
        
        // Upload each photo
        for (const file of photoFiles) {
          const fileName = `${Date.now()}_${file.name}`
          const path = `recipes/${user.value?.uid}/${fileName}`
          
          const downloadURL = await uploadPhoto(file, path)
          photoUrls.push(downloadURL)
        }
        
        // Set the main image and gallery
        recipe.imageUrl = photoUrls[0]
        recipe.gallery = photoUrls
      }
      
      // Add the recipe to Firestore
      const docRef = await addDoc(collection(db, 'recipes'), recipe)
      
      // Return the created recipe with its ID
      return {
        ...recipe,
        id: docRef.id
      } as Recipe
    } catch (e: any) {
      error.value = e.message || 'Failed to create recipe'
      console.error('Error creating recipe:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Get recipes by user ID
   * @param userId The user ID
   * @param limit The maximum number of recipes to return
   * @returns The user's recipes
   */
  async function getUserRecipes(userId: string, limitCount = 10): Promise<Recipe[]> {
    if (!db) throw new Error('Firestore not initialized')
    
    isLoading.value = true
    error.value = ''
    
    try {
      // Create a query for the user's recipes
      const q = query(
        collection(db, 'recipes'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      
      // Get the recipes
      const querySnapshot = await getDocs(q)
      
      // Map the documents to recipes
      const recipes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[]
      
      return recipes
    } catch (e: any) {
      error.value = e.message || 'Failed to get recipes'
      console.error('Error getting recipes:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    isLoading,
    error,
    createRecipe,
    getUserRecipes
  }
} 