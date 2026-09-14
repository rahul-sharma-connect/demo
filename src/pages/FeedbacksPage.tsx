import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { feedbackApi, type FeedbackRecord } from "../api/client"

const TOPIC_LABELS: Record<string, string> = {
  feature: "Feature",
  bug: "Bug",
  improvement: "Improvement",
  other: "Other",
}

const TOPIC_COLORS: Record<string, string> = {
  feature: "bg-violet-100 text-violet-700",
  bug: "bg-red-100 text-red-700",
  improvement: "bg-cyan-100 text-cyan-700",
  other: "bg-slate-100 text-slate-700",
}

function formatDate(value: string | null) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

function displayName(row: FeedbackRecord) {
  return row.device?.userName || row.userName || "Unknown user"
}

function displayDevice(row: FeedbackRecord) {
  if (row.device?.model) {
    return `${row.device.model}${row.device.manufacturer ? ` · ${row.device.manufacturer}` : ""}`
  }
  return row.platform ? `${row.platform} device` : "—"
}

export function FeedbacksPage() {
  const { accessToken } = useAuth()
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const rows = await feedbackApi.list(accessToken)
      setFeedbacks(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feedback")
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    load().catch(() => {})
  }, [load])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Feedbacks</h1>
          <p className="mt-2 text-sm text-muted">
            Messages from app users, linked to registered devices when available.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="rounded-2xl border border-border bg-white p-8 text-sm text-muted shadow-card">
            Loading feedback…
          </p>
        ) : feedbacks.length === 0 ? (
          <p className="rounded-2xl border border-border bg-white p-8 text-sm text-muted shadow-card">
            No feedback yet. Users can send feedback from the mobile app drawer → Feedback.
          </p>
        ) : (
          feedbacks.map((row) => (
            <article
              key={row.id}
              className="rounded-2xl border border-border bg-white p-6 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${TOPIC_COLORS[row.topic] ?? TOPIC_COLORS.other}`}
                  >
                    {TOPIC_LABELS[row.topic] ?? row.topic}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {row.status}
                  </span>
                </div>
                <time className="text-xs font-medium text-muted">{formatDate(row.createdAt)}</time>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink">{row.message}</p>

              <div className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">User</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{displayName(row)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Device</p>
                  <p className="mt-1 text-sm font-medium text-ink">{displayDevice(row)}</p>
                  {row.device?.osVersion && (
                    <p className="text-xs text-muted">{row.device.osVersion}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">App</p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {row.device?.appVersion || row.appVersion || "—"}
                  </p>
                  {row.device?.deviceLanguage && (
                    <p className="text-xs text-muted">{row.device.deviceLanguage}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Linked profile</p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {row.deviceId ? (
                      row.device?.profileRegisteredAt ? (
                        <span className="text-emerald-600">Registered device</span>
                      ) : (
                        <span className="text-amber-600">Token only</span>
                      )
                    ) : (
                      "No device link"
                    )}
                  </p>
                  {row.device?.timezone && (
                    <p className="text-xs text-muted">{row.device.timezone}</p>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
