import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * Typography component variants for consistent text styling
 */
const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      lead: 'text-xl text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements
}

/**
 * BaseTypography - Foundational typography component with design system variants
 *
 * @param {Object} props - Component properties
 * @param {string} [variant='p'] - Typography style variant
 * @param {string} [as] - HTML element to render as
 * @param {string} [className] - Additional CSS classes
 * @param {ReactNode} children - Text content
 * @returns {JSX.Element} Rendered typography element
 *
 * @example
 * <BaseTypography variant="h1">
 *   Welcome to My Portfolio
 * </BaseTypography>
 *
 * @example
 * <BaseTypography variant="lead" as="p">
 *   Software Engineer specializing in modern web applications
 * </BaseTypography>
 */
const BaseTypography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Comp = as || getDefaultElement(variant) || 'p'

    return (
      <Comp
        className={cn(typographyVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
BaseTypography.displayName = 'BaseTypography'

/**
 * Get default HTML element for typography variant
 */
function getDefaultElement(variant: TypographyProps['variant']): keyof JSX.IntrinsicElements {
  switch (variant) {
    case 'h1':
      return 'h1'
    case 'h2':
      return 'h2'
    case 'h3':
      return 'h3'
    case 'h4':
      return 'h4'
    case 'blockquote':
      return 'blockquote'
    case 'large':
    case 'lead':
    case 'p':
    default:
      return 'p'
  }
}

export { BaseTypography, typographyVariants }
