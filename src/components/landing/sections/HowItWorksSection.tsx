import { howItWorks } from '@/data/landing'
import { SITE } from '@/utils/seo'
import { Section, SectionHeader, Card } from '../shared'

export function HowItWorksSection() {
  return (
    <Section id="how" tinted>
      <SectionHeader
        label="How it works"
        title="Three simple steps"
        description={SITE.tagline}
        center
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {howItWorks.map((step) => (
          <Card key={step.step} className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center">
              <img src={step.image} alt="" className="h-16 w-16 object-contain" aria-hidden="true" />
            </div>
            <p className="mt-4 text-xs font-bold tracking-widest text-violet-400">{step.step}</p>
            <h3 className="mt-2 font-display text-lg font-bold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
