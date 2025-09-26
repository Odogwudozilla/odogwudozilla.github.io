import type { NavigationItem } from '@/types/navigation'

/**
 * Site configuration including navigation, metadata, and constants
 */
export const siteConfig = {
  name: 'Chidozie Nnachor',
  title: 'Chidozie Nnachor - Software Engineer',
  description: 'Software Engineer specializing in enterprise applications and modern web technologies. Expert in TypeScript, React, Next.js, and cloud solutions.',
  url: 'https://chidozie-nnachor.vercel.app',

  // Main navigation items
  navigationItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Portfolio',
      href: '/portfolio',
    },
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Contact',
      href: '/contact',
    },
  ] as NavigationItem[],

  // Social links for future use
  social: {
    linkedin: 'https://linkedin.com/in/chidozie-nnachor',
    github: 'https://github.com/odogwudozilla',
    email: 'contact@chidozie-nnachor.dev',
  },

  // Contact information
  contact: {
    email: 'contact@chidozie-nnachor.dev',
    location: 'Netherlands',
  },
} as const

export type SiteConfig = typeof siteConfig
