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
          Senior Software Engineer Building Reliable Systems
        </BaseTypography>

        <BaseTypography variant="lead" className="max-w-2xl">
          Mature Java systems, API modernisation, and insurance technology, supported by a background
          in banking and personal projects in web applications and data analysis.
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
              Enterprise insurance engineering at Keylane, spanning API modernisation,
              backwards compatibility, testing, and peer review.
            </BaseCardDescription>
          </BaseCardHeader>
        </BaseCard>

        <BaseCard>
          <BaseCardHeader>
            <BaseCardTitle>Focus</BaseCardTitle>
            <BaseCardDescription>
              Maintainable Java systems, clear business rules, and reliable service integrations.
            </BaseCardDescription>
          </BaseCardHeader>
        </BaseCard>

        <BaseCard>
          <BaseCardHeader>
            <BaseCardTitle>Approach</BaseCardTitle>
            <BaseCardDescription>
              Clear requirements, useful tests, and thoughtful collaboration with colleagues.
            </BaseCardDescription>
          </BaseCardHeader>
        </BaseCard>
      </section>
    </div>
  )
}
