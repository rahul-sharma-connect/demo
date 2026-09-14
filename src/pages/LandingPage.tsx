import { SiteShell } from '@/components/landing/SiteShell'
import { AmbientGlow } from '@/components/landing/shared'
import { HeroSection } from '@/components/landing/sections/HeroSection'
import { HighlightsSection } from '@/components/landing/sections/HighlightsSection'
import { FeaturesSection } from '@/components/landing/sections/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/sections/HowItWorksSection'
import { AboutSection } from '@/components/landing/sections/AboutSection'
import { FaqSection } from '@/components/landing/sections/FaqSection'
import { CtaSection } from '@/components/landing/sections/CtaSection'

export function LandingPage() {
  return (
    <SiteShell>
      <AmbientGlow />
      <HeroSection />
      <HighlightsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <FaqSection />
      <CtaSection />
    </SiteShell>
  )
}
