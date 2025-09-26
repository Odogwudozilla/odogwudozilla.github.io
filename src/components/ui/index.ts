// Base UI Components (Atoms) - Export barrel
export { BaseButton, buttonVariants } from './button'
export type { ButtonProps } from './button'

export {
  BaseCard,
  BaseCardHeader,
  BaseCardFooter,
  BaseCardTitle,
  BaseCardDescription,
  BaseCardContent,
} from './card'

export { BaseTypography, typographyVariants } from './typography'
export type { TypographyProps } from './typography'

// Re-export common types for convenience
export type { VariantProps } from 'class-variance-authority'
