import { useCallback, useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  analyticsApi,
  type AnalyticsPeriod,
} from "../api/client"
import { useAuth } from "../auth/AuthContext"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { useDashboardData } from "../data/DashboardDataContext"
import { useLiveRefresh } from "../hooks/useLiveRefresh"

const PERIODS: AnalyticsPeriod[] = ["7d", "30d", "90d", "ytd"]

export function CashFlowPage() {
  const { accessToken } = useAuth()
  const { formatCurrency } = useDashboardData()
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overview, setOverview] = useState({
    income: 0,
    expenses: 0,
    saved: 0,
    balance: 0,
  })
  const [weekly, setWeekly] = useState<
    Array<{
      day: string
      income: number
      expenses: number
      savings: number
      total: number
    }>
  >([])
  const [costs, setCosts] = useState<
    Array<{ name: string; percent: number; color: string; amount: number }>
  >([])

  const load = useCallback(async (silent = false) => {
    if (!accessToken) return
    if (!silent) {
      setLoading(true)
      setError(null)
    }
    try {
      const chartPeriod: AnalyticsPeriod =
        period === "7d" || period === "30d" ? period : "7d"
      const [ov, wk, br] = await Promise.all([
        analyticsApi.overview(accessToken, period),
        analyticsApi.weekly(accessToken, chartPeriod),
        analyticsApi.costBreakdown(accessToken, period),
      ])
      setOverview({
        income: ov.income,
        expenses: ov.expenses,
        saved: ov.saved,
        balance: ov.balance,
      })
      setWeekly(wk.weeklyChart)
      setCosts(br.costCategories)
      setError(null)
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Failed to load")
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [accessToken, period])

  useEffect(() => {
    void load()
  }, [load])

  useLiveRefresh(
    useCallback(() => {
      void load(true)
    }, [load]),
  )

  const pieData = costs.filter((c) => c.percent > 0)

  return (
    <DashboardLayout
      main={
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-ink">Cash flow</h1>
              <p className="text-[13px] text-muted">
                Income vs expenses over time
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                    period === p
                      ? "bg-primary text-white"
                      : "bg-[#F0F1F3] text-muted hover:text-ink"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <p className="text-[13px] text-muted">Loading cash flow…</p>
          )}
          {error && (
            <p className="text-[13px] text-chart-expense">{error}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Balance", value: overview.balance },
              { label: "Income", value: overview.income, tone: "positive" },
              { label: "Expenses", value: overview.expenses, tone: "expense" },
              { label: "Saved", value: overview.saved, tone: "positive" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border/60 bg-card p-4 shadow-card"
              >
                <p className="text-[12px] font-medium text-muted">
                  {stat.label}
                </p>
                <p
                  className={`mt-1 text-[20px] font-bold ${
                    stat.tone === "positive"
                      ? "text-primary"
                      : stat.tone === "expense"
                        ? "text-chart-expense"
                        : "text-ink"
                  }`}
                >
                  {formatCurrency(stat.value)}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <p className="mb-4 text-[13px] font-semibold text-ink">
                Income vs expenses
              </p>
              <div className="h-[260px]">
                {weekly.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-[13px] text-muted">
                    No data for this period.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekly} barCategoryGap="24%">
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(Number(value ?? 0))
                        }
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #e8eaed",
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        dataKey="income"
                        fill="#66BB6A"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={28}
                      />
                      <Bar
                        dataKey="expenses"
                        fill="#FF8A65"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={28}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <p className="mb-4 text-[13px] font-semibold text-ink">
                Spending by category
              </p>
              {pieData.length === 0 ? (
                <p className="text-[12px] text-muted">No spending breakdown.</p>
              ) : (
                <>
                  <div className="mx-auto h-[180px] w-full max-w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="percent"
                          nameKey="name"
                          innerRadius={48}
                          outerRadius={78}
                          paddingAngle={2}
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {pieData.map((cat) => (
                      <li
                        key={cat.name}
                        className="flex items-center gap-2 text-[12px]"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="flex-1 truncate text-muted">
                          {cat.name}
                        </span>
                        <span className="font-semibold text-ink">
                          {cat.percent}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </>
      }
    />
  )
}
