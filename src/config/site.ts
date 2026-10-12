import type { NavigationItem } from '@/types/navigation'

/**
 * Site configuration including navigation, metadata, and constants
 */
export const siteConfig = {
  name: 'Chidozie Nnachor',
  title: 'Chidozie Nnachor - Senior Software Engineer',
  description: 'Senior Software Engineer specialising in mature Java systems, API modernisation, and insurance technology. Explore my professional work and personal projects.',
  url: 'https://odogwudozilla.com',

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
    linkedin: 'https://www.linkedin.com/in/chidoziennachor/',
    github: 'https://github.com/Odogwudozilla',
    email: 'odogwu.naija@gmail.com',
  },

  // Contact information
  contact: {
    email: 'odogwu.naija@gmail.com',
    location: 'Netherlands',
  },
} as const

export type SiteConfig = typeof siteConfig
