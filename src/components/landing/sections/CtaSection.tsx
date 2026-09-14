import { useWishlist } from '@/context/WishlistContext'
import { WishlistForm } from '../WishlistForm'
import { PageContainer, ComingSoonBadge, StoreBadge } from '../shared'

export function CtaSection() {
  const { openWishlist } = useWishlist()

  return (
    <section id="wishlist" className="scroll-mt-16 border-t border-white/6">
      <PageContainer wide className="pb-20 pt-16 sm:pb-24">
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-card p-8 sm:p-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
            <div>
              <ComingSoonBadge />
              <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
                Join the launch wishlist
              </h2>
              <p className="mt-3 max-w-lg text-slate-400">
                YetiWize is coming soon to iOS and Android. Leave your email and we&apos;ll notify you
                on launch day.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <StoreBadge platform="apple" onClick={() => openWishlist('ios')} />
                <StoreBadge platform="google" onClick={() => openWishlist('android')} />
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <WishlistForm variant="stacked" />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
