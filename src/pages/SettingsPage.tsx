import { useEffect, useState, type FormEvent } from "react"
import { settingsApi, usersApi } from "../api/client"
import { useAuth } from "../auth/AuthContext"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { useDashboardData } from "../data/DashboardDataContext"

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "INR", "NPR", "ESP"]
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ne", label: "Nepali" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
]

export function SettingsPage() {
  const { accessToken, user, refreshProfile } = useAuth()
  const { refresh: refreshDashboard, formatCurrency } = useDashboardData()

  const [displayName, setDisplayName] = useState(user?.displayName ?? "")
  const [currency, setCurrency] = useState("USD")
  const [language, setLanguage] = useState("en")
  const [allowNegative, setAllowNegative] = useState(false)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const settings = await settingsApi.get(accessToken!)
        if (!cancelled) {
          setCurrency(settings.currency)
          setLanguage(settings.language)
          setAllowNegative(settings.allowNegativeBalance)
          setBalance(settings.balance)
          setDisplayName(user?.displayName ?? "")
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [accessToken, user?.displayName])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      await Promise.all([
        usersApi.updateMe(accessToken, {
          displayName: displayName.trim() || null,
        }),
        settingsApi.patch(accessToken, {
          currency,
          language,
          allowNegativeBalance: allowNegative,
        }),
      ])
      await refreshProfile()
      await refreshDashboard()
      setMessage("Settings saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function onRefresh() {
    setMessage(null)
    setError(null)
    try {
      await refreshDashboard()
      setMessage("Dashboard data refreshed.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed")
    }
  }

  return (
    <DashboardLayout
      main={
        <>
          <div>
            <h1 className="text-xl font-bold text-ink">Settings</h1>
            <p className="text-[13px] text-muted">
              Profile and synced preferences
            </p>
          </div>

          {loading ? (
            <p className="text-[13px] text-muted">Loading settings…</p>
          ) : (
            <form
              onSubmit={onSave}
              className="max-w-xl space-y-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card"
            >
              <div>
                <label className="mb-1 block text-[12px] font-medium text-muted">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[13.5px] text-muted"
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-medium text-muted">
                  Display name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-primary/40"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-muted">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[13.5px] text-ink"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-muted">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[13.5px] text-ink"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={allowNegative}
                  onChange={(e) => setAllowNegative(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary"
                />
                Allow negative balance
              </label>

              <div className="rounded-xl bg-[#F7F8FA] px-3.5 py-3">
                <p className="text-[11px] font-medium text-muted">
                  Available balance (synced)
                </p>
                <p className="text-[18px] font-bold text-ink">
                  {formatCurrency(balance)}
                </p>
              </div>

              {message && (
                <p className="text-[13px] font-medium text-primary">{message}</p>
              )}
              {error && (
                <p className="text-[13px] text-chart-expense">{error}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => void onRefresh()}
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] font-semibold text-ink hover:bg-[#F7F8FA]"
                >
                  Refresh dashboard data
                </button>
              </div>
            </form>
          )}
        </>
      }
    />
  )
}
