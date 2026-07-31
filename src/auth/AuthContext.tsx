import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  authApi,
  setRefreshHandler,
  usersApi,
  type AuthUser,
} from "../api/client"

const ACCESS_KEY = "yetiwise_access_token"
const REFRESH_KEY = "yetiwise_refresh_token"

type AuthContextValue = {
  user: AuthUser | null
  accessToken: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem(ACCESS_KEY),
  )
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => localStorage.getItem(REFRESH_KEY),
  )
  const [loading, setLoading] = useState(true)

  const persist = useCallback((access: string, refresh: string, nextUser: AuthUser) => {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
    setAccessToken(access)
    setRefreshToken(refresh)
    setUser(nextUser)
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    setAccessToken(null)
    setRefreshToken(null)
    setUser(null)
  }, [])

  const doRefresh = useCallback(async () => {
    const currentRefresh = localStorage.getItem(REFRESH_KEY)
    if (!currentRefresh) {
      clear()
      return null
    }
    try {
      const result = await authApi.refresh(currentRefresh)
      persist(result.accessToken, result.refreshToken, result.user)
      return result.accessToken
    } catch {
      clear()
      return null
    }
  }, [clear, persist])

  useEffect(() => {
    setRefreshHandler(doRefresh)
    return () => setRefreshHandler(null)
  }, [doRefresh])

  useEffect(() => {
    let cancelled = false
    async function boot() {
      if (!accessToken) {
        setLoading(false)
        return
      }
      try {
        const me = await usersApi.me(accessToken)
        if (!cancelled) setUser(me)
      } catch {
        const next = await doRefresh()
        if (!next && !cancelled) clear()
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authApi.login({ email, password })
      persist(result.accessToken, result.refreshToken, result.user)
    },
    [persist],
  )

  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const result = await authApi.register({ email, password, displayName })
      persist(result.accessToken, result.refreshToken, result.user)
    },
    [persist],
  )

  const logout = useCallback(async () => {
    try {
      if (accessToken) await authApi.logout(accessToken, refreshToken ?? undefined)
    } catch {
      // ignore network errors on logout
    }
    clear()
  }, [accessToken, refreshToken, clear])

  const refreshProfile = useCallback(async () => {
    if (!accessToken) return
    const me = await usersApi.me(accessToken)
    setUser(me)
  }, [accessToken])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, accessToken, loading, login, register, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
