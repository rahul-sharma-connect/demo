import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import {
  analyticsApi,
  type AnalyticsBatchRecord,
  type AnalyticsSummary,
} from "../api/client"

function MetricBar({
  label,
  count,
  max,
}: {
  label: string
  count: number
  max: number
}) {
  const width = max > 0 ? Math.max(8, Math.round((count / max) * 100)) : 0
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-semibold text-muted">{count}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

function MetricList({
  title,
  items,
  empty,
}: {
  title: string
  items: { name: string; count: number }[]
  empty: string
}) {
  const max = items[0]?.count ?? 0
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
      <h2 className="text-lg font-bold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{empty}</p>
      ) : (
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <MetricBar key={item.name} label={item.name} count={item.count} max={max} />
          ))}
        </div>
      )}
    </section>
  )
}

function formatDate(value: string | null) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

function RawBatchCard({ batch }: { batch: AnalyticsBatchRecord }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="rounded-xl border border-border bg-slate-50/80">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-wrap items-start justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="font-mono text-xs text-muted">{batch.id}</p>
          <p className="mt-1 text-sm font-semibold text-ink">
            {batch.userName || "Unknown"} · {batch.eventCount} events
          </p>
          <p className="mt-1 text-xs text-muted">
            Sent {formatDate(batch.sentAt)}
            {batch.receivedAt ? ` · Received ${formatDate(batch.receivedAt)}` : ""}
          </p>
        </div>
        <span className="text-xs font-semibold text-primary">{open ? "Hide" : "View JSON"}</span>
      </button>
      {open && (
        <pre className="max-h-96 overflow-auto border-t border-border bg-white p-4 text-xs leading-relaxed text-ink">
          {JSON.stringify(batch, null, 2)}
        </pre>
      )}
    </article>
  )
}

export function UsagePage() {
  const { accessToken } = useAuth()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [batches, setBatches] = useState<AnalyticsBatchRecord[]>([])
  const [showRaw, setShowRaw] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rawLoading, setRawLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSummary = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const data = await analyticsApi.summary(accessToken)
      setSummary(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load usage analytics")
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  const loadBatches = useCallback(async () => {
    if (!accessToken) return
    setRawLoading(true)
    setError(null)
    try {
      const rows = await analyticsApi.batches(accessToken, 50)
      setBatches(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load raw batches")
    } finally {
      setRawLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadSummary().catch(() => {})
  }, [loadSummary])

  useEffect(() => {
    if (showRaw) {
      loadBatches().catch(() => {})
    }
  }, [showRaw, loadBatches])

  async function handleRefresh() {
    await loadSummary()
    if (showRaw) await loadBatches()
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Usage</h1>
          <p className="mt-2 text-sm text-muted">
            Aggregated app usage from mobile batches — screens, buttons, and exit points.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowRaw((v) => !v)}
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              showRaw
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-white text-ink hover:bg-slate-50"
            }`}
          >
            {showRaw ? "Hide raw data" : "Show raw test data"}
          </button>
          <button
            type="button"
            onClick={() => void handleRefresh()}
            className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-8 rounded-2xl border border-border bg-white p-8 text-sm text-muted shadow-card">
          Loading usage data…
        </p>
      ) : summary ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Total events</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-ink">
                {summary.totalEvents.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Batches received</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-ink">
                {summary.totalBatches.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Session starts</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-ink">
                {summary.sessionStarts.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <MetricList
              title="Most used screens"
              items={summary.topScreens}
              empty="No screen views yet. Send analytics from the mobile app."
            />
            <MetricList
              title="Most clicked buttons"
              items={summary.topButtons}
              empty="No button clicks tracked yet."
            />
            <MetricList
              title="Exit screens"
              items={summary.exitScreens}
              empty="No background/exit events yet."
            />
          </div>
        </>
      ) : null}

      {showRaw && (
        <section className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Raw test data</h2>
              <p className="mt-1 text-sm text-muted">
                Full JSON batches as received from the mobile app (newest first).
              </p>
            </div>
          </div>

          {rawLoading ? (
            <p className="mt-4 text-sm text-muted">Loading raw batches…</p>
          ) : batches.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No batches yet. Use Settings → Send Analytics Now on the phone.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {batches.map((batch) => (
                <RawBatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
