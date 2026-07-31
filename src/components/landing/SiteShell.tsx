import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/assets/logos/Logo'
import { SITE } from '@/utils/seo'
import { NoiseOverlay } from '@/components/landing/NoiseOverlay'

const links = [
  { href: '#top', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#platforms', label: 'Platforms' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
] as const

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login?mode=register"
            className="ml-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            Sign up
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/login?mode=register"
            className="rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-white"
          >
            Sign up
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sky-100/80 bg-white/70 text-ink"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="border-t border-sky-100/80 bg-white/90 px-5 py-4 backdrop-blur-xl lg:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login?mode=register"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-primary"
            >
              Sign up
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-sky-100/80 bg-white/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-slate-400 sm:flex-row sm:px-8">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-slate-600">YetiWize</p>
          <p className="mt-1">{SITE.tagline}</p>
          <p className="mt-2">© {new Date().getFullYear()} YetiWize · Coming soon</p>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          <a href="#features" className="hover:text-sky-600">
            Features
          </a>
          <a href="#platforms" className="hover:text-sky-600">
            Platforms
          </a>
          <Link to="/privacy" className="hover:text-sky-600">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-sky-600">
            Terms
          </Link>
          <a href={`mailto:${SITE.email}`} className="hover:text-sky-600">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-mist text-ink">
      <NoiseOverlay />
      <SiteNav />
      <main className="relative z-10 flex-1 pt-16">{children}</main>
      <SiteFooter />
    </div>
  )
}
