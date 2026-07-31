import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { BarChart2, LineChart as LineIcon } from "lucide-react"
import {
  useDashboardData,
  type AnalyticsPeriodOption,
} from "../../data/DashboardDataContext"

type ChartMode = "bar" | "line"

const PERIODS: AnalyticsPeriodOption[] = ["7d", "30d", "90d", "ytd"]

function CustomTooltip({
  active,
  payload,
  label,
  formatCurrency,
}: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number; color: string }>
  label?: string
  formatCurrency: (n: number) => string
}) {
  if (!active || !payload?.length) return null
  const savings = payload.find((p) => p.dataKey === "savings")?.value ?? 0
  const income = payload.find((p) => p.dataKey === "income")?.value ?? 0
  const expenses = payload.find((p) => p.dataKey === "expenses")?.value ?? 0
  if (savings + income + expenses === 0) return null

  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-card">
      <p className="mb-1.5 text-[11px] font-medium text-muted">{label}</p>
      <ul className="space-y-1 text-[12px]">
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-chart-savings" />
          <span className="text-muted">Savings</span>
          <span className="ml-auto font-semibold">{formatCurrency(savings)}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-chart-income" />
          <span className="text-muted">Income</span>
          <span className="ml-auto font-semibold">{formatCurrency(income)}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-chart-expense" />
          <span className="text-muted">Expenses</span>
          <span className="ml-auto font-semibold">
            {formatCurrency(expenses)}
          </span>
        </li>
      </ul>
    </div>
  )
}

export function BalanceOverview() {
  const {
    balanceOverview,
    weeklyChart,
    formatCurrency,
    period,
    setPeriod,
  } = useDashboardData()
  const [mode, setMode] = useState<ChartMode>("bar")
  const [activeDay, setActiveDay] = useState("Mon")
  const [periodOpen, setPeriodOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium text-muted">Balance overview</p>
          <h2 className="mt-0.5 text-[28px] font-bold tracking-tight text-ink">
            {formatCurrency(balanceOverview.balance)}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPeriodOpen((o) => !o)}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-medium text-ink"
            >
              {period}
            </button>
            {periodOpen && (
              <div className="absolute right-0 z-10 mt-1 min-w-[80px] overflow-hidden rounded-lg border border-border bg-card shadow-card">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPeriod(p)
                      setPeriodOpen(false)
                    }}
                    className={`block w-full px-3 py-1.5 text-left text-[12px] font-medium ${
                      p === period
                        ? "bg-primary-soft text-primary"
                        : "text-ink hover:bg-[#F7F8FA]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setMode("bar")}
              className={`px-2 py-1.5 ${mode === "bar" ? "bg-[#F0F1F3] text-ink" : "text-muted"}`}
              aria-label="Bar chart"
            >
              <BarChart2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMode("line")}
              className={`px-2 py-1.5 ${mode === "line" ? "bg-[#F0F1F3] text-ink" : "text-muted"}`}
              aria-label="Line chart"
            >
              <LineIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full">
        {weeklyChart.length === 0 ? (
          <div className="flex h-full items-center justify-center text-[13px] text-muted">
            No activity in this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyChart}
              margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
              barCategoryGap="28%"
              onClick={(state) => {
                if (state?.activeLabel) setActiveDay(String(state.activeLabel))
              }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis hide />
              <Tooltip
                content={<CustomTooltip formatCurrency={formatCurrency} />}
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                defaultIndex={1}
              />
              {mode === "bar" ? (
                <>
                  <Bar
                    dataKey="idle"
                    stackId="a"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={40}
                  >
                    {weeklyChart.map((entry) => (
                      <Cell
                        key={`idle-${entry.day}`}
                        fill={
                          entry.day === activeDay &&
                          entry.savings + entry.income + entry.expenses > 0
                            ? "transparent"
                            : "#E5E7EB"
                        }
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="savings"
                    stackId="a"
                    fill="#F5C542"
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="income"
                    stackId="a"
                    fill="#66BB6A"
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="expenses"
                    stackId="a"
                    fill="#FF8A65"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={40}
                  />
                </>
              ) : (
                <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={28}>
                  {weeklyChart.map((entry) => (
                    <Cell
                      key={`line-${entry.day}`}
                      fill={entry.day === activeDay ? "#66BB6A" : "#E5E7EB"}
                    />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
