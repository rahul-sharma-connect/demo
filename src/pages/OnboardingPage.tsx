import { useMemo, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  newId,
  savingAccountsApi,
  settingsApi,
  usersApi,
} from "@/api/client"
import { useAuth } from "@/auth/AuthContext"
import { images } from "@/assets/images"
import {
  ONBOARDING_CURRENCIES,
  ONBOARDING_STEPS,
  type OnboardingStepId,
} from "@/data/onboarding"

const ease = [0.22, 1, 0.36, 1] as const

const inputClass =
  "w-full rounded-2xl border-2 border-sky-200 bg-white px-4 py-3.5 text-[15px] font-medium text-ink outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"

type OnboardingPageProps = {
  onComplete: () => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { accessToken, user, refreshProfile } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName ?? "")
  const [currency, setCurrency] = useState("USD")
  const [balance, setBalance] = useState("")
  const [savings, setSavings] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps = useMemo(() => {
    // Name is collected at signup; only ask again if it's missing.
    if (user?.displayName?.trim()) {
      return ONBOARDING_STEPS.filter((s) => s !== "name")
    }
    return ONBOARDING_STEPS
  }, [user?.displayName])

  const [stepIndex, setStepIndex] = useState(0)
  const step = steps[stepIndex] as OnboardingStepId
  const progress = ((stepIndex + 1) / steps.length) * 100
  const currencyMeta = useMemo(
    () => ONBOARDING_CURRENCIES.find((c) => c.code === currency),
    [currency],
  )

  function canContinue() {
    if (step === "name") return displayName.trim().length > 0
    return true
  }

  function next() {
    if (!canContinue()) return
    setError(null)
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1)
    }
  }

  function back() {
    setError(null)
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  async function finish() {
    if (!accessToken) return
    setSubmitting(true)
    setError(null)
    try {
      const startingBalance = Number.parseFloat(balance) || 0
      const savingsBalance = Number.parseFloat(savings) || 0

      await usersApi.updateMe(accessToken, {
        displayName: displayName.trim() || null,
      })

      await settingsApi.patch(accessToken, {
        currency,
        language: "en",
        balance: startingBalance,
        onboardingCompleted: true,
      })

      const accounts = await savingAccountsApi.list(accessToken)
      const existingVault = accounts.find(
        (a) => a.name.toLowerCase() === "main vault",
      )
      if (!existingVault) {
        await savingAccountsApi.upsert(accessToken, newId(), {
          name: "Main Vault",
          balance: savingsBalance,
          goal: Math.max(savingsBalance * 2, 1000),
          icon: "piggy-bank",
          color: "#2563eb",
        })
      }

      await refreshProfile()
      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not finish setup")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-mist text-ink">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-[15%] h-[480px] w-[480px] rounded-full bg-sky-300/45 blur-[120px]" />
        <div className="absolute top-[25%] -left-16 h-[340px] w-[340px] rounded-full bg-blue-400/30 blur-[110px]" />
        <div className="absolute top-[20%] right-0 h-[400px] w-[400px] rounded-full bg-cyan-300/35 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-14">
        {/* Left — Yeti */}
        <div className="hidden flex-col items-start lg:flex">
          <div className="inline-flex items-center gap-2.5">
            <img
              src={images.icon}
              alt=""
              className="h-9 w-9 rounded-xl object-cover shadow-lg shadow-primary/20"
              aria-hidden="true"
            />
            <span className="font-display text-lg font-bold tracking-tight">
              Yeti
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                Wize
              </span>
            </span>
          </div>

          <div className="relative mt-10 flex w-full max-w-md items-center justify-center">
            <div
              className="absolute inset-[12%] rounded-full bg-sky-300/40 blur-3xl"
              aria-hidden="true"
            />
            <motion.img
              src={
                step === "finish"
                  ? images.winner
                  : step === "balances"
                    ? images.cash
                    : images.splashIcon
              }
              alt=""
              className="relative z-10 w-full max-w-[360px] object-contain drop-shadow-[0_30px_60px_rgba(37,99,235,0.28)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <p className="mt-6 max-w-sm text-lg font-semibold text-slate-600">
            A few quick steps so your money feels calm from day one.
          </p>
        </div>

        {/* Right — Steps card */}
        <div className="mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none lg:justify-self-end">
          <div className="mb-4 lg:hidden">
            <div className="inline-flex items-center gap-2.5">
              <img
                src={images.icon}
                alt=""
                className="h-8 w-8 rounded-xl object-cover"
                aria-hidden="true"
              />
              <span className="font-display text-base font-bold">YetiWize</span>
            </div>
          </div>

          <div className="min-h-[520px] rounded-[2.25rem] border border-white/80 bg-white/75 p-8 shadow-[0_28px_70px_-30px_rgba(37,99,235,0.5)] backdrop-blur-2xl sm:min-h-[560px] sm:p-10 lg:p-12">
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-slate-400 uppercase">
                <span>
                  Step {stepIndex + 1} of {steps.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sky-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.28, ease }}
              >
                {step === "welcome" && (
                  <StepShell
                    title="Welcome to YetiWize"
                    subtitle="Let’s set up your money space. Same account will sync with the mobile app when it launches."
                  >
                    <img
                      src={images.splashIcon}
                      alt=""
                      className="mx-auto h-28 w-28 object-contain lg:hidden"
                      aria-hidden="true"
                    />
                  </StepShell>
                )}

                {step === "name" && (
                  <StepShell
                    title="What should we call you?"
                    subtitle="This name appears on your dashboard and profile."
                  >
                    <input
                      className={inputClass}
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      autoFocus
                      autoComplete="name"
                    />
                  </StepShell>
                )}

                {step === "currency" && (
                  <StepShell
                    title="Pick your currency"
                    subtitle="You can change this later in Settings."
                  >
                    <div className="grid max-h-80 grid-cols-1 gap-2.5 overflow-y-auto pr-1">
                      {ONBOARDING_CURRENCIES.map((c) => {
                        const selected = currency === c.code
                        return (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => setCurrency(c.code)}
                            className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition ${
                              selected
                                ? "border-primary bg-primary-soft"
                                : "border-sky-100 bg-white hover:border-sky-200"
                            }`}
                          >
                            <span className="text-xl">{c.flag}</span>
                            <span className="flex-1">
                              <span className="block text-sm font-bold text-ink">
                                {c.code}
                              </span>
                              <span className="block text-xs text-slate-500">
                                {c.name}
                              </span>
                            </span>
                            <span className="text-sm font-semibold text-slate-500">
                              {c.symbol}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </StepShell>
                )}

                {step === "balances" && (
                  <StepShell
                    title="Your starting money"
                    subtitle="Set your available balance and optional Main Vault savings. Leave either at 0 if you prefer."
                  >
                    <div className="space-y-5">
                      <div>
                        <label
                          htmlFor="starting-balance"
                          className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-500 uppercase"
                        >
                          Current balance
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-semibold text-slate-400">
                            {currencyMeta?.symbol ?? "$"}
                          </span>
                          <input
                            id="starting-balance"
                            type="number"
                            min="0"
                            step="0.01"
                            className={`${inputClass} pl-10`}
                            placeholder="0"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            autoFocus
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="savings-balance"
                          className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-500 uppercase"
                        >
                          Savings (Main Vault)
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-semibold text-slate-400">
                            {currencyMeta?.symbol ?? "$"}
                          </span>
                          <input
                            id="savings-balance"
                            type="number"
                            min="0"
                            step="0.01"
                            className={`${inputClass} pl-10`}
                            placeholder="0"
                            value={savings}
                            onChange={(e) => setSavings(e.target.value)}
                          />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                          We’ll create a “Main Vault” savings account—same as the
                          mobile app.
                        </p>
                      </div>
                    </div>
                  </StepShell>
                )}

                {step === "finish" && (
                  <StepShell
                    title="You're all set"
                    subtitle="Your cloud account is ready. Open the dashboard and start tracking with calm clarity."
                  >
                    <ul className="space-y-2 rounded-2xl border-2 border-sky-100 bg-sky-50/50 px-4 py-3 text-sm text-slate-600">
                      <li>
                        <span className="font-semibold text-ink">Name:</span>{" "}
                        {displayName.trim() || "—"}
                      </li>
                      <li>
                        <span className="font-semibold text-ink">Currency:</span>{" "}
                        {currency}
                      </li>
                      <li>
                        <span className="font-semibold text-ink">Balance:</span>{" "}
                        {currencyMeta?.symbol}
                        {Number.parseFloat(balance) || 0}
                      </li>
                      <li>
                        <span className="font-semibold text-ink">
                          Main Vault:
                        </span>{" "}
                        {currencyMeta?.symbol}
                        {Number.parseFloat(savings) || 0}
                      </li>
                    </ul>
                  </StepShell>
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <p className="mt-4 text-sm font-medium text-chart-expense">
                {error}
              </p>
            )}

            <div className="mt-7 flex items-center gap-3">
              {stepIndex > 0 && step !== "finish" ? (
                <button
                  type="button"
                  onClick={back}
                  className="rounded-full border-2 border-sky-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-sky-300"
                >
                  Back
                </button>
              ) : null}

              {step === "finish" ? (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => void finish()}
                  className="flex-1 rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_-12px_rgba(37,99,235,0.8)] transition hover:bg-primary-dark disabled:opacity-60"
                >
                  {submitting ? "Saving…" : "Go to dashboard"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canContinue()}
                  onClick={next}
                  className="flex-1 rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_-12px_rgba(37,99,235,0.8)] transition hover:bg-primary-dark disabled:opacity-50"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children?: ReactNode
}) {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2rem]">
        {title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-slate-500">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </div>
  )
}
