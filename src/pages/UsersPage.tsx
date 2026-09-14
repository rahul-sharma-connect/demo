import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { devicesApi, type RegisteredDevice } from "../api/client"

function formatDate(value: string | null) {
  if (!value) return "—"
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

function formatScreen(device: RegisteredDevice) {
  if (device.screenWidth == null || device.screenHeight == null) return "—"
  return `${device.screenWidth} × ${device.screenHeight}`
}

export function UsersPage() {
  const { accessToken } = useAuth()
  const [devices, setDevices] = useState<RegisteredDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const rows = await devicesApi.listProfiles(accessToken)
      setDevices(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    load().catch(() => {})
  }, [load])

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Users</h1>
          <p className="mt-2 text-sm text-muted">
            App installs with device profile data from Firestore.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white shadow-card">
        {loading ? (
          <p className="p-8 text-sm text-muted">Loading users…</p>
        ) : devices.length === 0 ? (
          <p className="p-8 text-sm text-muted">
            No registered devices yet. Open the mobile app on Home to register a profile.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-slate-50 text-xs font-bold uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">OS</th>
                  <th className="px-4 py-3">Screen</th>
                  <th className="px-4 py-3">Density</th>
                  <th className="px-4 py-3">App</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Timezone</th>
                  <th className="px-4 py-3">Architecture</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Installed</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-semibold text-ink">
                      {device.userName || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">{device.model || "—"}</div>
                      <div className="text-xs text-muted">{device.manufacturer || "—"}</div>
                    </td>
                    <td className="px-4 py-3">{device.osVersion || "—"}</td>
                    <td className="px-4 py-3">{formatScreen(device)}</td>
                    <td className="px-4 py-3">
                      {device.screenDensity != null ? `${device.screenDensity} DPI` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div>{device.appVersion || "—"}</div>
                      <div className="text-xs capitalize text-muted">{device.platform}</div>
                    </td>
                    <td className="px-4 py-3">{device.deviceLanguage || "—"}</td>
                    <td className="px-4 py-3">{device.timezone || "—"}</td>
                    <td className="px-4 py-3">{device.architecture || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{device.packageName || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted">
                      {formatDate(device.appInstallTime)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted">
                      {formatDate(device.appUpdateTime)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted">
                      {formatDate(device.profileRegisteredAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
