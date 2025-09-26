import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * BaseCard - Foundational card component for consistent content containers
 */
const BaseCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
))
BaseCard.displayName = 'BaseCard'

/**
 * BaseCardHeader - Card header section with consistent spacing
 */
const BaseCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
))
BaseCardHeader.displayName = 'BaseCardHeader'

/**
 * BaseCardTitle - Card title with proper typography hierarchy
 */
const BaseCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
BaseCardTitle.displayName = 'BaseCardTitle'

/**
 * BaseCardDescription - Card description with muted styling
 */
const BaseCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
BaseCardDescription.displayName = 'BaseCardDescription'

/**
 * BaseCardContent - Card main content area
 */
const BaseCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
BaseCardContent.displayName = 'BaseCardContent'

/**
 * BaseCardFooter - Card footer section for actions
 */
const BaseCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
))
BaseCardFooter.displayName = 'BaseCardFooter'

export {
  BaseCard,
  BaseCardHeader,
  BaseCardFooter,
  BaseCardTitle,
  BaseCardDescription,
  BaseCardContent,
}
