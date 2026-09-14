import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { Search } from 'lucide-react'
import { useAdminAuth } from '@/auth/AdminAuthContext'
import { AdminShell } from '@/components/admin/AdminShell'
import type { WishlistPlatform } from '@/api/client'
import { fetchWishlistEntries, type WishlistEntry } from '@/lib/wishlistAdmin'

function wishlistLoadError(err: unknown): string {
  if (err instanceof FirebaseError) {
    if (err.code === 'permission-denied') {
      return 'Permission denied. Sign in as sara@yetiwize.com and deploy firestore.rules to Firebase (firebase deploy --only firestore:rules).'
    }
    if (err.code === 'unauthenticated') {
      return 'Not signed in. Sign out and sign in again.'
    }
    return `${err.code}: ${err.message}`
  }
  if (err instanceof Error) return err.message
  return 'Could not load wishlist entries.'
}

type PlatformFilter = 'all' | WishlistPlatform
type SortOrder = 'newest' | 'oldest'

function formatWhen(date: Date | null) {
  if (!date) return '—'
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function WishlistAdminPage() {
  const { user } = useAdminAuth()
  const [entries, setEntries] = useState<WishlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState<PlatformFilter>('all')
  const [timezone, setTimezone] = useState('all')
  const [sort, setSort] = useState<SortOrder>('newest')

  useEffect(() => {
    if (!user) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchWishlistEntries()
        if (!cancelled) setEntries(data)
      } catch (err) {
        if (!cancelled) setError(wishlistLoadError(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [user])

  const timezones = useMemo(() => {
    const set = new Set<string>()
    for (const entry of entries) {
      const tz = entry.device?.timezone
      if (tz) set.add(tz)
    }
    return [...set].sort()
  }, [entries])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = entries.filter((entry) => {
      if (platform !== 'all' && entry.platform !== platform) return false
      if (timezone !== 'all' && entry.device?.timezone !== timezone) return false
      if (!q) return true
      return (
        entry.email.toLowerCase().includes(q) ||
        entry.device?.timezone?.toLowerCase().includes(q) ||
        entry.device?.language?.toLowerCase().includes(q) ||
        entry.device?.platform?.toLowerCase().includes(q)
      )
    })

    list = [...list].sort((a, b) => {
      const aTime = a.createdAt?.getTime() ?? 0
      const bTime = b.createdAt?.getTime() ?? 0
      return sort === 'newest' ? bTime - aTime : aTime - bTime
    })

    return list
  }, [entries, search, platform, timezone, sort])

  return (
    <AdminShell title="Wishlist">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {loading ? 'Loading…' : `${filtered.length} of ${entries.length} signups`}
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Search email, timezone, language…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-card py-2.5 pr-4 pl-10 text-sm text-white outline-none focus:border-violet-500/50"
          />
        </div>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as PlatformFilter)}
          className="rounded-xl border border-white/10 bg-card px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
        >
          <option value="all">All platforms</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
          <option value="both">Both</option>
        </select>

        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="rounded-xl border border-white/10 bg-card px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
        >
          <option value="all">All timezones</option>
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          className="rounded-xl border border-white/10 bg-card px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-white/8 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/8 bg-[#08080c]/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Timezone</th>
                <th className="px-4 py-3 font-medium">Signed up</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Loading entries…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No entries match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} className="border-b border-white/5 transition hover:bg-white/3">
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/wishlist/${entry.id}`}
                        className="font-medium text-violet-300 hover:text-violet-200 hover:underline"
                      >
                        {entry.email}
                      </Link>
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-300">{entry.platform}</td>
                    <td className="px-4 py-3 text-slate-400">{entry.device?.timezone ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-400">{formatWhen(entry.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}
