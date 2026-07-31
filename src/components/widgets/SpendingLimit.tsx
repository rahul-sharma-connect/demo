import { useDashboardData } from "../../data/DashboardDataContext"

export function SpendingLimit() {
  const { spendingLimit, formatCurrency } = useDashboardData()
  const pct = Math.min(100, (spendingLimit.spent / Math.max(spendingLimit.limit, 1)) * 100)

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-ink">Monthly spending limit</p>
        <p className="text-[13px] font-semibold text-ink">
          {formatCurrency(spendingLimit.spent)}{" "}
          <span className="font-medium text-muted">
            / {formatCurrency(spendingLimit.limit)}
          </span>
        </p>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#EEF0F2]">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
