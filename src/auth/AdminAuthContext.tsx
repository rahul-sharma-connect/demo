import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL ?? 'sara@yetiwize.com').toLowerCase()

type AdminAuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

function isAdminUser(user: User | null) {
  return user?.email?.toLowerCase() === ADMIN_EMAIL
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    return onAuthStateChanged(auth, (next) => {
      void (async () => {
        if (next && !isAdminUser(next)) {
          await signOut(auth)
          setUser(null)
        } else {
          setUser(isAdminUser(next) ? next : null)
        }
        setLoading(false)
      })()
    })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth()
    const result = await signInWithEmailAndPassword(auth, email.trim(), password)
    if (!isAdminUser(result.user)) {
      await signOut(auth)
      throw new Error('This account is not authorized for admin access.')
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(getFirebaseAuth())
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
