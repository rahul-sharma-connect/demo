import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { useAdminAuth } from '@/auth/AdminAuthContext'

export function AdminLoginPage() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(email, password)
      navigate('/admin/wishlist', { replace: true })
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(
          err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
            ? 'Invalid email or password.'
            : err.message,
        )
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Sign in failed.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-5">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/8 bg-card p-8">
          <h1 className="font-display text-xl font-bold text-white">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-400">Wishlist dashboard access</p>

          <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-medium text-slate-400">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-mist px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-medium text-slate-400">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-mist px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
              />
            </div>

            {error ? (
              <p className="text-sm text-rose-300" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-300">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
