# Development Guide - Portfolio Project

*Last Updated: September 13, 2025*

## Development Workflow

### AI-Assisted Development Protocol
This project is designed to be developed primarily through AI assistance following strict modularity and reusability principles.

#### Core Development Rules
1. **Component-First Approach**: Every UI element must be a reusable component
2. **Atomic Design Enforcement**: Follow atoms → molecules → organisms → templates hierarchy
3. **TypeScript-First**: All code must be fully typed with no 'any' types
4. **Documentation-Driven**: Every component requires JSDoc with usage examples
5. **Test-Driven**: Components must include tests before being considered complete

### AI Assistant Instructions Reference
See `.github/copilot-instructions.md` for detailed coding standards and protocols that guide all development work.

## Environment Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- VS Code with recommended extensions
- Supabase CLI for database management

### Local Development Setup
```bash
# Clone and setup
git clone https://github.com/Odogwudozilla/odogwudozilla.github.io.git
cd odogwudozilla
npm install

# Environment configuration
cp .env.example .env.local
# Configure environment variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - RESEND_API_KEY

# Database setup
supabase start
supabase db reset

# Start development server
npm run dev
```

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prettier - Code Formatter
- ESLint
- Auto Rename Tag
- GitLens
- Thunder Client (for API testing)

## Code Organization

### Component Development Standards

#### File Naming Conventions
- Components: `kebab-case.tsx` (e.g., `portfolio-card.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-portfolio.ts`)
- Utilities: `kebab-case.ts` (e.g., `db-utils.ts`)
- Types: `kebab-case.ts` (e.g., `portfolio-types.ts`)

#### Component Template
```typescript
/**
 * [ComponentName] - Brief description of component purpose
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
 * <ComponentName variant="primary" size="large">
 *   Content here
 * </ComponentName>
 */
interface ComponentNameProps {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export function ComponentName({ 
  variant = 'default',
  size = 'medium',
  disabled = false,
  children,
  className,
  ...props 
}: ComponentNameProps) {
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

### Design System Implementation

#### Base Components (Atoms)
All base components must support:
- **Variants**: Different visual styles (primary, secondary, ghost, etc.)
- **Sizes**: Consistent sizing scale (small, medium, large)
- **States**: Disabled, loading, error states where applicable
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Dark Mode**: Built-in support for theme switching

#### Layout Components (Molecules)
- **Responsive Design**: Mobile-first approach with breakpoint consistency
- **Spacing System**: Use Tailwind spacing scale consistently
- **Grid System**: Flexible grid layouts with proper gutters
- **Container Widths**: Consistent max-widths across breakpoints

#### Feature Components (Organisms)
- **Data Integration**: Proper loading states and error handling
- **Performance**: Lazy loading and code splitting where applicable
- **SEO Optimization**: Proper meta tags and structured data
- **Analytics**: Event tracking for user interactions

## Testing Strategy

### Testing Pyramid
1. **Unit Tests**: Individual component functionality
2. **Integration Tests**: Component interactions and data flow
3. **E2E Tests**: Critical user journeys
4. **Visual Regression Tests**: UI consistency across changes

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **Storybook**: Component development and testing
- **Chromatic**: Visual regression testing

### Test Coverage Requirements
- **Components**: 90%+ test coverage
- **Utilities**: 100% test coverage
- **API Routes**: 95%+ test coverage
- **Critical Paths**: 100% E2E coverage

## Performance Standards

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### Performance Budget
- **Bundle Size**: < 250KB gzipped for initial load
- **Image Optimization**: WebP format with multiple resolutions
- **Font Loading**: Preload critical fonts, swap for non-critical
- **Third-party Scripts**: Minimal usage, lazy loading where possible

### Monitoring
- **Lighthouse CI**: Automated performance testing
- **Vercel Analytics**: Real user monitoring
- **Bundle Analyzer**: Regular bundle size analysis
- **Performance Profiling**: Chrome DevTools for optimization

## Security Guidelines

### Data Protection
- **Input Validation**: Zod schemas for all user inputs
- **Output Sanitization**: Prevent XSS with proper escaping
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **Rate Limiting**: Protect API endpoints from abuse

### Authentication Security
- **JWT Validation**: Proper token verification
- **Session Management**: Secure session handling
- **Password Security**: Strong password requirements
- **Multi-factor Authentication**: Support for 2FA

### Deployment Security
- **Environment Variables**: Secure secret management
- **HTTPS Enforcement**: SSL/TLS for all connections
- **Content Security Policy**: Prevent XSS attacks
- **Dependency Scanning**: Regular security audits

## Quality Assurance

### Code Review Process
1. **Automated Checks**: ESLint, Prettier, TypeScript compilation
2. **AI Review**: GitHub Copilot suggestions and improvements
3. **Manual Review**: Code quality and architecture review
4. **Testing Validation**: All tests passing before merge

### Quality Gates
- **No console.log**: Remove debugging statements
- **No dead code**: Clean up unused imports and variables
- **Type safety**: Full TypeScript coverage
- **Performance**: Meet Core Web Vitals requirements
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Meta tags and structured data

### Continuous Integration
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
      - run: npm run lighthouse-ci
```

## Deployment Workflow

### Vercel Deployment
- **Preview Deployments**: Automatic for all pull requests
- **Production Deployment**: Automatic on main branch merge
- **Environment Management**: Separate configs for preview/production
- **Domain Configuration**: Custom domain setup and SSL

### Database Migrations
- **Development**: Local Supabase instance
- **Staging**: Supabase staging project
- **Production**: Supabase production project with backups

### Rollback Strategy
- **Vercel Rollback**: Instant rollback to previous deployment
- **Database Rollback**: Migration rollback procedures
- **Content Rollback**: CMS content versioning

## Monitoring & Maintenance

### Performance Monitoring
- **Real User Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry integration
- **Uptime Monitoring**: StatusCake or similar
- **Database Performance**: Supabase metrics

### Content Management
- **Blog Content**: Markdown files with frontmatter
- **Portfolio Projects**: Database-driven with admin interface
- **Static Content**: Version controlled in repository
- **Media Assets**: Supabase storage with CDN

### Backup Strategy
- **Database Backups**: Daily automated backups
- **Code Repository**: Git with multiple remotes
- **Media Assets**: Redundant storage across regions
- **Configuration**: Environment variable documentation

## Troubleshooting Guide

### Common Issues
1. **Build Failures**: TypeScript errors, missing dependencies
2. **Performance Issues**: Large bundles, unoptimized images
3. **Database Issues**: Connection problems, migration failures
4. **Authentication Issues**: Token expiration, CORS problems

### Debug Tools
- **Next.js DevTools**: Built-in debugging features
- **React DevTools**: Component tree inspection
- **Network Tab**: API request debugging
- **Lighthouse**: Performance analysis
- **Supabase Logs**: Database query analysis

### Support Resources
- **Documentation**: This guide and inline code comments
- **Community**: Next.js, Tailwind, Supabase communities
- **AI Assistant**: GitHub Copilot for code assistance
- **Error Tracking**: Sentry for production issue resolution
