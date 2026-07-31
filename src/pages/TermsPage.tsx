import { SiteShell } from '@/components/landing/SiteShell'

export function TermsPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-16">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: July 30, 2026</p>
        <div className="mt-8 space-y-5 leading-relaxed text-slate-600">
          <p>
            By using yetiwize.com or the YetiWize app, you agree to these terms. The service is for
            informational personal finance use—not financial, tax, or investment advice.
          </p>
          <p>
            You are responsible for your account and data accuracy. Do not misuse the service. Paid
            plans will show clear pricing at purchase.
          </p>
          <p>
            Questions?{' '}
            <a className="font-medium text-sky-600 hover:underline" href="mailto:hello@yetiwize.com">
              hello@yetiwize.com
            </a>
          </p>
        </div>
      </article>
    </SiteShell>
  )
}
