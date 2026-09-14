import { images } from '@/assets/images'
import { principles } from '@/data/landing'
import { SITE } from '@/utils/seo'
import { Section, SectionHeader, Card } from '../shared'

export function AboutSection() {
  return (
    <Section id="about">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader
            label="About"
            title="Not a bank. A money companion."
            description="YetiWize helps you manually understand and organize your finances through small daily actions."
          />
          <p className="mt-6 text-base leading-relaxed text-slate-400">
            Built for students, professionals, freelancers, and anyone who wants better control over
            personal spending. Offline-first on mobile.
          </p>
          <p className="mt-4 rounded-xl border border-violet-500/15 bg-violet-500/5 px-4 py-3 text-sm font-medium text-violet-200">
            {SITE.tagline}
          </p>
        </div>
        <Card className="flex items-center justify-center p-8">
          <img
            src={images.winner}
            alt="YetiWize mascot"
            className="max-h-56 w-full max-w-[240px] object-contain"
          />
        </Card>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="p-5">
              <Icon className="h-5 w-5 text-violet-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.description}</p>
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
