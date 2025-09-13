# Technical Architecture - Portfolio Migration

*Last Updated: September 13, 2025*

## Architecture Overview

### Migration Strategy: Static to Modern Full-Stack
**Current State**: Static HTML/CSS/Bootstrap site on GitHub Pages  
**Target State**: Modern Next.js application with full-stack capabilities on Vercel

### Technology Stack

#### Frontend Framework
- **Next.js 14+** with App Router
  - Client-side rendering for interactive components
  - Static site generation for performance
  - Server-side rendering for SEO-critical pages
  - Built-in optimization and performance features

#### Styling & Design System
- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **ShadCN UI** - High-quality, accessible React components
  - Pre-built components with consistent design language
  - Customizable with CSS variables and Tailwind
  - TypeScript-first approach for type safety

#### Backend & API
- **Next.js API Routes** for serverless functions
- **tRPC** (consideration) - End-to-end typesafe APIs
- **Prisma** - Database ORM with type safety
- **Zod** - Schema validation for API endpoints

#### Database
- **Supabase**
  - PostgreSQL database with real-time subscriptions
  - Built-in authentication and authorization
  - Row Level Security (RLS) for data protection
  - File storage for images and documents

#### Authentication
- **Supabase Auth** (Primary choice)
  - Email/password authentication
  - OAuth providers (GitHub, Google, LinkedIn)
  - JWT-based session management
- **Clerk** (Alternative consideration)
  - Drop-in authentication with UI components
  - Advanced user management features

#### Email Services
- **Resend** - Transactional email service
  - Contact form submissions
  - Newsletter communications
  - System notifications

#### Payments (Future)
- **Stripe** - Payment processing for premium features
  - Subscription management
  - One-time payments for services
  - Comprehensive financial reporting

#### Deployment & Hosting
- **Vercel** - Serverless deployment platform
  - Native Next.js optimization
  - Global CDN for fast content delivery
  - Preview deployments for development
  - Built-in analytics and performance monitoring

## Modular Architecture Principles

### Component Hierarchy (Atomic Design)

#### Atoms (Base UI Elements)
```typescript
components/ui/
├── button.tsx          // BaseButton with variants
├── input.tsx           // BaseInput with validation
├── card.tsx            // BaseCard for content containers
├── typography.tsx      // BaseTypography for text elements
├── skeleton.tsx        // BaseSkeleton for loading states
├── avatar.tsx          // BaseAvatar for profile images
└── icon.tsx            // BaseIcon with consistent sizing
```

#### Molecules (Simple Combinations)
```typescript
components/layout/
├── header.tsx          // LayoutHeader with navigation
├── footer.tsx          // LayoutFooter with links
├── sidebar.tsx         // LayoutSidebar for admin areas
├── container.tsx       // LayoutContainer with responsive width
└── section.tsx         // LayoutSection with proper spacing
```

#### Organisms (Complex UI Sections)
```typescript
components/portfolio/
├── portfolio-card.tsx  // PortfolioCard for project showcase
├── portfolio-grid.tsx  // PortfolioGrid for project listing
└── portfolio-filter.tsx // PortfolioFilter for categorization

components/blog/
├── blog-card.tsx       // BlogPostCard for article previews
├── blog-list.tsx       // BlogList for article listing
└── blog-search.tsx     // BlogSearch for content discovery

components/forms/
├── contact-form.tsx    // ContactForm with validation
└── newsletter-form.tsx // NewsletterSignup for email collection
```

### Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/             # Public pages route group
│   │   ├── page.tsx             # Homepage
│   │   ├── about/               # About page
│   │   └── contact/             # Contact page
│   ├── blog/                    # Blog section
│   │   ├── page.tsx             # Blog listing
│   │   ├── [slug]/              # Individual blog posts
│   │   └── category/            # Blog categories
│   ├── portfolio/               # Portfolio section
│   │   ├── page.tsx             # Portfolio listing
│   │   └── [project]/           # Individual projects
│   ├── api/                     # API routes
│   │   ├── contact/             # Contact form handler
│   │   ├── newsletter/          # Newsletter subscription
│   │   └── auth/                # Authentication endpoints
│   ├── globals.css              # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                  # Reusable components
├── lib/                        # Utility functions
│   ├── utils.ts               # General utilities
│   ├── db.ts                  # Database utilities
│   ├── auth.ts               # Authentication utilities
│   ├── email.ts              # Email utilities
│   ├── validations.ts        # Zod schemas
│   └── constants.ts          # App constants
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript definitions
├── styles/                    # Style-related files
└── config/                    # Configuration files
```

## Data Architecture

### Database Schema (Supabase/PostgreSQL)

#### Core Tables
```sql
-- Users table (managed by Supabase Auth)
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts
blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  published BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio projects
portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  github_url TEXT,
  live_url TEXT,
  featured_image TEXT,
  gallery_images TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact form submissions
contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Newsletter subscriptions
newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP
);
```

## Security Architecture

### Authentication & Authorization
- **JWT-based authentication** via Supabase
- **Row Level Security (RLS)** for data protection
- **API route protection** with middleware
- **CSRF protection** for form submissions

### Data Protection
- **Input validation** using Zod schemas
- **SQL injection prevention** via Prisma ORM
- **XSS protection** with proper sanitization
- **Rate limiting** on API endpoints

### Privacy Compliance
- **GDPR compliance** for EU users
- **Cookie consent** management
- **Data retention policies**
- **User data export/deletion** capabilities

## Performance Architecture

### Optimization Strategies
- **Static Site Generation (SSG)** for content pages
- **Incremental Static Regeneration (ISR)** for dynamic content
- **Image optimization** with Next.js Image component
- **Code splitting** and lazy loading
- **CDN caching** via Vercel Edge Network

### Monitoring & Analytics
- **Vercel Analytics** for performance metrics
- **Google Analytics 4** for user behavior
- **Sentry** for error tracking
- **Uptime monitoring** for availability

## Migration Plan

### Phase 1: Foundation (Weeks 1-2)
1. Set up Next.js project with TypeScript
2. Implement design system with Tailwind + ShadCN
3. Create base component library
4. Set up Vercel deployment pipeline

### Phase 2: Core Features (Weeks 3-4)
1. Migrate existing content to new structure
2. Implement responsive navigation
3. Create portfolio and experience sections
4. Add contact form functionality

### Phase 3: Enhanced Features (Weeks 5-6)
1. Implement blog functionality
2. Add newsletter subscription
3. Integrate analytics and monitoring
4. Performance optimization

### Phase 4: Advanced Features (Weeks 7-8)
1. Add authentication for admin features
2. Implement content management interface
3. Add search functionality
4. SEO optimization and sitemap generation

## Risk Mitigation

### Technical Risks
- **Gradual migration** to minimize disruption
- **Feature flags** for controlled rollouts
- **Automated testing** for regression prevention
- **Rollback strategy** for failed deployments

### Performance Risks
- **Performance budgets** and monitoring
- **Progressive enhancement** approach
- **Fallback strategies** for failed features
- **Regular performance audits**
