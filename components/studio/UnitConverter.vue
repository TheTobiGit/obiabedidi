<!--
  File: components/studio/UnitConverter.vue
  Unit Converter component for converting between different cooking measurements
-->
<template>
  <div class="space-y-6">
    <!-- Converter Form -->
    <div class="space-y-4">
      <!-- Input Value -->
      <div>
        <label for="amount" class="block text-sm font-medium text-secondary mb-1">Amount</label>
        <input
          id="amount"
          v-model.number="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter value"
          class="w-full px-4 py-2 rounded-lg bg-surface border border-theme outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        />
      </div>
      
      <!-- Unit Selection -->
      <div class="grid grid-cols-2 gap-3">
        <!-- From Unit -->
        <div>
          <label for="fromUnit" class="block text-sm font-medium text-secondary mb-1">From</label>
          <select
            id="fromUnit"
            v-model="fromUnit"
            class="w-full px-4 py-2 rounded-lg bg-surface border border-theme outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <optgroup v-for="(group, groupName) in unitGroups" :key="groupName" :label="groupName">
              <option v-for="unit in group" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </optgroup>
          </select>
        </div>
        
        <!-- To Unit -->
        <div>
          <label for="toUnit" class="block text-sm font-medium text-secondary mb-1">To</label>
          <select
            id="toUnit"
            v-model="toUnit"
            class="w-full px-4 py-2 rounded-lg bg-surface border border-theme outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            <optgroup v-for="(group, groupName) in unitGroups" :key="groupName" :label="groupName">
              <option v-for="unit in group" :key="unit.value" :value="unit.value">
                {{ unit.label }}
              </option>
            </optgroup>
          </select>
        </div>
      </div>
      
      <!-- Swap Button -->
      <div class="flex justify-center">
        <button
          @click="swapUnits"
          class="p-2 rounded-lg text-primary hover:bg-surface-hover transition-colors"
          aria-label="Swap units"
        >
          <Icon name="material-symbols:swap-vert" class="w-6 h-6" />
        </button>
      </div>
    </div>
    
    <!-- Result Display -->
    <div class="p-4 rounded-xl bg-primary/10 text-center">
      <p class="text-lg font-medium text-primary">
        {{ formattedResult }}
      </p>
    </div>
    
    <!-- Common Conversions -->
    <div>
      <h3 class="text-sm font-medium text-secondary mb-2">Common Conversions</h3>
      <div class="space-y-2 text-sm">
        <div v-for="(conversion, index) in commonConversions" :key="index" 
          class="flex justify-between p-2 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <span class="text-primary">{{ conversion.from }}</span>
          <span class="text-muted">=</span>
          <span class="text-primary">{{ conversion.to }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Input values
const amount = ref(1)
const fromUnit = ref('cup')
const toUnit = ref('tbsp')

// Unit definitions
const unitGroups = {
  'Volume': [
    { value: 'cup', label: 'Cup' },
    { value: 'tbsp', label: 'Tablespoon' },
    { value: 'tsp', label: 'Teaspoon' },
    { value: 'floz', label: 'Fluid Ounce' },
    { value: 'ml', label: 'Milliliter' },
    { value: 'l', label: 'Liter' },
    { value: 'pint', label: 'Pint' },
    { value: 'quart', label: 'Quart' },
    { value: 'gallon', label: 'Gallon' }
  ],
  'Weight': [
    { value: 'g', label: 'Gram' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'oz', label: 'Ounce' },
    { value: 'lb', label: 'Pound' }
  ]
}

// Common conversions for reference
const commonConversions = [
  { from: '1 cup', to: '16 tablespoons' },
  { from: '1 tablespoon', to: '3 teaspoons' },
  { from: '1 cup', to: '240 milliliters' },
  { from: '1 pound', to: '453.6 grams' },
  { from: '1 ounce', to: '28.35 grams' }
]

// Conversion factors to base units
// Base units: ml for volume, g for weight
const conversionFactors = {
  // Volume (to ml)
  'cup': 236.588,
  'tbsp': 14.7868,
  'tsp': 4.92892,
  'floz': 29.5735,
  'ml': 1,
  'l': 1000,
  'pint': 473.176,
  'quart': 946.353,
  'gallon': 3785.41,
  
  // Weight (to g)
  'g': 1,
  'kg': 1000,
  'oz': 28.3495,
  'lb': 453.592
}

// Unit types for validation
const unitTypes = {
  'cup': 'volume',
  'tbsp': 'volume',
  'tsp': 'volume',
  'floz': 'volume',
  'ml': 'volume',
  'l': 'volume',
  'pint': 'volume',
  'quart': 'volume',
  'gallon': 'volume',
  'g': 'weight',
  'kg': 'weight',
  'oz': 'weight',
  'lb': 'weight'
}

/**
 * Get the type of unit (volume or weight)
 * @param unit The unit to check
 * @returns The unit type
 */
function getUnitType(unit: string): string {
  return unitTypes[unit as keyof typeof unitTypes] || ''
}

/**
 * Convert between units
 * @param value The value to convert
 * @param from The source unit
 * @param to The target unit
 * @returns The converted value
 */
function convert(value: number, from: string, to: string): number {
  // Check if units are of the same type
  if (getUnitType(from) !== getUnitType(to)) {
    return 0 // Cannot convert between different types
  }
  
  // Convert to base unit, then to target unit
  const baseValue = value * conversionFactors[from as keyof typeof conversionFactors]
  return baseValue / conversionFactors[to as keyof typeof conversionFactors]
}

/**
 * Swap the from and to units
 */
function swapUnits() {
  const temp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = temp
}

// Computed result with formatting
const formattedResult = computed(() => {
  // Check if units are of the same type
  if (getUnitType(fromUnit.value) !== getUnitType(toUnit.value)) {
    return 'Cannot convert between different unit types'
  }
  
  // Calculate the conversion
  const result = convert(amount.value || 0, fromUnit.value, toUnit.value)
  
  // Format the result
  return `${amount.value || 0} ${getUnitLabel(fromUnit.value)} = ${result.toFixed(2)} ${getUnitLabel(toUnit.value)}`
})

/**
 * Get the display label for a unit
 * @param unitValue The unit value
 * @returns The unit label
 */
function getUnitLabel(unitValue: string): string {
  for (const group of Object.values(unitGroups)) {
    const unit = group.find(u => u.value === unitValue)
    if (unit) return unit.label
  }
  return unitValue
}
</script> 