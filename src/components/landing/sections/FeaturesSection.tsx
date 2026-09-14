import { features, featuredFeatures } from '@/data/features'
import { Section, SectionHeader, Card } from '../shared'

export function FeaturesSection() {
  const rest = features.filter((f) => !f.featured)

  return (
    <Section id="features">
      <SectionHeader
        label="Features"
        title="Everything you need"
        description="Track expenses, record income, organize wallets, set limits, and build savings — all from one place."
        center
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {featuredFeatures.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} className="border-violet-500/15 bg-violet-500/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
            </Card>
          )
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title} className="flex gap-4 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-violet-400">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{feature.description}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
