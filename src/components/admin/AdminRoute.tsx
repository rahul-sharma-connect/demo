import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '@/auth/AdminAuthContext'

export function AdminRoute() {
  const { user, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist text-slate-400">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

export function AdminGuestRoute() {
  const { user, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist text-slate-400">
        Loading…
      </div>
    )
  }

  if (user) {
    return <Navigate to="/admin/wishlist" replace />
  }

  return <Outlet />
}
