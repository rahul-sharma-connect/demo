import { useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Bell } from 'lucide-react'
import { Logo } from '@/assets/logos/Logo'
import { SITE } from '@/utils/seo'
import { WishlistProvider, useWishlist } from '@/context/WishlistContext'
import { PageContainer } from './shared'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#about', label: 'About' },
  { href: '#faq', label: 'FAQ' },
] as const

function SiteNavInner() {
  const [open, setOpen] = useState(false)
  const { openWishlist } = useWishlist()

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-mist/90 backdrop-blur-md">
      <PageContainer wide className="flex h-16 items-center justify-between">
        <a href="#top" onClick={() => setOpen(false)}>
          <Logo compact />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => openWishlist()}
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            Join wishlist
          </button>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-400 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </PageContainer>

      {open ? (
        <nav className="border-t border-white/8 md:hidden" aria-label="Mobile">
          <PageContainer wide className="flex flex-col gap-1 py-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                openWishlist()
              }}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-violet-400"
            >
              Join wishlist
            </button>
          </PageContainer>
        </nav>
      ) : null}
    </header>
  )
}

export function SiteFooter() {
  const navigate = useNavigate()
  const [clicks, setClicks] = useState(0)
  const resetTimer = useRef<number | null>(null)

  function handleBrandClick() {
    if (resetTimer.current) window.clearTimeout(resetTimer.current)
    const next = clicks + 1
    if (next >= 5) {
      setClicks(0)
      navigate('/admin/login')
      return
    }
    setClicks(next)
    resetTimer.current = window.setTimeout(() => setClicks(0), 2500)
  }

  return (
    <footer className="border-t border-white/8 bg-[#08080c]/40">
      <PageContainer wide className="flex flex-col gap-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={handleBrandClick}
            className="font-semibold text-slate-300 select-none"
            aria-label="YetiWize"
          >
            YetiWize
          </button>
          <p className="mt-1">{SITE.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link to="/privacy" className="hover:text-slate-300">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-slate-300">
            Terms
          </Link>
          <a href={`mailto:${SITE.email}`} className="hover:text-slate-300">
            Contact
          </a>
        </div>
      </PageContainer>
    </footer>
  )
}

export function SiteNav() {
  return <SiteNavInner />
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <WishlistProvider>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-mist text-ink">
        <SiteNavInner />
        <main className="relative z-10 flex-1">{children}</main>
        <SiteFooter />
      </div>
    </WishlistProvider>
  )
}
