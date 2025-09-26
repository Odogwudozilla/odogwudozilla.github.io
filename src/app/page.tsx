import { BaseTypography, BaseButton, BaseCard, BaseCardHeader, BaseCardTitle, BaseCardDescription } from '@/components/ui'

/**
 * Homepage - Main landing page showcasing portfolio overview
 *
 * @returns Homepage component with hero section and portfolio preview
 */
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
        <BaseTypography variant="h1" className="max-w-4xl">
          Software Engineer Building Modern Web Applications
        </BaseTypography>

        <BaseTypography variant="lead" className="max-w-2xl">
          Specializing in enterprise software development, insurance technology,
          and full-stack web applications with a focus on performance and user experience.
        </BaseTypography>

        <div className="flex gap-4 mt-8">
          <BaseButton size="lg">
            View My Work
          </BaseButton>
          <BaseButton variant="outline" size="lg">
            Contact Me
          </BaseButton>
        </div>
      </section>

      {/* Quick Overview Section */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <BaseCard>
          <BaseCardHeader>
            <BaseCardTitle>Experience</BaseCardTitle>
            <BaseCardDescription>
              Software Engineer at Keylane with expertise in enterprise applications
            </BaseCardDescription>
          </BaseCardHeader>
        </BaseCard>

        <BaseCard>
          <BaseCardHeader>
            <BaseCardTitle>Specialization</BaseCardTitle>
            <BaseCardDescription>
              Full-stack development with TypeScript, React, Next.js, and cloud technologies
            </BaseCardDescription>
          </BaseCardHeader>
        </BaseCard>

        <BaseCard>
          <BaseCardHeader>
            <BaseCardTitle>Passion</BaseCardTitle>
            <BaseCardDescription>
              Clean code, performance optimization, and collaborative development practices
            </BaseCardDescription>
          </BaseCardHeader>
        </BaseCard>
      </section>
    </div>
  )
}
