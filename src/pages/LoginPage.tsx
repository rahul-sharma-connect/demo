import type { FormEvent } from "react"
import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "../auth/AuthContext"
import { images } from "@/assets/images"
import { SITE } from "@/utils/seo"

const ease = [0.22, 1, 0.36, 1] as const

const inputClass =
  "w-full rounded-2xl border-2 border-sky-200 bg-white px-4 py-3.5 text-[15px] font-medium text-ink outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"

export function LoginPage() {
  const { login, register } = useAuth()
  const [searchParams] = useSearchParams()
  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login"
  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isRegister = mode === "register"

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (mode === "login") await login(email, password)
      else await register(email, password, displayName.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setSubmitting(false)
    }
  }

  function switchMode(next: "login" | "register") {
    setMode(next)
    setError(null)
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-mist text-ink">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-[20%] h-[480px] w-[480px] rounded-full bg-sky-300/45 blur-[120px]" />
        <div className="absolute top-[30%] -left-20 h-[360px] w-[360px] rounded-full bg-blue-400/30 blur-[110px]" />
        <div className="absolute top-[15%] right-0 h-[420px] w-[420px] rounded-full bg-cyan-300/35 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* Left — Yeti */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <Link to="/" className="mb-8 inline-flex items-center gap-2.5 self-start">
            <img
              src={images.icon}
              alt=""
              className="h-9 w-9 rounded-xl object-cover shadow-lg shadow-primary/20"
              aria-hidden="true"
            />
            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              Yeti
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                Wize
              </span>
            </span>
          </Link>

          <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:mx-0 lg:max-w-none">
            <div
              className="absolute inset-[10%] rounded-full bg-gradient-to-br from-sky-300/50 via-blue-300/30 to-cyan-200/40 blur-3xl"
              aria-hidden="true"
            />
            <motion.img
              src={images.splashIcon}
              alt="YetiWize mascot"
              className="relative z-10 w-full max-w-[340px] object-contain drop-shadow-[0_30px_60px_rgba(37,99,235,0.28)] sm:max-w-[400px]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="mt-6 hidden lg:block">
            <p className="font-display text-3xl font-extrabold tracking-tight text-ink">
              {SITE.tagline}
            </p>
            <p className="mt-3 max-w-md text-base leading-relaxed text-slate-500">
              Your fluffy finance buddy for calm money habits. Early access is
              open—mobile apps coming soon.
            </p>
          </div>
        </motion.div>

        {/* Right — Auth card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end"
        >
          <div className="rounded-[2rem] border border-white/80 bg-white/70 p-7 shadow-[0_28px_70px_-30px_rgba(37,99,235,0.5)] backdrop-blur-2xl sm:p-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease }}
              >
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  {isRegister ? "Create account" : "Sign in"}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {isRegister
                    ? "Create your cloud account—we'll walk you through a quick setup next."
                    : "Welcome back. Existing mobile accounts sync here automatically."}
                </p>
              </motion.div>
            </AnimatePresence>

            <form onSubmit={onSubmit} className="mt-7">
              <div className="space-y-3.5">
                {isRegister && (
                  <div>
                    <label
                      htmlFor="displayName"
                      className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-500 uppercase"
                    >
                      Name
                    </label>
                    <input
                      id="displayName"
                      required
                      className={inputClass}
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-500 uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-500 uppercase"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    className={inputClass}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                  />
                </div>
              </div>

              {error && (
                <p className="mt-3 text-sm font-medium text-chart-expense">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_-12px_rgba(37,99,235,0.8)] transition hover:bg-primary-dark disabled:opacity-60"
              >
                {submitting
                  ? "Please wait…"
                  : isRegister
                    ? "Sign up"
                    : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isRegister ? "Already have an account?" : "New to YetiWize?"}{" "}
              <button
                type="button"
                onClick={() => switchMode(isRegister ? "login" : "register")}
                className="font-semibold text-primary hover:underline"
              >
                {isRegister ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>

          <p className="mt-5 text-center text-sm text-slate-400">
            <Link to="/" className="hover:text-sky-600">
              ← Back to home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
