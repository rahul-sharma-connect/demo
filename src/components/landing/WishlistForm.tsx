import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { FirebaseError } from 'firebase/app'
import type { WishlistPlatform } from '@/api/client'
import { joinWishlist } from '@/lib/wishlist'
import { SITE } from '@/utils/seo'
import { cn } from '@/utils/cn'

const STORAGE_KEY = 'yetiwize-wishlist-joined'

type WishlistFormProps = {
  defaultPlatform?: WishlistPlatform
  variant?: 'inline' | 'stacked'
  onSuccess?: () => void
}

const platforms: { id: WishlistPlatform; label: string }[] = [
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'both', label: 'Both' },
]

function readJoined(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markJoined() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function WishlistForm({
  defaultPlatform = 'both',
  variant = 'stacked',
  onSuccess,
}: WishlistFormProps) {
  const [email, setEmail] = useState('')
  const [platform, setPlatform] = useState<WishlistPlatform>(defaultPlatform)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    () => (readJoined() ? 'success' : 'idle'),
  )
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError('')

    try {
      await joinWishlist(trimmed, platform)
      markJoined()
      setStatus('success')
      onSuccess?.()
    } catch (err) {
      let message = 'Could not save your signup. Try again or email us directly.'
      if (err instanceof FirebaseError) {
        if (err.code === 'permission-denied') {
          message = 'Wishlist is temporarily unavailable. Please email us instead.'
        } else {
          message = err.message
        }
      } else if (err instanceof Error && err.message.includes('Firebase is not configured')) {
        message = 'Wishlist is not configured yet. Please email us instead.'
      }
      setError(message)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-emerald-200">You&apos;re on the wishlist</p>
          <p className="mt-1 text-sm text-emerald-200/80">
            We&apos;ll email you when YetiWize launches on the App Store and Google Play.
          </p>
        </div>
      </div>
    )
  }

  const isInline = variant === 'inline'

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="w-full">
      <div
        className={cn(
          isInline
            ? 'flex flex-col gap-3 sm:flex-row sm:items-end'
            : 'space-y-4',
        )}
      >
        <div className={cn(isInline && 'flex-1')}>
          <label htmlFor="wishlist-email" className="sr-only">
            Email address
          </label>
          <input
            id="wishlist-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0f] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60"
          />
        </div>

        <fieldset className={cn(isInline ? 'sm:shrink-0' : undefined)}>
          <legend className="sr-only">Preferred platform</legend>
          <div className="flex flex-wrap gap-2">
            {platforms.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={status === 'loading'}
                onClick={() => setPlatform(item.id)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-60',
                  platform === item.id
                    ? 'border-violet-500/40 bg-violet-500/15 text-violet-200'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60',
            isInline && 'sm:shrink-0',
          )}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Joining…
            </>
          ) : (
            'Join wishlist'
          )}
        </button>
      </div>

      {status === 'error' && error ? (
        <p className="mt-3 text-sm text-rose-300" role="alert">
          {error}{' '}
          <a href={`mailto:${SITE.email}`} className="underline hover:text-rose-200">
            Email us instead
          </a>
        </p>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          Get launch updates for iOS and Android. No spam — unsubscribe anytime.
        </p>
      )}
    </form>
  )
}
