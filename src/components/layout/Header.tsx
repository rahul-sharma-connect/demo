import { useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Settings, Search, LogOut } from "lucide-react"
import { useDashboardData } from "../../data/DashboardDataContext"
import { useAuth } from "../../auth/AuthContext"
import { ConfirmModal } from "../ui/Modal"

export function Header() {
  const { userProfile } = useDashboardData()
  const { logout } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await logout()
    } finally {
      setSigningOut(false)
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <header className="flex flex-wrap items-center gap-3 px-5 py-4 lg:gap-4 lg:px-6">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search transactions, people, goals…"
            className="w-full rounded-full border border-sky-100/80 bg-white/80 py-2.5 pr-4 pl-10 text-[13.5px] text-ink outline-none backdrop-blur-xl placeholder:text-slate-400 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-100/80 bg-white/80 text-slate-500 transition hover:text-primary"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
          <Link
            to="/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-100/80 bg-white/80 text-slate-500 transition hover:text-primary"
            aria-label="Settings"
          >
            <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </Link>

          <div className="hidden items-center gap-2.5 rounded-full border border-sky-100/80 bg-white/80 py-1 pr-3 pl-1 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-[12px] font-bold text-primary">
              {userProfile.initials}
            </div>
            <div className="hidden leading-tight lg:block">
              <p className="text-[13px] font-semibold text-ink">
                {userProfile.name}
              </p>
              <p className="max-w-[140px] truncate text-[11px] text-slate-400">
                {userProfile.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-100/80 bg-white/80 text-slate-500 transition hover:text-primary"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <ConfirmModal
        open={confirmOpen}
        title="Sign out?"
        description="You’ll need to sign in again to access your dashboard and synced data."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        loading={signingOut}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSignOut}
        icon={<LogOut className="h-6 w-6" strokeWidth={1.75} />}
      />
    </>
  )
}
