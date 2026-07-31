import { useEffect, useState, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { settingsApi } from "./api/client"
import { AuthProvider, useAuth } from "./auth/AuthContext"
import { DashboardDataProvider } from "./data/DashboardDataContext"
import { LoginPage } from "./pages/LoginPage"
import { LandingPage } from "./pages/LandingPage"
import { PrivacyPage } from "./pages/PrivacyPage"
import { TermsPage } from "./pages/TermsPage"
import { OnboardingPage } from "./pages/OnboardingPage"
import { DashboardPage } from "./pages/DashboardPage"
import { TransactionsPage } from "./pages/TransactionsPage"
import { AccountsPage } from "./pages/AccountsPage"
import { BudgetPage } from "./pages/BudgetPage"
import { CashFlowPage } from "./pages/CashFlowPage"
import { PeoplePage } from "./pages/PeoplePage"
import { SettingsPage } from "./pages/SettingsPage"
import { PlaygroundPage } from "./pages/PlaygroundPage"

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist text-muted">
      Loading…
    </div>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />

  return children
}

function AuthenticatedApp() {
  const { accessToken } = useAuth()
  const [onboardingCompleted, setOnboardingCompleted] = useState<
    boolean | null
  >(null)
  const [gateError, setGateError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    async function check() {
      try {
        const settings = await settingsApi.get(accessToken!)
        if (!cancelled) {
          setOnboardingCompleted(settings.onboardingCompleted)
          setGateError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setGateError(
            err instanceof Error ? err.message : "Failed to load account",
          )
        }
      }
    }
    void check()
    return () => {
      cancelled = true
    }
  }, [accessToken])

  if (gateError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-mist px-4 text-center">
        <p className="text-sm font-medium text-chart-expense">{gateError}</p>
        <button
          type="button"
          className="text-sm font-semibold text-primary hover:underline"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  if (onboardingCompleted === null) return <LoadingScreen />

  if (!onboardingCompleted) {
    return (
      <OnboardingPage onComplete={() => setOnboardingCompleted(true)} />
    )
  }

  return (
    <DashboardDataProvider>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/cash-flow" element={<CashFlowPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardDataProvider>
  )
}

function LoginRoute() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />

  return <LoginPage />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
