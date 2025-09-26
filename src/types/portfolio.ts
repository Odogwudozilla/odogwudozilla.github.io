/**
 * Portfolio-specific type definitions
 */

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  technologies: string[]
  imageUrl?: string
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  category: ProjectCategory
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
}

export type ProjectCategory =
  | 'web-app'
  | 'mobile-app'
  | 'api'
  | 'tool'
  | 'library'
  | 'other'

export type ProjectStatus =
  | 'completed'
  | 'in-progress'
  | 'planning'
  | 'maintained'

export interface ProjectFilter {
  category?: ProjectCategory
  technology?: string
  featured?: boolean
  status?: ProjectStatus
}

export interface Skill {
  name: string
  category: SkillCategory
  level: SkillLevel
  yearsOfExperience?: number
  certified?: boolean
}

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'cloud'
  | 'tools'
  | 'soft-skills'

export type SkillLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'

export interface Experience {
  id: string
  company: string
  position: string
  startDate: Date
  endDate?: Date
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
  location: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: Date
  endDate: Date
  gpa?: number
  achievements?: string[]
}
