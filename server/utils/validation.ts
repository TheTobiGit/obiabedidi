// File: server/utils/validation.ts
// Validation utilities for API endpoints

import { validate as uuidValidate } from 'uuid'

// Valid sort fields for recipes
export const VALID_SORT_FIELDS = ['name', 'prepTime', 'cookTime', 'difficulty', 'createdAt'] as const
export type ValidSortField = typeof VALID_SORT_FIELDS[number]

// Valid difficulty levels
export const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const
export type ValidDifficulty = typeof VALID_DIFFICULTIES[number]

// Interface for validation errors
export interface ValidationError {
  field: string
  message: string
}

// Validation result type
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

/**
 * Validates a UUID string
 */
export function isValidUUID(id: string): boolean {
  return uuidValidate(id)
}

/**
 * Validates and sanitizes a search term
 */
export function sanitizeSearchTerm(term: string): string {
  return term.trim().toLowerCase()
}

/**
 * Validates sort parameters
 */
export function validateSortParams(field?: string, order?: string): ValidationResult {
  const errors: ValidationError[] = []

  if (field && !VALID_SORT_FIELDS.includes(field as ValidSortField)) {
    errors.push({
      field: 'sortBy',
      message: `Invalid sort field. Must be one of: ${VALID_SORT_FIELDS.join(', ')}`
    })
  }

  if (order && !['asc', 'desc'].includes(order.toLowerCase())) {
    errors.push({
      field: 'sortOrder',
      message: 'Sort order must be either "asc" or "desc"'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates difficulty levels
 */
export function validateDifficulties(difficulties: string[]): ValidationResult {
  const errors: ValidationError[] = []
  const invalidDifficulties = difficulties.filter(
    d => !VALID_DIFFICULTIES.includes(d as ValidDifficulty)
  )

  if (invalidDifficulties.length > 0) {
    errors.push({
      field: 'difficulties',
      message: `Invalid difficulty levels: ${invalidDifficulties.join(', ')}. Must be one of: ${VALID_DIFFICULTIES.join(', ')}`
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates numeric parameters
 */
export function validateNumericParam(value: string, fieldName: string, min = 0): ValidationResult {
  const errors: ValidationError[] = []
  const num = parseInt(value)

  if (isNaN(num) || num < min) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be a number greater than or equal to ${min}`
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Combines multiple validation results
 */
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const errors = results.flatMap(r => r.errors)
  return {
    isValid: errors.length === 0,
    errors
  }
} 