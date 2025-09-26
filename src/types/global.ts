/**
 * Global type definitions for the portfolio application
 */

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Navigation types
export interface NavigationItem {
  label: string
  href: string
  icon?: string
  external?: boolean
}

// SEO and metadata types
export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
}
