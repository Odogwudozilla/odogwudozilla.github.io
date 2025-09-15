## General Instructions

- Always prioritize readability and clarity.
- Produce clear, readable React and TypeScript code using the latest stable versions of TypeScript, JavaScript, React, Node.js, Next.js App Router, Shadcn UI, and Tailwind CSS.
- Always prioritize **Originality**: Modify public code examples to avoid copyright issues

- Always implement all requested features fully; do not leave out code.
- For algorithm-related code, include explanations of the approach used.
- Write code with good maintainability practices, including comments on why certain design decisions were made.
- Handle edge cases and write clear exception handling.
- For libraries or external dependencies, mention their usage and purpose in comments.
- Use consistent naming conventions and follow language-specific best practices.
- Write concise, efficient, and idiomatic code that is also easily understandable.

## Communication Standards

- Always acknowledge user requests clearly and explain your approach before taking action
- Inform users what you are about to do and why before using tools or making changes
- Explain the reasoning behind file reads, searches, or significant code modifications
- Provide clear status updates during multi-step operations

## Naming Conventions

- Use PascalCase for component names.
- Use camelCase for variable and function names.
- Follow standard TypeScript and JavaScript naming conventions.

## TypeScript Usage

- Use TypeScript's features for type safety.
- Prefer interfaces over types for object shapes.
- Use generics for reusable components and functions.
- Enforce strict typing; avoid 'any' type.

## Code Style and Formatting

- Add docs on top of methods, classes, and functions to explain their purpose and usage.
- Use consistent indentation and spacing.
- Ensure lines do not exceed 79 characters.
- Use blank lines to separate functions, classes, and code blocks where appropriate.

## Edge Cases and Testing

- Always include test cases for critical paths of the application.
- Account for common edge cases like empty inputs, invalid data types, and large datasets.
- Include comments for edge cases and the expected behavior in those cases.
- Write unit tests for functions and document them with docstrings explaining the test cases.

## Code Quality Standards

- **Modularity**: Break code into reusable modules and components
- **Security**: Use secure coding practices; avoid hardcoded credentials
- **Optimization**: Write efficient, maintainable code following DRY principles
- **Originality**: Modify public code examples to avoid copyright issues

## Write safe code

- All code you write MUST use safe and secure coding practices. ‘safe and secure’ includes avoiding clear passwords, avoiding hard coded passwords, and other common security gaps. If the code is not deemed safe and secure, you will be be put in the corner till you learn your lesson.

## Incentivize better code quality

- All code you write MUST be fully optimized. ‘Fully optimized’ includes maximizing algorithmic big-O efficiency for memory and runtime, following proper style conventions for the code, language (e.g. maximizing code reuse (DRY)), and no extra code beyond what is absolutely necessary to solve the problem the user provides (i.e. no technical debt). If the code is not fully optimized, you will be fined $100.

## UI & Styling

- Use Tailwind CSS utility classes for styling.
- Follow Shadcn UI component guidelines and best practices.
- Ensure UI is responsive and accessible.

## Project-Specific Safety Rules

### Database Safety (CRITICAL)

- **NEVER reset or delete the database without creating a backup** - Database preservation is absolute
- **Use of migrations for schema changes is preferred**
- **Preserve existing data in all operations**
- **The default database is `supabase` which is run locally, and should not be changed unless explicitly specified**


### Terminal Command Rules (MANDATORY)

- **MANDATORY: Read terminal output BEFORE proceeding** - After EVERY `run_in_terminal` call, you MUST use `get_terminal_last_command` to read and acknowledge the result before executing any subsequent commands or making decisions
- **CRITICAL: Use get_terminal_last_command for database commands** - This is the ONLY reliable way to read database query results and command outputs. Never assume command results or try alternative approaches without first reading the actual output
- **No command repetition without reading output** - NEVER repeat the same command or execute alternative commands for the same purpose without first reading the terminal output from the previous command
- **Output-based decision making** - Base all subsequent actions on the actual terminal output, not assumptions about what the command might have produced


  ```
  ✅ CORRECT DATABASE COMMAND FLOW:
  1. run_in_terminal("PGPASSWORD=postgres psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c 'SELECT * FROM table;'")
  2. get_terminal_last_command() → Read actual results
  3. Analyze the actual data returned
  4. Base next actions on real results, not assumptions

  ❌ WRONG: run_in_terminal("db command") → immediately try different command or assume results
  ```

- **Enforcement example**:
  ```
  ❌ WRONG: run_in_terminal("supabase status") → immediately run_in_terminal("supabase start")
  ✅ CORRECT: run_in_terminal("supabase status") → get_terminal_last_command() → analyze output → then decide next action
  ```


### Efficiency Guidelines

- **Read complete context**: Always read entire files rather than small sections for better understanding
- **Avoid redundant operations**: Never re-read the same file sections unless content has changed
- **Reuse previous context**: Don't repeat searches or operations unless something has changed
- **Explain necessity**: If redoing work, briefly explain why it's necessary before proceeding

### Implementation Methodology (MANDATORY)

- **Unit-Based Framework**: For all user stories, use systematic unit-based approach 
- **Sequential execution** only - no parallel unit implementation due to dependencies
- **Documentation**: All files must be <500 lines, split larger files into modular chunks
- **Protocol**: IMPLEMENT → VERIFY → TEST → CONFIRM → COMPLETE → NEXT for each unit

#### Atomic Progression Requirements

Each implementation must follow **ATOMIC PROGRESSION** - taking the smallest possible meaningful steps:

- **Micro-Step Protocol**: IMPLEMENT → VERIFY → TEST → CONFIRM → COMPLETE → NEXT for each **individual component**
- **Granular Implementation**: Break every unit into the smallest implementable pieces:
  - Single function per step
  - Single API route per step
  - Single component per step
  - Single test case per step
- **Sequential Development**: Never implement multiple related items simultaneously, even within the same logical unit
- **Step-by-Step Example**: For a unit requiring 5 API routes:
  1. Implement ONE route completely (code + tests + verification)
  2. Confirm it works perfectly in isolation
  3. Only then proceed to the next route
- **Continuous Validation**: After each micro-step, run tests and verify functionality before proceeding
- **Time Constraint**: Each implementation step should take only a few minutes and produce immediately testable results
- **Completion Standard**: A micro-step is complete only when fully tested, verified, and confirmed working independently
- **Code Review Protocol**: Before any git operations, conduct comprehensive code review and cleanup (remove dead code, fix bugs, eliminate redundancies, improve quality, verify security) as detailed in [Development Protocols](../memory-bank/development-protocols.md)

### Complex Task Management

- **Multi-step tasks**: For complex implementations, use structured progress tracking
- **Clear milestones**: Break down large features into clear, measurable milestones
- **Validation checkpoints**: Verify each major step before proceeding to the next
- **Quality gates**: Always check for code problems before considering any task complete

## Portfolio Project Modularity Guidelines (MANDATORY)

### Component Architecture Principles

#### 1. Atomic Design Hierarchy
- **Atoms**: Base UI elements (buttons, inputs, typography, icons)
- **Molecules**: Simple combinations of atoms (form fields, navigation items)
- **Organisms**: Complex UI sections (headers, portfolio cards, blog post previews)
- **Templates**: Page-level layouts without specific content
- **Pages**: Complete views with real content

#### 2. Mandatory Reusable Components
All implementations MUST use these standardized, reusable components:

**Base UI Components (Atoms)**:
- `BaseButton` - Single button component with variants (primary, secondary, ghost, etc.)
- `BaseInput` - Standardized input with consistent styling and validation
- `BaseCard` - Portfolio/blog card foundation with consistent spacing
- `BaseTypography` - Heading, paragraph, and text components with design system
- `BaseIcon` - Icon wrapper ensuring consistent sizing and styling
- `BaseSkeleton` - Loading skeleton with consistent animations
- `BaseAvatar` - Profile image component with fallbacks

**Layout Components (Molecules)**:
- `LayoutHeader` - Navigation header with responsive behavior
- `LayoutFooter` - Site footer with consistent structure
- `LayoutSidebar` - Sidebar navigation for admin/dashboard areas
- `LayoutContainer` - Page container with consistent max-widths and padding
- `LayoutSection` - Content section wrapper with proper spacing

**Content Components (Organisms)**:
- `PortfolioCard` - Project showcase card with consistent structure
- `BlogPostCard` - Blog post preview with standardized layout
- `ContactForm` - Reusable contact form with validation
- `NewsletterSignup` - Email subscription component
- `SkillsDisplay` - Skills visualization component

#### 3. Component Creation Rules

**Before creating ANY component, you MUST:**
1. Check if a similar component already exists
2. Determine if existing component can be extended with props/variants
3. If new component needed, ensure it follows atomic design principles
4. Create with maximum reusability in mind

**Component Structure Template:**
```typescript
/**
 * [Component Name] - [Brief description of purpose]
 * 
 * @param {Object} props - Component properties
 * @param {string} [variant='default'] - Visual variant
 * @param {string} [size='medium'] - Size variant  
 * @param {boolean} [disabled=false] - Disabled state
 * @param {ReactNode} children - Child elements
 * @param {string} [className] - Additional CSS classes
 * @returns {JSX.Element} Rendered component
 * 
 * @example
 * <BaseButton variant="primary" size="large">
 *   Click me
 * </BaseButton>
 */
interface ComponentProps {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function ComponentName({ 
  variant = 'default', 
  size = 'medium',
  disabled = false,
  children,
  className,
  ...props 
}: ComponentProps) {
  return (
    <element 
      className={cn(
        'base-styles',
        variantStyles[variant],
        sizeStyles[size],
        { 'disabled-styles': disabled },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </element>
  );
}
```

### Folder Structure Enforcement

#### Next.js App Router Structure (MANDATORY)
```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Admin route group
│   ├── (marketing)/             # Public pages route group
│   ├── blog/                    # Blog section
│   ├── portfolio/               # Portfolio section
│   ├── api/                     # API routes
│   ├── globals.css              # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                  # Reusable components
│   ├── ui/                     # Base UI components (atoms)
│   │   ├── button.tsx          # BaseButton component
│   │   ├── input.tsx           # BaseInput component
│   │   ├── card.tsx            # BaseCard component
│   │   ├── typography.tsx      # BaseTypography component
│   │   ├── skeleton.tsx        # BaseSkeleton component
│   │   └── index.ts            # Export barrel
│   ├── layout/                 # Layout components (molecules)
│   │   ├── header.tsx          # LayoutHeader
│   │   ├── footer.tsx          # LayoutFooter
│   │   ├── sidebar.tsx         # LayoutSidebar
│   │   ├── container.tsx       # LayoutContainer
│   │   └── index.ts            # Export barrel
│   ├── portfolio/              # Portfolio-specific organisms
│   │   ├── portfolio-card.tsx  # PortfolioCard
│   │   ├── portfolio-grid.tsx  # PortfolioGrid
│   │   ├── portfolio-filter.tsx # PortfolioFilter
│   │   └── index.ts            # Export barrel
│   ├── blog/                   # Blog-specific organisms
│   │   ├── blog-card.tsx       # BlogPostCard
│   │   ├── blog-list.tsx       # BlogList
│   │   ├── blog-search.tsx     # BlogSearch
│   │   └── index.ts            # Export barrel
│   └── forms/                  # Form components
│       ├── contact-form.tsx    # ContactForm
│       ├── newsletter-form.tsx # NewsletterSignup
│       └── index.ts            # Export barrel
├── lib/                        # Utility functions
│   ├── utils.ts               # General utilities
│   ├── db.ts                  # Database utilities
│   ├── auth.ts               # Authentication utilities
│   ├── email.ts              # Email utilities
│   ├── validations.ts        # Zod schemas
│   └── constants.ts          # App constants
├── hooks/                     # Custom React hooks
│   ├── use-local-storage.ts  # Local storage hook
│   ├── use-debounce.ts       # Debounce hook
│   ├── use-portfolio.ts      # Portfolio data hook
│   └── index.ts              # Export barrel
├── types/                     # TypeScript definitions
│   ├── global.ts             # Global types
│   ├── portfolio.ts          # Portfolio types
│   ├── blog.ts               # Blog types
│   ├── user.ts               # User types
│   └── index.ts              # Export barrel
├── styles/                    # Style-related files
│   ├── globals.css           # Global CSS
│   ├── components.css        # Component-specific CSS
│   └── utilities.css         # Utility classes
└── config/                    # Configuration files
    ├── database.ts           # Database config
    ├── auth.ts              # Auth config
    ├── email.ts             # Email config
    └── site.ts              # Site configuration
```

#### File Naming Conventions (MANDATORY)
- **Components**: `kebab-case.tsx` (e.g., `portfolio-card.tsx`)
- **Hooks**: `use-kebab-case.ts` (e.g., `use-portfolio.ts`)
- **Utilities**: `kebab-case.ts` (e.g., `db-utils.ts`)
- **Types**: `kebab-case.ts` (e.g., `portfolio-types.ts`)
- **Pages**: `page.tsx` or `[dynamic].tsx`
- **Layouts**: `layout.tsx`
- **API Routes**: `route.ts`

### Design System Enforcement

#### 1. Color System (MANDATORY)
```typescript
// config/design-tokens.ts
export const colors = {
  primary: {
    50: '#f0f9f0',
    500: '#02720c', // Your brand green
    900: '#014006',
  },
  gray: {
    50: '#f9fafb',
    500: '#6b7280',
    900: '#111827',
  },
  // ... complete color palette
} as const;
```

#### 2. Typography Scale (MANDATORY)
```typescript
// components/ui/typography.tsx
export const typographyVariants = {
  h1: 'text-4xl font-bold leading-tight',
  h2: 'text-3xl font-bold leading-tight',
  h3: 'text-2xl font-semibold leading-tight',
  body: 'text-base leading-relaxed',
  caption: 'text-sm text-gray-600',
} as const;
```

#### 3. Spacing System (MANDATORY)
```typescript
// Use Tailwind's spacing scale consistently
export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  xxl: '4rem',     // 64px
} as const;
```

### Component Reusability Rules

#### 1. Props Interface Standards
- Always use TypeScript interfaces for props
- Include variant, size, and disabled props where applicable
- Support className prop for extensibility
- Use children prop for content composition
- Include proper JSDoc documentation

#### 2. Styling Standards
- Use Tailwind CSS classes exclusively
- Leverage `cn()` utility for conditional classes
- Create variant maps for consistent styling
- Never use inline styles or CSS modules
- Support dark mode from the start

#### 3. Accessibility Standards
- Include proper ARIA labels and roles
- Support keyboard navigation
- Ensure color contrast compliance
- Include screen reader text where needed
- Test with keyboard-only navigation

### Import/Export Standards

#### 1. Barrel Exports (MANDATORY)
Every component directory MUST include an `index.ts` file:
```typescript
// components/ui/index.ts
export { BaseButton } from './button';
export { BaseInput } from './input';
export { BaseCard } from './card';
export { BaseTypography } from './typography';
export { BaseSkeleton } from './skeleton';

// Re-export types
export type { ButtonProps } from './button';
export type { InputProps } from './input';
export type { CardProps } from './card';
```

#### 2. Import Organization (MANDATORY)
```typescript
// 1. React and Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party library imports
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 3. Internal UI components
import { BaseButton, BaseCard } from '@/components/ui';

// 4. Internal feature components
import { PortfolioCard } from '@/components/portfolio';

// 5. Hooks and utilities
import { usePortfolio } from '@/hooks';
import { cn } from '@/lib/utils';

// 6. Types
import type { Portfolio } from '@/types';
```

### Quality Gates for Modularity

Before any component implementation is considered complete, it MUST pass these checks:

1. **Reusability Check**: Can this component be used in at least 2 different contexts?
2. **Prop Interface Check**: Does it follow the standard prop interface pattern?
3. **Styling Check**: Uses only Tailwind classes and follows design system?
4. **Accessibility Check**: Includes proper ARIA attributes and keyboard support?
5. **Documentation Check**: Has complete JSDoc with examples?
6. **Export Check**: Properly exported through barrel exports?
7. **Type Safety Check**: Full TypeScript support with no 'any' types?

### Component Development Protocol

For EVERY component creation/modification:

1. **ANALYZE**: Determine if existing component can be extended
2. **DESIGN**: Plan component API and variants before coding
3. **IMPLEMENT**: Follow atomic design and reusability principles
4. **DOCUMENT**: Add complete JSDoc with usage examples
5. **TEST**: Verify component works in isolation and in context
6. **EXPORT**: Add to appropriate barrel export file
7. **VALIDATE**: Run through modularity quality gates

This protocol ensures every component contributes to a cohesive, reusable design system rather than creating one-off implementations.

## Git Workflow Protocol (MANDATORY)

### Protocol Triggers
When user says any of these phrases, immediately execute the Git workflow protocol:
- "start git protocol"
- "begin git protocol"
- "initiate git workflow"
- "execute git protocol"
- "run git workflow"
- "git protocol"

### Automated Git Workflow Execution
When triggered, execute these steps in sequence:

1. **Checkout Master Branch**
   ```bash
   git checkout master
   ```

2. **Fetch and Update Master**
   ```bash
   git fetch origin
   git pull origin master
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b [auto-generated-branch-name]
   ```
   - Branch naming: `feature/brief-description-of-changes`
   - Examples: `feature/navigation-mobile-fixes`, `feature/hero-section-improvements`

4. **Stage Modified Files**
   ```bash
   git add [list-of-changed-files]
   ```
   - Only stage files that were actually modified in current session
   - Check git status to identify changed files

5. **Create Descriptive Commit**
   ```bash
   git commit -m "[type]: [concise description]

   [detailed explanation]

   - [specific change 1]
   - [specific change 2]
   - [specific change 3]"
   ```

### Commit Message Standards
- **Types**: feat, fix, style, refactor, docs, perf, test, chore
- **Format**: `[type]: [description under 50 chars]`
- **Body**: Detailed explanation with bullet points of specific changes
- **Examples**:
  - `feat: implement mobile navigation with collapsible menu`
  - `fix: resolve scroll highlighting and responsive issues`
  - `style: improve hero section contrast and spacing`

### Branch Naming Conventions
- Feature: `feature/navigation-improvements`
- Bug fix: `fix/mobile-menu-toggle`
- Style: `style/hero-section-redesign`
- Docs: `docs/readme-updates`

### Error Handling
- If any step fails, stop execution and report specific error
- Provide clear guidance for manual resolution
- Ensure no partial commits or corrupted state

### Safety Checks
- Verify correct repository location
- Check for uncommitted changes that might be lost
- Confirm remote connectivity
- Validate branch naming conventions

**Reference**: See `docs/git-workflow-protocol.md` for complete protocol documentation.

## Communication Standards
