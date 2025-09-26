import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LayoutHeader } from '@/components/layout'
import { siteConfig } from '@/config/site'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Software Engineer',
    'Full Stack Developer',
    'TypeScript',
    'React',
    'Next.js',
    'Portfolio',
    'Web Development'
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/**
 * Root Layout - Application shell with navigation header and global styles
 *
 * @param children - Page content to render
 * @returns Root HTML structure with navigation
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <LayoutHeader
            variant="sticky"
            navigationItems={siteConfig.navigationItems}
            showLogo={true}
          />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
