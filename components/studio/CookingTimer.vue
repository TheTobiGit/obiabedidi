<!--
  File: components/studio/CookingTimer.vue
  Cooking Timer component for setting and managing multiple timers
-->
<template>
  <div>
    <!-- Tab Navigation -->
    <div class="flex border-b border-theme mb-4">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 py-2 text-center text-sm font-medium transition-colors"
        :class="activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-secondary'"
      >
        <div class="flex items-center justify-center gap-1">
          <Icon :name="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
          <div v-if="tab.id === 'timers' && timers.length > 0" class="ml-1 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
            {{ timers.length }}
          </div>
        </div>
      </button>
    </div>
    
    <!-- Tab Content -->
    <div class="relative">
      <!-- Timers Tab -->
      <div v-if="activeTab === 'timers'" class="space-y-3">
        <!-- Active Timers -->
        <div v-if="timers.length > 0" class="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          <div 
            v-for="(timer, index) in timers" 
            :key="index"
            class="p-3 rounded-xl border border-theme"
            :class="{ 
              'bg-surface': timer.status !== 'completed',
              'bg-success/10 border-success/30': timer.status === 'completed'
            }"
          >
            <!-- Timer Header -->
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div 
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-primary animate-pulse': timer.status === 'running',
                    'bg-muted': timer.status === 'paused',
                    'bg-success': timer.status === 'completed'
                  }"
                ></div>
                <h4 class="font-medium text-primary">{{ timer.name || `Timer ${index + 1}` }}</h4>
              </div>
              <div class="text-xs text-muted">
                {{ timer.status === 'completed' ? 'Completed' : formatTime(timer.initialDuration) }}
              </div>
            </div>
            
            <!-- Timer Progress -->
            <div class="mb-2">
              <div class="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full transition-all duration-1000"
                  :class="{
                    'bg-primary': timer.status !== 'completed',
                    'bg-success': timer.status === 'completed'
                  }"
                  :style="{ width: `${getProgressPercentage(timer)}%` }"
                ></div>
              </div>
            </div>
            
            <!-- Timer Display and Controls -->
            <div class="flex items-center justify-between">
              <div class="text-lg font-semibold text-primary">
                {{ formatTime(timer.remainingTime) }}
              </div>
              
              <!-- Timer Controls -->
              <div class="flex items-center gap-1">
                <button
                  v-if="timer.status !== 'completed'"
                  @click="toggleTimer(index)"
                  class="p-1.5 rounded-lg text-primary hover:bg-surface-hover transition-colors"
                  :aria-label="timer.status === 'running' ? 'Pause timer' : 'Resume timer'"
                >
                  <Icon 
                    :name="timer.status === 'running' ? 'material-symbols:pause' : 'material-symbols:play-arrow'" 
                    class="w-5 h-5"
                  />
                </button>
                
                <button
                  @click="resetTimer(index)"
                  class="p-1.5 rounded-lg text-primary hover:bg-surface-hover transition-colors"
                  aria-label="Reset timer"
                >
                  <Icon name="material-symbols:refresh" class="w-5 h-5" />
                </button>
                
                <button
                  @click="removeTimer(index)"
                  class="p-1.5 rounded-lg text-red-500 hover:bg-surface-hover transition-colors"
                  aria-label="Remove timer"
                >
                  <Icon name="material-symbols:delete-outline" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Timers Message -->
        <div v-else class="p-6 rounded-xl bg-surface border-theme text-center">
          <Icon name="material-symbols:timer-outline" class="w-12 h-12 text-muted mx-auto mb-3" />
          <p class="text-secondary">No active timers</p>
          <p class="text-sm text-muted mt-1">Add a timer to get started</p>
        </div>
        
        <!-- Floating Action Button -->
        <button 
          @click="activeTab = 'add'"
          class="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
          aria-label="Add new timer"
        >
          <Icon name="material-symbols:add" class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Add Timer Tab -->
      <div v-else-if="activeTab === 'add'" class="space-y-4">
        <div class="p-4 rounded-xl bg-surface border-theme">
          <!-- Timer Name -->
          <div class="mb-3">
            <label for="timerName" class="block text-sm font-medium text-secondary mb-1">Timer Name</label>
            <input
              id="timerName"
              v-model="newTimer.name"
              type="text"
              placeholder="e.g., Pasta, Rice, Chicken"
              class="w-full px-4 py-2 rounded-lg bg-surface border border-theme outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          <!-- Timer Duration -->
          <div class="grid grid-cols-3 gap-2 mb-4">
            <div>
              <label for="hours" class="block text-sm font-medium text-secondary mb-1">Hours</label>
              <input
                id="hours"
                v-model.number="newTimer.hours"
                type="number"
                min="0"
                max="23"
                placeholder="0"
                class="w-full px-4 py-2 rounded-lg bg-surface border border-theme outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label for="minutes" class="block text-sm font-medium text-secondary mb-1">Minutes</label>
              <input
                id="minutes"
                v-model.number="newTimer.minutes"
                type="number"
                min="0"
                max="59"
                placeholder="0"
                class="w-full px-4 py-2 rounded-lg bg-surface border border-theme outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label for="seconds" class="block text-sm font-medium text-secondary mb-1">Seconds</label>
              <input
                id="seconds"
                v-model.number="newTimer.seconds"
                type="number"
                min="0"
                max="59"
                placeholder="0"
                class="w-full px-4 py-2 rounded-lg bg-surface border border-theme outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
          
          <!-- Add Button -->
          <button
            @click="addTimerAndSwitchTab"
            :disabled="!isValidTimer"
            class="w-full py-2 rounded-lg bg-primary text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Timer
          </button>
        </div>
      </div>
      
      <!-- Presets Tab -->
      <div v-else-if="activeTab === 'presets'" class="space-y-4">
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="preset in presets"
            :key="preset.name"
            @click="applyPresetAndSwitchTab(preset)"
            class="flex items-center gap-2 p-3 rounded-lg border border-theme bg-surface hover:bg-surface-hover transition-colors text-left"
          >
            <Icon :name="preset.icon" class="w-5 h-5 text-primary" />
            <div>
              <div class="text-sm font-medium text-primary">{{ preset.name }}</div>
              <div class="text-xs text-muted">{{ formatTime(preset.duration) }}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'

// Tab navigation
const tabs = [
  { id: 'timers', label: 'Timers', icon: 'material-symbols:timer' },
  { id: 'add', label: 'Add', icon: 'material-symbols:add' },
  { id: 'presets', label: 'Presets', icon: 'material-symbols:bookmark' }
]
const activeTab = ref('timers')

// Timer type definition
interface Timer {
  name: string
  initialDuration: number // in milliseconds
  remainingTime: number // in milliseconds
  status: 'running' | 'paused' | 'completed'
  interval: number | null
  startTime: number | null
}

// New timer form state
const newTimer = ref({
  name: '',
  hours: 0,
  minutes: 0,
  seconds: 0
})

// Active timers
const timers = ref<Timer[]>([])

// Timer presets
const presets = [
  { name: 'Boil Pasta', duration: 10 * 60 * 1000, icon: 'material-symbols:cooking' },
  { name: 'Boil Eggs', duration: 7 * 60 * 1000, icon: 'material-symbols:egg' },
  { name: 'Rice', duration: 20 * 60 * 1000, icon: 'material-symbols:rice-bowl' },
  { name: 'Tea', duration: 3 * 60 * 1000, icon: 'material-symbols:coffee' }
]

// Computed property to check if the new timer is valid
const isValidTimer = computed(() => {
  const { hours, minutes, seconds } = newTimer.value
  return (hours > 0 || minutes > 0 || seconds > 0)
})

/**
 * Format time in milliseconds to HH:MM:SS
 * @param ms Time in milliseconds
 * @returns Formatted time string
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':')
}

/**
 * Calculate progress percentage for a timer
 * @param timer The timer object
 * @returns Progress percentage (0-100)
 */
function getProgressPercentage(timer: Timer): number {
  if (timer.initialDuration === 0) return 0
  if (timer.status === 'completed') return 100
  
  const progress = ((timer.initialDuration - timer.remainingTime) / timer.initialDuration) * 100
  return Math.min(Math.max(progress, 0), 100)
}

/**
 * Add a new timer and switch to timers tab
 */
function addTimerAndSwitchTab(): void {
  addTimer()
  activeTab.value = 'timers'
}

/**
 * Add a new timer
 */
function addTimer(): void {
  if (!isValidTimer.value) return
  
  const { name, hours, minutes, seconds } = newTimer.value
  const duration = (hours * 60 * 60 + minutes * 60 + seconds) * 1000
  
  const timer: Timer = {
    name,
    initialDuration: duration,
    remainingTime: duration,
    status: 'paused',
    interval: null,
    startTime: null
  }
  
  timers.value.push(timer)
  
  // Reset form
  newTimer.value = {
    name: '',
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  
  // Auto-start the timer
  toggleTimer(timers.value.length - 1)
}

/**
 * Apply a preset timer and switch to timers tab
 * @param preset The preset timer configuration
 */
function applyPresetAndSwitchTab(preset: { name: string, duration: number }): void {
  applyPreset(preset)
  activeTab.value = 'timers'
}

/**
 * Apply a preset timer
 * @param preset The preset timer configuration
 */
function applyPreset(preset: { name: string, duration: number }): void {
  const timer: Timer = {
    name: preset.name,
    initialDuration: preset.duration,
    remainingTime: preset.duration,
    status: 'paused',
    interval: null,
    startTime: null
  }
  
  timers.value.push(timer)
  
  // Auto-start the timer
  toggleTimer(timers.value.length - 1)
}

/**
 * Start or pause a timer
 * @param index The index of the timer to toggle
 */
function toggleTimer(index: number): void {
  const timer = timers.value[index]
  
  if (timer.status === 'completed') return
  
  if (timer.status === 'running') {
    // Pause the timer
    if (timer.interval) {
      clearInterval(timer.interval)
      timer.interval = null
    }
    timer.status = 'paused'
  } else {
    // Start the timer
    timer.status = 'running'
    timer.startTime = performance.now()
    
    timer.interval = window.setInterval(() => {
      if (!timer.startTime) return
      
      const elapsed = performance.now() - timer.startTime
      timer.remainingTime = Math.max(0, timer.remainingTime - elapsed)
      timer.startTime = performance.now()
      
      // Check if timer is completed
      if (timer.remainingTime <= 0) {
        timer.remainingTime = 0
        timer.status = 'completed'
        clearInterval(timer.interval!)
        timer.interval = null
        
        // Play sound notification
        playNotificationSound()
      }
    }, 100) // Update every 100ms for smoother progress
  }
}

/**
 * Reset a timer to its initial state
 * @param index The index of the timer to reset
 */
function resetTimer(index: number): void {
  const timer = timers.value[index]
  
  // Clear interval if running
  if (timer.interval) {
    clearInterval(timer.interval)
    timer.interval = null
  }
  
  // Reset timer state
  timer.remainingTime = timer.initialDuration
  timer.status = 'paused'
  timer.startTime = null
}

/**
 * Remove a timer
 * @param index The index of the timer to remove
 */
function removeTimer(index: number): void {
  const timer = timers.value[index]
  
  // Clear interval if running
  if (timer.interval) {
    clearInterval(timer.interval)
  }
  
  // Remove timer from array
  timers.value.splice(index, 1)
}

/**
 * Play a notification sound when a timer completes
 */
function playNotificationSound(): void {
  try {
    const audio = new Audio('/sounds/timer-complete.mp3')
    audio.play()
  } catch (error) {
    console.error('Failed to play notification sound:', error)
  }
}

// Clean up intervals when component is unmounted
onBeforeUnmount(() => {
  timers.value.forEach(timer => {
    if (timer.interval) {
      clearInterval(timer.interval)
    }
  })
})
</script> 