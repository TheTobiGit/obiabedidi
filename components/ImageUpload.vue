<script setup lang="ts">
// Props for the component
const props = defineProps<{
  label?: string
  multiple?: boolean
  maxFiles?: number
  previewSize?: 'sm' | 'md' | 'lg'
  required?: boolean
}>()

// Default values for props
const {
  label = 'Upload Image',
  multiple = false,
  maxFiles = 5,
  previewSize = 'md',
  required = false
} = props

// Emits for the component
const emit = defineEmits<{
  upload: [urls: string[]]
  error: [message: string]
  uploading: [isUploading: boolean]
}>()

// Get the Cloudinary upload composable
const { uploadImage, isUploading, uploadProgress, error } = useCloudinaryUpload()

// State for the component
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const previews = ref<string[]>([])
const uploadedUrls = ref<string[]>([])
const isHovering = ref(false)

// Computed properties
const previewSizeClass = computed(() => {
  switch (previewSize) {
    case 'sm': return 'h-20 w-20'
    case 'lg': return 'h-40 w-40'
    default: return 'h-32 w-32'
  }
})

// Check if there are files selected
const hasSelectedFiles = computed(() => selectedFiles.value.length > 0)

// Methods
const openFileSelector = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  
  // Convert FileList to array and filter for images
  const files = Array.from(input.files).filter(file => file.type.startsWith('image/'))
  
  // Check if we have too many files
  if (multiple && files.length > maxFiles) {
    emit('error', `You can only upload up to ${maxFiles} images`)
    return
  }
  
  // Handle single file mode
  if (!multiple && files.length > 0) {
    selectedFiles.value = [files[0]]
    createPreview(files[0])
    return
  }
  
  // Handle multiple files
  selectedFiles.value = files
  files.forEach(createPreview)
}

const createPreview = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      if (!multiple) {
        // Single file mode - replace preview
        previews.value = [e.target.result as string]
      } else {
        // Multiple file mode - add to previews
        previews.value.push(e.target.result as string)
      }
    }
  }
  reader.readAsDataURL(file)
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
  previews.value.splice(index, 1)
  uploadedUrls.value.splice(index, 1)
}

/**
 * Upload selected files to Cloudinary
 * This method is exposed to the parent component and called when saving the recipe
 * @returns Promise with array of uploaded image URLs
 */
const uploadFiles = async (): Promise<string[]> => {
  if (!selectedFiles.value.length) return []
  
  try {
    // Signal that upload is starting
    emit('uploading', true)
    
    const urls: string[] = []
    
    // Upload each file
    for (const file of selectedFiles.value) {
      const url = await uploadImage(file)
      urls.push(url)
    }
    
    // Store the uploaded URLs
    uploadedUrls.value = urls
    
    // Emit the URLs
    emit('upload', urls)
    
    return urls
  } catch (err) {
    const errorMessage = error.value || 'Failed to upload images'
    emit('error', errorMessage)
    throw new Error(errorMessage)
  }
}

// Reset the component state
const reset = () => {
  selectedFiles.value = []
  previews.value = []
  uploadedUrls.value = []
}

// Expose methods and properties to parent component
defineExpose({
  uploadFiles,
  hasSelectedFiles,
  reset,
  selectedFiles
})

// Handle drag and drop
const handleDragEnter = () => {
  isHovering.value = true
}

const handleDragLeave = () => {
  isHovering.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isHovering.value = false
  
  if (!event.dataTransfer?.files.length) return
  
  const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'))
  
  if (!multiple && files.length > 0) {
    selectedFiles.value = [files[0]]
    createPreview(files[0])
  } else if (multiple) {
    // Check max files limit
    if (files.length > maxFiles) {
      emit('error', `You can only upload up to ${maxFiles} images`)
      return
    }
    
    selectedFiles.value = files
    files.forEach(createPreview)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- File input (hidden) -->
    <input
      ref="fileInput"
      type="file"
      :accept="'image/*'"
      :multiple="multiple"
      class="hidden"
      @change="handleFileSelect"
    />
    
    <!-- Drop zone -->
    <div
      class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors"
      :class="[
        isHovering ? 'border-primary-500 bg-primary-50' : 'border-gray-300',
        isUploading ? 'opacity-75 pointer-events-none' : ''
      ]"
      @click="openFileSelector"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @dragover="handleDragOver"
      @drop="handleDrop"
    >
      <!-- Upload icon or preview -->
      <div v-if="!previews.length" class="py-4">
        <div class="mx-auto h-12 w-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="mt-1 text-sm text-gray-600">
          Click to upload or drag and drop
        </p>
        <p class="text-xs text-gray-500">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
      
      <!-- Image previews -->
      <div v-else class="flex flex-wrap gap-4 justify-center">
        <div
          v-for="(preview, index) in previews"
          :key="index"
          class="relative group"
        >
          <img
            :src="preview"
            :class="[previewSizeClass, 'object-cover rounded-lg']"
            alt="Preview"
          />
          
          <!-- Remove button -->
          <button
            type="button"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop="removeFile(index)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Upload progress -->
      <div v-if="isUploading" class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
        <p class="text-sm text-gray-600 mt-1">
          Uploading... {{ uploadProgress }}%
        </p>
      </div>
    </div>
    
    <!-- Error message -->
    <p v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template> 