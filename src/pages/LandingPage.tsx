import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { images } from '@/assets/images'
import { features } from '@/data/features'
import {
  faqs,
  highlights,
  howItWorks,
  platforms,
  principles,
} from '@/data/landing'
import { SITE } from '@/utils/seo'
import { SiteShell } from '@/components/landing/SiteShell'
import googlePlayIcon from '@/assets/icons/google-play.svg'

const ease = [0.22, 1, 0.36, 1] as const

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <img src={googlePlayIcon} alt="" aria-hidden="true" className={className} />
  )
}

function BlurField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-24 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-sky-300/45 blur-[110px]" />
      <div className="absolute top-[12%] -left-28 h-[360px] w-[360px] rounded-full bg-blue-400/30 blur-[110px]" />
      <div className="absolute top-[22%] -right-24 h-[400px] w-[400px] rounded-full bg-cyan-300/35 blur-[120px]" />
      <div className="absolute top-[48%] left-[8%] h-[320px] w-[320px] rounded-full bg-indigo-300/25 blur-[100px]" />
      <div className="absolute top-[68%] right-[6%] h-[340px] w-[340px] rounded-full bg-sky-200/50 blur-[110px]" />
      <div className="absolute bottom-0 left-1/2 h-[300px] w-[560px] -translate-x-1/2 rounded-full bg-blue-200/35 blur-[90px]" />
    </div>
  )
}

function ComingSoonPill({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase shadow-sm backdrop-blur-xl ${
        light
          ? 'border border-white/30 bg-white/15 text-white'
          : 'border border-white/80 bg-white/65 text-sky-700'
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${
            light ? 'bg-white' : 'bg-sky-400'
          }`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            light ? 'bg-white' : 'bg-sky-500'
          }`}
        />
      </span>
      Coming Soon
    </span>
  )
}

function StoreBadge({ platform }: { platform: 'apple' | 'google' }) {
  const isApple = platform === 'apple'
  return (
    <div
      className="flex min-w-[168px] items-center gap-3 rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-[0_12px_40px_-18px_rgba(37,99,235,0.4)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/95"
      aria-label={isApple ? 'App Store — Coming soon' : 'Google Play — Coming soon'}
    >
      {isApple ? (
        <AppleIcon className="h-8 w-8 shrink-0 text-ink" />
      ) : (
        <PlayStoreIcon className="h-7 w-7 shrink-0" />
      )}
      <div className="text-left">
        <p className="text-[10px] font-medium tracking-[0.04em] text-slate-400 uppercase">
          Coming soon on
        </p>
        <p className="text-[15px] font-bold tracking-tight text-ink">
          {isApple ? 'App Store' : 'Google Play'}
        </p>
      </div>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease }}
      className="mx-auto max-w-2xl text-center"
    >
      <p className="text-xs font-semibold tracking-[0.16em] text-sky-600 uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-slate-500">{description}</p>
      ) : null}
    </motion.div>
  )
}

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string
  answer: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-sky-100/90 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-ink">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-sky-600 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-slate-500">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <SiteShell>
      <BlurField />

      {/* Hero — brand + one message + CTAs + mascot */}
      <section id="top" className="relative scroll-mt-20">
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-10">
          <div className="relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <ComingSoonPill />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
              className="mt-6 font-display text-5xl font-extrabold tracking-tight text-ink sm:text-6xl lg:text-[4.5rem] lg:leading-[1.05]"
            >
              Yeti
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                Wize
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14, ease }}
              className="mt-4 text-xl font-semibold text-slate-600 sm:text-2xl"
            >
              {SITE.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease }}
              className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-500 lg:mx-0"
            >
              Your fluffy finance buddy for tracking, budgeting, and calm AI insights.
              Mobile apps launch soon—web early access is open now.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <StoreBadge platform="apple" />
              <StoreBadge platform="google" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36, ease }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(37,99,235,0.7)] transition hover:bg-primary-dark"
              >
                Get early access
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center rounded-full border border-sky-200/80 bg-white/60 px-5 py-2.5 text-sm font-semibold text-sky-700 backdrop-blur-xl transition hover:bg-white"
              >
                Explore features
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease }}
            className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none"
          >
            <div
              className="absolute inset-[8%] rounded-full bg-gradient-to-br from-sky-300/50 via-blue-300/30 to-cyan-200/40 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative aspect-square w-full max-w-[420px]">
              <motion.img
                src={images.splashIcon}
                alt="YetiWize mascot"
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(37,99,235,0.25)]"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section id="highlights" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Why YetiWize"
            title="Money clarity without the guilt"
            description="A calm companion for everyday spending, savings, and shared balances."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/55 p-6 shadow-[0_16px_48px_-28px_rgba(14,165,233,0.45)] backdrop-blur-xl"
              >
                <div className="mb-5 flex h-24 items-end justify-center">
                  <img
                    src={item.image}
                    alt=""
                    className="h-24 w-24 object-contain transition duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* All features */}
      <section id="features" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need"
            description="Sixteen tools for tracking, budgeting, syncing, and understanding your money—on phone and web."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3), ease }}
                  className="rounded-2xl border border-white/70 bg-white/60 p-5 shadow-[0_8px_30px_-18px_rgba(14,165,233,0.35)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/80"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 text-sky-600 ring-1 ring-sky-100/80">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 text-[15px] font-bold text-ink">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="How it works"
            title="Three calm steps"
            description="From first open to full-picture clarity—without spreadsheets."
          />
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {howItWorks.map((step, i) => (
              <motion.article
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08, ease }}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 flex h-36 w-36 items-center justify-center">
                  <div className="absolute h-32 w-32 rounded-full bg-sky-200/40 blur-2xl" aria-hidden="true" />
                  <img
                    src={step.image}
                    alt=""
                    className="relative h-32 w-32 object-contain"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs font-bold tracking-[0.2em] text-sky-500">{step.step}</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold text-ink">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
                  {step.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Platforms"
            title="Mobile soon. Web ready."
            description="One YetiWize account across devices—offline-first on phone, full dashboard on desktop."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08, ease }}
                className="rounded-[2rem] border border-white/70 bg-white/55 p-7 shadow-[0_20px_50px_-30px_rgba(37,99,235,0.4)] backdrop-blur-xl sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-2xl font-extrabold text-ink">{platform.title}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${
                      platform.id === 'mobile'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {platform.badge}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{platform.subtitle}</p>
                <ul className="mt-7 space-y-4">
                  {platform.points.map((point) => {
                    const Icon = point.icon
                    return (
                      <li key={point.title} className="flex gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-ink">{point.title}</p>
                          <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                            {point.description}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                {platform.id === 'web' ? (
                  <Link
                    to="/login?mode=register"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    Create web account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <StoreBadge platform="apple" />
                    <StoreBadge platform="google" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About + principles */}
      <section id="about" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease }}
            className="relative mx-auto max-w-sm"
          >
            <div className="absolute inset-4 rounded-full bg-cyan-300/40 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/45 p-8 backdrop-blur-xl">
              <img
                src={images.winner}
                alt="YetiWize mascot celebrating a win"
                className="w-full object-contain"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease }}
          >
            <p className="text-xs font-semibold tracking-[0.16em] text-sky-600 uppercase">About</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Built for calm money habits
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              YetiWize is a personal finance companion for people who want clarity without the guilt.
              Offline-first on mobile, privacy-minded sync, soft AI insights, and a web dashboard for
              the big picture—launching soon on the App Store and Google Play.
            </p>
            <p className="mt-4 text-base font-semibold text-slate-600">{SITE.tagline}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {principles.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="rounded-2xl border border-sky-100/80 bg-white/50 p-4 backdrop-blur-xl">
                    <Icon className="h-5 w-5 text-sky-600" aria-hidden="true" />
                    <p className="mt-2 text-sm font-bold text-ink">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions before launch"
            description="Still curious? Reach us at hello@yetiwize.com."
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
            className="mt-12 rounded-[1.75rem] border border-white/70 bg-white/60 px-5 shadow-[0_16px_48px_-28px_rgba(14,165,233,0.4)] backdrop-blur-xl sm:px-8"
          >
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.q}
                question={faq.q}
                answer={faq.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="relative scroll-mt-24 px-5 pb-24 pt-8 sm:px-8 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 px-6 py-14 text-center text-white shadow-[0_30px_80px_-30px_rgba(37,99,235,0.65)] sm:px-12 sm:py-16"
        >
          <div
            className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-white/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-cyan-300/25 blur-3xl"
            aria-hidden="true"
          />
          <ComingSoonPill light />
          <h2 className="relative mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Be ready when YetiWize lands
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-sky-50/95">
            Create your cloud account today. When the apps launch on iOS and Android, you will
            already be synced and waiting.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-sky-50"
            >
              Sign up for early access
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              Contact us
            </a>
          </div>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3 opacity-95">
            <StoreBadge platform="apple" />
            <StoreBadge platform="google" />
          </div>
        </motion.div>
      </section>
    </SiteShell>
  )
}
