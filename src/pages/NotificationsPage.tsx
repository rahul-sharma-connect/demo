import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useAuth } from "../auth/AuthContext"
import {
  notificationsApi,
  type NotificationPayload,
  type PushTargetType,
  type RecurrenceType,
  type RecurringNotification,
  type ScheduledNotification,
} from "../api/client"

const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
}

function formatSendResult(result: unknown): string | null {
  if (!result || typeof result !== "object") return null
  const row = result as Record<string, unknown>
  if (typeof row.error === "string") return row.error
  if (typeof row.sent === "number") {
    return row.sent > 0
      ? `Delivered to ${row.sent} device(s)`
      : "No devices received the push (0 registered in Firestore)"
  }
  if (typeof row.messageId === "string") return "Topic message queued"
  return null
}

function statusClass(status: string) {
  if (status === "sent" || status === "active") return "text-emerald-700"
  if (status === "failed") return "text-red-600"
  if (status === "pending") return "text-amber-600"
  return "text-muted"
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"

const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted"

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function NotificationsPage() {
  const { accessToken } = useAuth()
  const [title, setTitle] = useState("YetiWise Reminder")
  const [body, setBody] = useState("Time to check your finances.")
  const [targetType, setTargetType] = useState<PushTargetType>("all")
  const [targetUserId, setTargetUserId] = useState("")
  const [topic, setTopic] = useState("all_users")
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000)
    return toLocalInputValue(d)
  })
  const [scheduled, setScheduled] = useState<ScheduledNotification[]>([])
  const [recurring, setRecurring] = useState<RecurringNotification[]>([])
  const [recurrence, setRecurrence] = useState<RecurrenceType>("daily")
  const [startsAt, setStartsAt] = useState(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000)
    return toLocalInputValue(d)
  })
  const [endsAt, setEndsAt] = useState("")
  const [timezone, setTimezone] = useState("Asia/Kathmandu")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const buildPayload = useCallback((): NotificationPayload => {
    const payload: NotificationPayload = { title, body, targetType }
    if (targetType === "user") payload.targetUserId = targetUserId.trim()
    if (targetType === "topic") payload.topic = topic.trim()
    return payload
  }, [title, body, targetType, targetUserId, topic])

  const loadScheduled = useCallback(async () => {
    if (!accessToken) return
    const rows = await notificationsApi.listScheduled(accessToken)
    setScheduled(rows)
  }, [accessToken])

  const loadRecurring = useCallback(async () => {
    if (!accessToken) return
    const rows = await notificationsApi.listRecurring(accessToken)
    setRecurring(rows)
  }, [accessToken])

  useEffect(() => {
    loadScheduled().catch(() => {})
    loadRecurring().catch(() => {})
  }, [loadScheduled, loadRecurring])

  async function handleSendNow(e: FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const result = await notificationsApi.send(accessToken, buildPayload())
      setMessage(
        `Sent successfully${result.sent != null ? ` — ${result.sent} device(s)` : ""}.`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed")
    } finally {
      setBusy(false)
    }
  }

  async function handleSchedule(e: FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const when = new Date(scheduledAt)
      if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
        throw new Error("Pick a future date and time")
      }
      await notificationsApi.schedule(accessToken, {
        ...buildPayload(),
        scheduledAt: when.toISOString(),
      })
      setMessage("Notification scheduled.")
      await loadScheduled()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Schedule failed")
    } finally {
      setBusy(false)
    }
  }

  async function handleCancel(id: string) {
    if (!accessToken) return
    try {
      await notificationsApi.cancelScheduled(accessToken, id)
      await loadScheduled()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed")
    }
  }

  async function handleCreateRecurring(e: FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const when = new Date(startsAt)
      if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
        throw new Error("Pick a future date and time for the first send")
      }
      let endsAtIso: string | undefined
      if (endsAt.trim()) {
        const end = new Date(endsAt)
        if (Number.isNaN(end.getTime()) || end.getTime() <= when.getTime()) {
          throw new Error("End date must be after the first send")
        }
        endsAtIso = end.toISOString()
      }
      await notificationsApi.createRecurring(accessToken, {
        ...buildPayload(),
        recurrence,
        startsAt: when.toISOString(),
        endsAt: endsAtIso,
        timezone,
      })
      setMessage(`Recurring ${RECURRENCE_LABELS[recurrence].toLowerCase()} notification created.`)
      await loadRecurring()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create recurring failed")
    } finally {
      setBusy(false)
    }
  }

  async function handleCancelRecurring(id: string) {
    if (!accessToken) return
    try {
      await notificationsApi.cancelRecurring(accessToken, id)
      await loadRecurring()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancel failed")
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Notifications</h1>
      <p className="mt-2 text-sm text-muted">
        Send now, schedule once, or create recurring push notifications via FCM.
      </p>

      {(message || error) && (
        <div
          className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
        >
          {error ?? message}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold">Send now</h2>
          <p className="mt-1 text-sm text-muted">Deliver immediately to selected devices.</p>
          <form onSubmit={handleSendNow} className="mt-5 space-y-4">
            <NotificationFields
              title={title}
              body={body}
              targetType={targetType}
              targetUserId={targetUserId}
              topic={topic}
              setTitle={setTitle}
              setBody={setBody}
              setTargetType={setTargetType}
              setTargetUserId={setTargetUserId}
              setTopic={setTopic}
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send notification"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold">Schedule</h2>
          <p className="mt-1 text-sm text-muted">Queue a notification for a future time.</p>
          <form onSubmit={handleSchedule} className="mt-5 space-y-4">
            <NotificationFields
              title={title}
              body={body}
              targetType={targetType}
              targetUserId={targetUserId}
              topic={topic}
              setTitle={setTitle}
              setBody={setBody}
              setTargetType={setTargetType}
              setTargetUserId={setTargetUserId}
              setTopic={setTopic}
            />
            <div>
              <label className={labelClass} htmlFor="scheduledAt">
                Send at
              </label>
              <input
                id="scheduledAt"
                type="datetime-local"
                className={inputClass}
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl border-2 border-primary py-3 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-60"
            >
              {busy ? "Scheduling…" : "Schedule notification"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold">Recurring</h2>
          <p className="mt-1 text-sm text-muted">Repeat daily, weekly, or monthly.</p>
          <form onSubmit={handleCreateRecurring} className="mt-5 space-y-4">
            <NotificationFields
              title={title}
              body={body}
              targetType={targetType}
              targetUserId={targetUserId}
              topic={topic}
              setTitle={setTitle}
              setBody={setBody}
              setTargetType={setTargetType}
              setTargetUserId={setTargetUserId}
              setTopic={setTopic}
            />
            <div>
              <label className={labelClass} htmlFor="recurrence">
                Repeat
              </label>
              <select
                id="recurrence"
                className={inputClass}
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="startsAt">
                First send at
              </label>
              <input
                id="startsAt"
                type="datetime-local"
                className={inputClass}
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="endsAt">
                End date (optional)
              </label>
              <input
                id="endsAt"
                type="datetime-local"
                className={inputClass}
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="timezone">
                Timezone
              </label>
              <select
                id="timezone"
                className={inputClass}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {busy ? "Creating…" : "Create recurring"}
            </button>
          </form>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold">Scheduled queue</h2>
        {scheduled.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No scheduled notifications yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {scheduled.map((row) => (
              <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                <div>
                  <p className="font-semibold">{row.title}</p>
                  <p className="mt-1 text-sm text-muted">{row.body}</p>
                  <p className="mt-2 text-xs text-muted">
                    {new Date(row.scheduledAt).toLocaleString()} · {row.targetType} ·{" "}
                    <span className={`font-semibold uppercase ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </p>
                  {formatSendResult(row.sendResult) && (
                    <p
                      className={`mt-1 text-xs font-medium ${row.status === "failed" ? "text-red-600" : "text-emerald-700"}`}
                    >
                      {formatSendResult(row.sendResult)}
                    </p>
                  )}
                </div>
                {row.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => void handleCancel(row.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold">Recurring notifications</h2>
        {recurring.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No active recurring notifications.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {recurring.map((row) => (
              <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                <div>
                  <p className="font-semibold">{row.title}</p>
                  <p className="mt-1 text-sm text-muted">{row.body}</p>
                  <p className="mt-2 text-xs text-muted">
                    {RECURRENCE_LABELS[row.recurrence]} · Next{" "}
                    {new Date(row.nextRunAt).toLocaleString()} · {row.targetType} ·{" "}
                    <span className={`font-semibold uppercase ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </p>
                  {row.lastSentAt && (
                    <p className="mt-1 text-xs text-muted">
                      Last sent {new Date(row.lastSentAt).toLocaleString()}
                    </p>
                  )}
                  {formatSendResult(row.lastSendResult) && (
                    <p
                      className={`mt-1 text-xs font-medium ${
                        typeof (row.lastSendResult as Record<string, unknown>)?.error === "string"
                          ? "text-red-600"
                          : "text-emerald-700"
                      }`}
                    >
                      {formatSendResult(row.lastSendResult)}
                    </p>
                  )}
                  {row.endsAt && (
                    <p className="mt-1 text-xs text-muted">
                      Ends {new Date(row.endsAt).toLocaleString()}
                    </p>
                  )}
                </div>
                {row.status === "active" && (
                  <button
                    type="button"
                    onClick={() => void handleCancelRecurring(row.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Stop
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function NotificationFields({
  title,
  body,
  targetType,
  targetUserId,
  topic,
  setTitle,
  setBody,
  setTargetType,
  setTargetUserId,
  setTopic,
}: {
  title: string
  body: string
  targetType: PushTargetType
  targetUserId: string
  topic: string
  setTitle: (v: string) => void
  setBody: (v: string) => void
  setTargetType: (v: PushTargetType) => void
  setTargetUserId: (v: string) => void
  setTopic: (v: string) => void
}) {
  return (
    <>
      <div>
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="body">
          Message
        </label>
        <textarea
          id="body"
          className={`${inputClass} min-h-[96px] resize-y`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="targetType">
          Audience
        </label>
        <select
          id="targetType"
          className={inputClass}
          value={targetType}
          onChange={(e) => setTargetType(e.target.value as PushTargetType)}
        >
          <option value="all">All registered devices</option>
          <option value="self">My devices only</option>
          <option value="user">Specific user ID</option>
          <option value="topic">FCM topic</option>
        </select>
      </div>
      {targetType === "user" && (
        <div>
          <label className={labelClass} htmlFor="targetUserId">
            User ID
          </label>
          <input
            id="targetUserId"
            className={inputClass}
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="cuid from database"
            required
          />
        </div>
      )}
      {targetType === "topic" && (
        <div>
          <label className={labelClass} htmlFor="topic">
            Topic name
          </label>
          <input
            id="topic"
            className={inputClass}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="all_users"
            required
          />
        </div>
      )}
    </>
  )
}
