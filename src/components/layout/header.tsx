'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BaseButton, BaseTypography } from '@/components/ui'
import type { LayoutHeaderProps, NavigationItem } from '@/types/navigation'

/**
 * LayoutHeader - Responsive navigation header with mobile menu support
 *
 * @param {Object} props - Component properties
 * @param {string} [variant='default'] - Header style variant
 * @param {boolean} [showLogo=true] - Whether to display the logo
 * @param {NavigationItem[]} navigationItems - Array of navigation items
 * @param {string} [currentPath] - Current page path for highlighting
 * @param {string} [className] - Additional CSS classes
 * @returns {JSX.Element} Rendered header component
 *
 * @example
 * <LayoutHeader
 *   navigationItems={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Portfolio', href: '/portfolio' },
 *     { label: 'Blog', href: '/blog' },
 *     { label: 'Contact', href: '/contact' }
 *   ]}
 *   currentPath="/portfolio"
 * />
 */
export function LayoutHeader({
  variant = 'default',
  showLogo = true,
  navigationItems,
  currentPath,
  className,
}: LayoutHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Close mobile menu when clicking outside or on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (e: Event) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-mobile-menu]')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('click', handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const headerVariants = {
    default: 'bg-background border-b border-border',
    transparent: 'bg-transparent',
    sticky: 'bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50',
  }

  const isCurrentPage = (href: string) => {
    if (href === '/' && currentPath === '/') return true
    if (href !== '/' && currentPath?.startsWith(href)) return true
    return false
  }

  return (
    <header
      className={cn(
        'w-full transition-all duration-200',
        headerVariants[variant],
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          {showLogo && (
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <BaseTypography
                variant="h4"
                className="font-bold text-primary"
              >
                Chidozie Nnachor
              </BaseTypography>
            </Link>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <NavigationLink
                key={item.href}
                item={item}
                isActive={isCurrentPage(item.href)}
              />
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <BaseButton
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </BaseButton>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            className={cn(
              'md:hidden absolute left-0 right-0 top-16 bg-background border-b border-border shadow-lg',
              'animate-in slide-in-from-top-2 duration-200'
            )}
            data-mobile-menu
          >
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <MobileNavigationLink
                    key={item.href}
                    item={item}
                    isActive={isCurrentPage(item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

/**
 * NavigationLink - Desktop navigation link component
 */
interface NavigationLinkProps {
  item: NavigationItem
  isActive: boolean
}

function NavigationLink({ item, isActive }: NavigationLinkProps) {
  const linkContent = (
    <BaseTypography
      variant="small"
      className={cn(
        'font-medium transition-colors hover:text-primary',
        isActive
          ? 'text-primary border-b-2 border-primary pb-1'
          : 'text-muted-foreground'
      )}
    >
      {item.label}
    </BaseTypography>
  )

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        {linkContent}
      </a>
    )
  }

  return (
    <Link
      href={item.href}
      className="transition-opacity hover:opacity-80"
    >
      {linkContent}
    </Link>
  )
}

/**
 * MobileNavigationLink - Mobile navigation link component
 */
interface MobileNavigationLinkProps {
  item: NavigationItem
  isActive: boolean
  onClick: () => void
}

function MobileNavigationLink({ item, isActive, onClick }: MobileNavigationLinkProps) {
  const linkContent = (
    <BaseTypography
      variant="p"
      className={cn(
        'font-medium py-2 px-4 rounded-md transition-colors',
        isActive
          ? 'text-primary bg-primary/10'
          : 'text-muted-foreground hover:text-primary hover:bg-accent'
      )}
    >
      {item.label}
    </BaseTypography>
  )

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="block"
      >
        {linkContent}
      </a>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="block"
    >
      {linkContent}
    </Link>
  )
}
