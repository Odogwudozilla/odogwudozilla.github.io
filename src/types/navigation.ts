/**
 * Navigation-specific type definitions
 */

export interface NavigationItem {
  label: string
  href: string
  icon?: string
  external?: boolean
  children?: NavigationItem[] // For future dropdown support
}

export interface LayoutHeaderProps {
  variant?: 'default' | 'transparent' | 'sticky'
  showLogo?: boolean
  navigationItems: NavigationItem[]
  currentPath?: string
  className?: string
}

export type HeaderVariant = LayoutHeaderProps['variant']
