import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '@/data/landing'
import { SITE } from '@/utils/seo'
import { Section, SectionHeader, Card } from '../shared'
import { cn } from '@/utils/cn'

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq" tinted>
      <SectionHeader
        label="FAQ"
        title="Common questions"
        description={`Reach us at ${SITE.email} if you need anything else.`}
        center
      />
      <div className="mx-auto mt-12 max-w-2xl space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i
          return (
            <Card key={faq.q} className={cn('p-0 overflow-hidden', isOpen && 'border-violet-500/20')}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 p-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0 text-violet-400 transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
              {isOpen ? (
                <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{faq.a}</p>
              ) : null}
            </Card>
          )
        })}
      </div>
    </Section>
  )
}
