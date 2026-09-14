import { highlights } from '@/data/landing'
import { Section, SectionHeader, Card } from '../shared'

export function HighlightsSection() {
  return (
    <Section id="highlights" tinted>
      <SectionHeader
        label="Why YetiWize"
        title="Simple money management"
        description="Everything you need to stay on top of your finances — nothing you don't."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {highlights.map((item) => (
          <Card key={item.title} className="flex flex-col">
            <div className="mb-4 flex h-28 items-end">
              <img
                src={item.image}
                alt=""
                className="h-24 w-24 object-contain"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{item.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
