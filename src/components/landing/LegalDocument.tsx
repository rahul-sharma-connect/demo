import { Link } from 'react-router-dom'
import { SiteShell } from '@/components/landing/SiteShell'
import { PageContainer } from '@/components/landing/shared'
import { SITE } from '@/utils/seo'

export type LegalSection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

function renderText(text: string) {
  const email = SITE.email
  const parts = text.split(email)
  if (parts.length === 1) return text
  return parts.flatMap((part, i) =>
    i < parts.length - 1
      ? [
          part,
          <a key={i} href={`mailto:${email}`} className="text-violet-400 hover:underline">
            {email}
          </a>,
        ]
      : [part],
  )
}

function LegalBody({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-base font-semibold text-white">{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-slate-400">
              {renderText(paragraph)}
            </p>
          ))}
          {section.bullets ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400">
              {section.bullets.map((item) => (
                <li key={item}>{renderText(item)}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  )
}

export function LegalDocument({
  title,
  effectiveDate,
  lastUpdated,
  intro,
  sections,
}: {
  title: string
  effectiveDate: string
  lastUpdated: string
  intro: string[]
  sections: LegalSection[]
}) {
  return (
    <SiteShell>
      <PageContainer className="py-12 sm:py-16">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-300">
          ← Back to home
        </Link>

        <header className="mt-8 max-w-3xl border-b border-white/8 pb-8">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-slate-500">
            Effective date: {effectiveDate} · Last updated: {lastUpdated}
          </p>
          <div className="mt-6 space-y-3 text-sm leading-relaxed text-slate-400">
            {intro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{renderText(paragraph)}</p>
            ))}
          </div>
        </header>

        <article className="mt-10 max-w-3xl">
          <LegalBody sections={sections} />
        </article>

        <p className="mt-12 max-w-3xl text-xs leading-relaxed text-slate-500">
          This document is a practical developer-facing draft and is not a substitute for advice
          from a qualified lawyer for your specific business or jurisdiction.
        </p>
      </PageContainer>
    </SiteShell>
  )
}
