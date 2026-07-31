import { Link } from 'react-router-dom'
import { Logo } from '@/assets/logos/Logo'
import { SiteShell } from '@/components/landing/SiteShell'

export function PrivacyPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-16">
        <Link to="/" className="sr-only">
          <Logo />
        </Link>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: July 30, 2026</p>
        <div className="mt-8 space-y-5 leading-relaxed text-slate-600">
          <p>
            YetiWize does not sell your personal financial data. When the app launches, account
            details and transactions you enter are used only to provide the service.
          </p>
          <p>
            Data is encrypted in transit. Offline-first keeps entries on your device until you sync.
            Request export or deletion at{' '}
            <a className="font-medium text-sky-600 hover:underline" href="mailto:hello@yetiwize.com">
              hello@yetiwize.com
            </a>
            .
          </p>
          <p>Waitlist emails are for launch updates only. Unsubscribe anytime.</p>
        </div>
      </article>
    </SiteShell>
  )
}
