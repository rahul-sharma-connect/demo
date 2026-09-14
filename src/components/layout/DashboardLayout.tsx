import { NavLink, Outlet } from "react-router-dom"
import { Activity, Bell, LogOut, MessageSquare, Users } from "lucide-react"
import { useAuth } from "../../auth/AuthContext"

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
    isActive
      ? "bg-primary/10 text-primary"
      : "text-slate-600 hover:bg-slate-100 hover:text-ink",
  ].join(" ")

export function DashboardLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-mist text-ink">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-white px-4 py-6">
        <div className="mb-8 px-2">
          <p className="font-display text-lg font-extrabold tracking-tight">
            Yeti<span className="text-primary">Wize</span>
          </p>
          <p className="mt-1 text-xs font-medium text-muted">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink to="/dashboard/notifications" className={navClass} end>
            <Bell size={18} />
            Notifications
          </NavLink>
          <NavLink to="/dashboard/users" className={navClass} end>
            <Users size={18} />
            Users
          </NavLink>
          <NavLink to="/dashboard/feedbacks" className={navClass} end>
            <MessageSquare size={18} />
            Feedbacks
          </NavLink>
          <NavLink to="/dashboard/usage" className={navClass} end>
            <Activity size={18} />
            Usage
          </NavLink>
        </nav>

        <div className="mt-auto border-t border-border pt-4">
          <p className="truncate px-2 text-xs font-medium text-muted">{user?.email}</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-3 flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  )
}
