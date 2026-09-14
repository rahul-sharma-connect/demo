import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AdminShell } from '@/components/admin/AdminShell'
import { fetchWishlistEntry, type WishlistEntry } from '@/lib/wishlistAdmin'

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="grid gap-1 border-b border-white/5 py-3 sm:grid-cols-3">
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="break-all text-sm text-slate-200 sm:col-span-2">{value ?? '—'}</dd>
    </div>
  )
}

function formatWhen(date: Date | null) {
  if (!date) return '—'
  return date.toLocaleString(undefined, {
    dateStyle: 'full',
    timeStyle: 'long',
  })
}

export function WishlistDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [entry, setEntry] = useState<WishlistEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError('Entry not found.')
      return
    }
    const entryId = id
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchWishlistEntry(entryId)
        if (!cancelled) {
          if (!data) setError('Entry not found.')
          setEntry(data)
        }
      } catch {
        if (!cancelled) setError('Could not load entry.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <AdminShell title="Wishlist entry" backTo="/admin/wishlist">
      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : error ? (
        <div>
          <p className="text-sm text-rose-300">{error}</p>
          <Link to="/admin/wishlist" className="mt-4 inline-block text-sm text-violet-400 hover:underline">
            Back to list
          </Link>
        </div>
      ) : entry ? (
        <div className="space-y-8">
          <section className="rounded-2xl border border-white/8 bg-card p-6">
            <h2 className="font-display text-lg font-bold text-white">{entry.email}</h2>
            <p className="mt-1 text-sm text-slate-400">Signed up {formatWhen(entry.createdAt)}</p>
          </section>

          <section className="rounded-2xl border border-white/8 bg-card px-6">
            <h3 className="border-b border-white/8 py-4 text-sm font-semibold text-white">Signup</h3>
            <dl>
              <DetailRow label="Email" value={entry.email} />
              <DetailRow label="Platform" value={entry.platform} />
              <DetailRow label="Source" value={entry.source} />
              <DetailRow label="Signed up" value={formatWhen(entry.createdAt)} />
            </dl>
          </section>

          <section className="rounded-2xl border border-white/8 bg-card px-6">
            <h3 className="border-b border-white/8 py-4 text-sm font-semibold text-white">Locale</h3>
            <dl>
              <DetailRow label="Timezone" value={entry.device?.timezone} />
              <DetailRow label="Timezone offset (min)" value={entry.device?.timezoneOffsetMinutes} />
              <DetailRow label="Language" value={entry.device?.language} />
              <DetailRow label="Languages" value={entry.device?.languages?.join(', ')} />
            </dl>
          </section>

          <section className="rounded-2xl border border-white/8 bg-card px-6">
            <h3 className="border-b border-white/8 py-4 text-sm font-semibold text-white">Device</h3>
            <dl>
              <DetailRow label="Platform" value={entry.device?.platform} />
              <DetailRow label="Vendor" value={entry.device?.vendor} />
              <DetailRow label="User agent" value={entry.device?.userAgent} />
              <DetailRow label="CPU cores" value={entry.device?.hardwareConcurrency} />
              <DetailRow label="Max touch points" value={entry.device?.maxTouchPoints} />
              <DetailRow label="Online" value={entry.device?.online ? 'Yes' : 'No'} />
              <DetailRow label="Cookies enabled" value={entry.device?.cookieEnabled ? 'Yes' : 'No'} />
            </dl>
          </section>

          <section className="rounded-2xl border border-white/8 bg-card px-6">
            <h3 className="border-b border-white/8 py-4 text-sm font-semibold text-white">Screen</h3>
            <dl>
              <DetailRow
                label="Screen size"
                value={
                  entry.device?.screen
                    ? `${entry.device.screen.width} × ${entry.device.screen.height}`
                    : null
                }
              />
              <DetailRow
                label="Available size"
                value={
                  entry.device?.screen
                    ? `${entry.device.screen.availWidth} × ${entry.device.screen.availHeight}`
                    : null
                }
              />
              <DetailRow label="Color depth" value={entry.device?.screen?.colorDepth} />
              <DetailRow label="Pixel ratio" value={entry.device?.screen?.pixelRatio} />
              <DetailRow
                label="Viewport"
                value={
                  entry.device?.viewport
                    ? `${entry.device.viewport.width} × ${entry.device.viewport.height}`
                    : null
                }
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-white/8 bg-card px-6">
            <h3 className="border-b border-white/8 py-4 text-sm font-semibold text-white">Network & page</h3>
            <dl>
              <DetailRow label="Connection type" value={entry.device?.connection?.effectiveType} />
              <DetailRow label="Downlink (Mbps)" value={entry.device?.connection?.downlink} />
              <DetailRow label="RTT (ms)" value={entry.device?.connection?.rtt} />
              <DetailRow
                label="Save data"
                value={
                  entry.device?.connection?.saveData == null
                    ? null
                    : entry.device.connection.saveData
                      ? 'Yes'
                      : 'No'
                }
              />
              <DetailRow label="Referrer" value={entry.device?.referrer || '—'} />
              <DetailRow label="Page URL" value={entry.device?.pageUrl} />
            </dl>
          </section>
        </div>
      ) : null}
    </AdminShell>
  )
}
