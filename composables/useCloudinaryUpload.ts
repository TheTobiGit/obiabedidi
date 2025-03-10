import imageCompression from 'browser-image-compression'

/**
 * Composable for handling image uploads to Cloudinary
 * Provides functions for compressing and uploading images
 */
export const useCloudinaryUpload = () => {
  // Get Cloudinary config from runtime config
  const config = useRuntimeConfig().public.cloudinary
  
  // Reactive state
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref<string | null>(null)
  
  /**
   * Compress an image file before uploading
   * @param file - The image file to compress
   * @returns The compressed image file
   */
  const compressImage = async (file: File): Promise<File> => {
    try {
      // Options for image compression
      const options = {
        maxSizeMB: 1, // Max file size in MB
        maxWidthOrHeight: 1920, // Max width/height in pixels
        useWebWorker: true, // Use web worker for better performance
        onProgress: (progress: number) => {
          uploadProgress.value = Math.round(progress * 50) // First 50% is compression
        }
      }
      
      // Compress the image
      return await imageCompression(file, options)
    } catch (err) {
      error.value = 'Failed to compress image'
      console.error('Image compression error:', err)
      throw err
    }
  }
  
  /**
   * Upload an image to Cloudinary
   * @param file - The image file to upload (compressed or original)
   * @returns The Cloudinary URL of the uploaded image
   */
  const uploadToCloudinary = async (file: File): Promise<string> => {
    if (!config.cloudName || !config.uploadPreset) {
      error.value = 'Cloudinary configuration is incomplete'
      throw new Error('Cloudinary configuration is incomplete')
    }
    
    isUploading.value = true
    error.value = null
    
    try {
      // Create form data for the upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', config.uploadPreset)
      formData.append('api_key', config.apiKey)
      
      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`)
      }
      
      // Parse the response
      const data = await response.json()
      uploadProgress.value = 100
      
      // Return the secure URL of the uploaded image
      return data.secure_url
    } catch (err) {
      error.value = 'Failed to upload image to Cloudinary'
      console.error('Cloudinary upload error:', err)
      throw err
    } finally {
      isUploading.value = false
    }
  }
  
  /**
   * Compress and upload an image to Cloudinary
   * @param file - The image file to process and upload
   * @returns The Cloudinary URL of the uploaded image
   */
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Reset state
      uploadProgress.value = 0
      error.value = null
      isUploading.value = true
      
      // Compress the image
      const compressedFile = await compressImage(file)
      
      // Update progress to show compression is complete
      uploadProgress.value = 50
      
      // Upload the compressed image
      const url = await uploadToCloudinary(compressedFile)
      
      return url
    } catch (err) {
      console.error('Image upload process failed:', err)
      throw err
    } finally {
      isUploading.value = false
    }
  }
  
  return {
    uploadImage,
    compressImage,
    uploadToCloudinary,
    isUploading,
    uploadProgress,
    error
  }
} 