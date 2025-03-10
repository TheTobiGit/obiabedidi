/**
 * File: composables/useVideoUrl.ts
 * Composable for handling video URLs and thumbnails
 * Supports multiple video platforms
 */

import { ref, computed, watch } from 'vue'
import { useFetch } from '#app'

type VideoProvider = 'youtube' | 'vimeo' | 'facebook' | 'instagram' | 'tiktok' | 'dailymotion' | null

interface VideoInfo {
  provider: VideoProvider
  videoId: string | null
  thumbnailUrl: string | null
  error: string | null
}

interface VimeoOEmbed {
  thumbnail_url: string
  title: string
}

interface VideoPattern {
  provider: Exclude<VideoProvider, null>
  patterns: RegExp[]
}

export function useVideoUrl(initialUrl: string = '') {
  const videoUrl = ref(initialUrl)
  const isLoading = ref(false)
  const thumbnailUrl = ref<string | null>(null)
  
  // YouTube URL patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]
  
  // Vimeo URL patterns
  const vimeoPatterns = [
    /vimeo\.com\/([0-9]+)/,
    /vimeo\.com\/video\/([0-9]+)/,
    /player\.vimeo\.com\/video\/([0-9]+)/,
  ]
  
  // Facebook URL patterns
  const facebookPatterns = [
    /facebook\.com\/.*\/videos\/([0-9]+)/,
    /fb\.watch\/([^/]+)/,
  ]
  
  // Instagram URL patterns
  const instagramPatterns = [
    /instagram\.com\/.*\/([^/]+)/,
    /instagram\.com\/reel\/([^/]+)/,
  ]
  
  // TikTok URL patterns
  const tiktokPatterns = [
    /tiktok\.com\/@[^/]+\/video\/([0-9]+)/,
    /vm\.tiktok\.com\/([^/]+)/,
  ]
  
  // Dailymotion URL patterns
  const dailymotionPatterns = [
    /dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
    /dai\.ly\/([a-zA-Z0-9]+)/,
  ]
  
  // All video patterns
  const videoPatterns: VideoPattern[] = [
    { provider: 'youtube', patterns: youtubePatterns },
    { provider: 'vimeo', patterns: vimeoPatterns },
    { provider: 'facebook', patterns: facebookPatterns },
    { provider: 'instagram', patterns: instagramPatterns },
    { provider: 'tiktok', patterns: tiktokPatterns },
    { provider: 'dailymotion', patterns: dailymotionPatterns },
  ]
  
  /**
   * Extract video ID and provider from URL
   * @param url Video URL to parse
   * @returns Object containing provider and video ID
   */
  function parseVideoUrl(url: string): Pick<VideoInfo, 'provider' | 'videoId'> {
    for (const { provider, patterns } of videoPatterns) {
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
          return { provider, videoId: match[1] }
        }
      }
    }
    
    return { provider: null, videoId: null }
  }
  
  /**
   * Get Vimeo thumbnail URL using oEmbed API
   * @param videoId Vimeo video ID
   * @returns Promise with thumbnail URL
   */
  async function getVimeoThumbnail(videoId: string): Promise<string | null> {
    try {
      const { data } = await useFetch<VimeoOEmbed>(
        `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`,
        { server: false }
      )
      return data.value?.thumbnail_url || null
    } catch {
      return null
    }
  }
  
  /**
   * Get thumbnail URL for the video
   * @param provider Video provider
   * @param videoId Video ID
   * @returns Promise with thumbnail URL
   */
  async function getThumbnailUrl(provider: VideoProvider, videoId: string | null): Promise<string | null> {
    if (!provider || !videoId) return null
    isLoading.value = true
    
    try {
      switch (provider) {
        case 'youtube':
          return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
        case 'vimeo':
          return await getVimeoThumbnail(videoId)
        case 'facebook':
          return `https://graph.facebook.com/${videoId}/picture`
        case 'dailymotion':
          return `https://www.dailymotion.com/thumbnail/video/${videoId}`
        // Instagram and TikTok require authentication for their APIs
        // We'll return null for now and can implement proper API calls later
        case 'instagram':
        case 'tiktok':
          return null
        default:
          return null
      }
    } catch {
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  // Watch for URL changes and update thumbnail
  watch(videoUrl, async (newUrl) => {
    if (!newUrl) {
      thumbnailUrl.value = null
      return
    }
    
    const { provider, videoId } = parseVideoUrl(newUrl)
    if (provider && videoId) {
      thumbnailUrl.value = await getThumbnailUrl(provider, videoId)
    } else {
      thumbnailUrl.value = null
    }
  }, { immediate: true })
  
  // Computed video information
  const videoInfo = computed<VideoInfo>(() => {
    if (!videoUrl.value) {
      return {
        provider: null,
        videoId: null,
        thumbnailUrl: thumbnailUrl.value,
        error: null
      }
    }
    
    try {
      const { provider, videoId } = parseVideoUrl(videoUrl.value)
      
      if (!provider || !videoId) {
        return {
          provider: null,
          videoId: null,
          thumbnailUrl: null,
          error: 'Invalid video URL. Please enter a valid video URL.'
        }
      }
      
      return {
        provider,
        videoId,
        thumbnailUrl: thumbnailUrl.value,
        error: null
      }
    } catch (error) {
      return {
        provider: null,
        videoId: null,
        thumbnailUrl: null,
        error: 'Failed to parse video URL.'
      }
    }
  })
  
  // Expose composable state and methods
  return {
    videoUrl,
    isLoading,
    videoInfo,
    parseVideoUrl,
    getThumbnailUrl
  }
} 