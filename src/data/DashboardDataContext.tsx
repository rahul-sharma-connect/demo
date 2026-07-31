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
  analyticsApi,
  peopleApi,
  settingsApi,
  type AnalyticsPeriod,
  type Person,
  type Settings,
} from "../api/client"
import { useAuth } from "../auth/AuthContext"
import { useLiveRefresh } from "../hooks/useLiveRefresh"
import { colorForId, formatMoney, initialsFrom } from "../lib/format"
import { cardInfo as mockCard } from "./mock"

export type AnalyticsPeriodOption = AnalyticsPeriod

type WeeklyPoint = {
  day: string
  savings: number
  income: number
  expenses: number
  idle: number
  total: number
}

type SummaryStat = {
  label: string
  value: number
  change: number
  positive: boolean
}

type CostCategory = { name: string; percent: number; color: string }

type Goal = {
  id: string
  name: string
  current: number
  target: number
  left: string
  color?: string
  image?: string
}

type RecentTx = {
  id: string
  initials: string
  color: string
  name: string
  date: string
  amount: number
  type: "income" | "expense"
  categoryName: string | null
  categoryIcon: string | null
  status: "Completed" | "Declined"
}

type PeoplePreview = {
  id: string
  name: string
  initials: string
  color: string
}

type DashboardData = {
  loading: boolean
  error: string | null
  hasData: boolean
  refresh: (opts?: { silent?: boolean }) => Promise<void>
  period: AnalyticsPeriod
  setPeriod: (period: AnalyticsPeriod) => void
  currency: string
  settings: Settings | null
  formatCurrency: (n: number, compact?: boolean) => string
  balanceOverview: { balance: number; period: string }
  weeklyChart: WeeklyPoint[]
  summaryStats: SummaryStat[]
  spendingLimit: { spent: number; limit: number }
  costTotal: number
  costCategories: CostCategory[]
  financialHealth: { amount: number; change: number; percentSaved: number }
  goals: Goal[]
  transactions: RecentTx[]
  userProfile: { name: string; email: string; initials: string }
  cardInfo: typeof mockCard
  peoplePreview: PeoplePreview[]
}

const emptyWeekly: WeeklyPoint[] = []

const DashboardDataContext = createContext<DashboardData | null>(null)

const emptyData = {
  balanceOverview: { balance: 0, period: "7d" },
  weeklyChart: emptyWeekly,
  summaryStats: [
    { label: "Total income", value: 0, change: 0, positive: true },
    { label: "Total expenses", value: 0, change: 0, positive: true },
    { label: "Saved balance", value: 0, change: 0, positive: true },
  ] as SummaryStat[],
  spendingLimit: { spent: 0, limit: 0 },
  costTotal: 0,
  costCategories: [] as CostCategory[],
  financialHealth: { amount: 0, change: 0, percentSaved: 0 },
  goals: [] as Goal[],
  transactions: [] as RecentTx[],
}

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const { accessToken, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasData, setHasData] = useState(false)
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d")
  const [settings, setSettings] = useState<Settings | null>(null)
  const [peoplePreview, setPeoplePreview] = useState<PeoplePreview[]>([])
  const [data, setData] = useState(emptyData)

  const currency = settings?.currency ?? "USD"

  const formatCurrency = useCallback(
    (n: number, compact = false) => formatMoney(n, currency, compact),
    [currency],
  )

  const refresh = useCallback(async (opts?: { silent?: boolean }) => {
    if (!accessToken) return
    if (!opts?.silent) {
      setLoading(true)
      setError(null)
    }
    try {
      const chartPeriod: AnalyticsPeriod =
        period === "7d" || period === "30d" ? period : "7d"
      const [
        overview,
        weekly,
        costs,
        limit,
        goalsRes,
        recent,
        health,
        settingsRes,
        peopleRes,
      ] = await Promise.all([
        analyticsApi.overview(accessToken, period),
        analyticsApi.weekly(accessToken, chartPeriod),
        analyticsApi.costBreakdown(accessToken, period),
        analyticsApi.spendingLimit(accessToken),
        analyticsApi.goals(accessToken),
        analyticsApi.recentTransactions(accessToken),
        analyticsApi.financialHealth(accessToken, period),
        settingsApi.get(accessToken),
        peopleApi.list(accessToken),
      ])

      setSettings(settingsRes)
      setPeoplePreview(
        peopleRes.slice(0, 6).map((p: Person) => ({
          id: p.id,
          name: p.name,
          initials: initialsFrom(p.name),
          color: colorForId(p.id),
        })),
      )
      setData({
        balanceOverview: {
          balance: weekly.balance,
          period: weekly.period,
        },
        weeklyChart: weekly.weeklyChart,
        summaryStats: [
          {
            label: "Total income",
            value: overview.income,
            change: overview.changes.income,
            positive: overview.changes.income >= 0,
          },
          {
            label: "Total expenses",
            value: overview.expenses,
            change: overview.changes.expenses,
            positive: overview.changes.expenses <= 0,
          },
          {
            label: "Saved balance",
            value: overview.saved,
            change: overview.changes.saved,
            positive: overview.changes.saved >= 0,
          },
        ],
        spendingLimit: limit,
        costTotal: costs.total,
        costCategories: costs.costCategories.map(({ name, percent, color }) => ({
          name,
          percent,
          color,
        })),
        financialHealth: health,
        goals: goalsRes.goals.map((g) => ({
          ...g,
          image: undefined,
        })),
        transactions: recent.transactions.map((t) => ({
          ...t,
          type: t.type ?? (t.amount >= 0 ? "income" : "expense"),
          categoryName: t.categoryName ?? null,
          categoryIcon: t.categoryIcon ?? null,
          date: new Date(t.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        })),
      })
      setHasData(true)
      setError(null)
    } catch (err) {
      if (!opts?.silent) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard")
      }
    } finally {
      if (!opts?.silent) setLoading(false)
    }
  }, [accessToken, period])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useLiveRefresh(
    useCallback(() => {
      void refresh({ silent: true })
    }, [refresh]),
  )

  const userProfile = useMemo(() => {
    if (!user) {
      return { name: "Guest", email: "", initials: "?" }
    }
    const name = user.displayName || user.email.split("@")[0]
    return {
      name,
      email: user.email,
      initials: initialsFrom(name, user.email),
    }
  }, [user])

  const cardInfo = useMemo(
    () => ({
      ...mockCard,
      name: userProfile.name,
    }),
    [userProfile.name],
  )

  const value: DashboardData = {
    loading,
    error,
    hasData,
    refresh,
    period,
    setPeriod,
    currency,
    settings,
    formatCurrency,
    ...data,
    userProfile,
    cardInfo,
    peoplePreview,
  }

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  )
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext)
  if (!ctx) throw new Error("useDashboardData must be used within provider")
  return ctx
}
