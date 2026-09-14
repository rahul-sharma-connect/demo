import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAdminAuth } from '@/auth/AdminAuthContext'

export function AdminShell({
  title,
  children,
  backTo,
}: {
  title: string
  children: ReactNode
  backTo?: string
}) {
  const { logout, user } = useAdminAuth()

  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="border-b border-white/8 bg-[#08080c]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            {backTo ? (
              <Link to={backTo} className="text-sm text-slate-400 hover:text-white">
                ← Back
              </Link>
            ) : null}
            <h1 className="font-display text-sm font-bold text-white sm:text-base">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  )
}
