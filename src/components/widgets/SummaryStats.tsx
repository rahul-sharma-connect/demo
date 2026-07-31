import { TrendingUp, TrendingDown } from "lucide-react"
import { useDashboardData } from "../../data/DashboardDataContext"

export function SummaryStats() {
  const { summaryStats, formatCurrency } = useDashboardData()
  return (
    <div className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      {summaryStats.map((stat) => (
        <div key={stat.label} className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[12px] font-medium text-muted">{stat.label}</p>
            <p className="mt-0.5 text-[20px] font-bold tracking-tight text-ink">
              {formatCurrency(stat.value)}
            </p>
          </div>
          <span
            className={`mt-1 inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
              stat.positive
                ? "bg-primary-soft text-primary"
                : "bg-orange-50 text-chart-expense"
            }`}
          >
            {stat.positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {stat.change > 0 ? "+" : ""}
            {stat.change}%
          </span>
        </div>
      ))}
    </div>
  )
}
