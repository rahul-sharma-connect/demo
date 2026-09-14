import { type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import googlePlayIcon from '@/assets/icons/google-play.svg'

export function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

export function PlayStoreIcon({ className }: { className?: string }) {
  return <img src={googlePlayIcon} alt="" aria-hidden="true" className={className} />
}

export function PageContainer({
  children,
  className,
  wide = false,
}: {
  children: ReactNode
  className?: string
  wide?: boolean
}) {
  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8', wide ? 'max-w-6xl' : 'max-w-5xl', className)}>
      {children}
    </div>
  )
}

export function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
    </div>
  )
}

export function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
      Coming soon
    </span>
  )
}

export function StoreBadge({
  platform,
  onClick,
}: {
  platform: 'apple' | 'google'
  onClick?: () => void
}) {
  const isApple = platform === 'apple'
  const className =
    'flex items-center gap-3 rounded-xl border border-white/10 bg-card px-4 py-3 text-left transition hover:border-violet-500/30 hover:bg-violet-500/5'

  const content = (
    <>
      {isApple ? (
        <AppleIcon className="h-6 w-6 shrink-0 text-white" />
      ) : (
        <PlayStoreIcon className="h-5 w-5 shrink-0" />
      )}
      <div>
        <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">Coming soon</p>
        <p className="text-sm font-semibold text-white">{isApple ? 'App Store' : 'Google Play'}</p>
        {onClick ? (
          <p className="mt-0.5 text-[11px] text-violet-400">Join wishlist →</p>
        ) : null}
      </div>
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    )
  }

  return <div className={className}>{content}</div>
}

export function Section({
  id,
  children,
  className,
  tinted = false,
}: {
  id: string
  children: ReactNode
  className?: string
  tinted?: boolean
}) {
  return (
    <section
      id={id}
      className={cn('relative scroll-mt-16 border-t border-white/6', tinted && 'bg-[#08080c]/60', className)}
    >
      <PageContainer wide className="py-16 sm:py-20">
        {children}
      </PageContainer>
    </section>
  )
}

export function SectionHeader({
  label,
  title,
  description,
  center = false,
}: {
  label: string
  title: string
  description?: string
  center?: boolean
}) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase">{label}</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-slate-400">{description}</p>
      ) : null}
    </div>
  )
}

export function Card({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/8 bg-card p-6 transition hover:border-white/12',
        className,
      )}
    >
      {children}
    </div>
  )
}
