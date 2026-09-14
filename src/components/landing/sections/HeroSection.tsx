import { ArrowRight, Bell } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import { SITE } from '@/utils/seo'
import { PageContainer, ComingSoonBadge, StoreBadge } from '../shared'

export function HeroSection() {
  const { openWishlist } = useWishlist()
  return (
    <section id="top" className="relative scroll-mt-16">
      <PageContainer wide className="py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <ComingSoonBadge />
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-white">Yeti</span>
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Wize
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-300">{SITE.tagline}</p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400">
              A personal expense tracker for recording income, managing wallets, controlling spending,
              and saving toward goals — without banking jargon or complicated charts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openWishlist()}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                Join wishlist
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-card px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-surface"
              >
                Explore features
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <StoreBadge platform="apple" onClick={() => openWishlist('ios')} />
              <StoreBadge platform="google" onClick={() => openWishlist('android')} />
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 rounded-full bg-violet-600/15 blur-3xl" aria-hidden="true" />
            <img
              src="/hero-phones.png"
              alt="YetiWize app preview"
              className="relative w-full max-w-md object-contain"
            />
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
