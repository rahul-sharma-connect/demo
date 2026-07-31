import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import { useDashboardData } from "../../data/DashboardDataContext"

export function FinancialHealth() {
  const { financialHealth, formatCurrency } = useDashboardData()
  const gaugeData = [
    { name: "saved", value: financialHealth.percentSaved },
    { name: "rest", value: 100 - financialHealth.percentSaved },
  ]

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <p className="text-[12px] font-medium text-muted">Financial health</p>
      <div className="mt-0.5 flex items-center gap-2">
        <h3 className="text-[22px] font-bold tracking-tight text-ink">
          {formatCurrency(financialHealth.amount)}
        </h3>
        <span className="inline-flex items-center gap-0.5 rounded-md bg-primary-soft px-1.5 py-0.5 text-[11px] font-semibold text-primary">
          <TrendingUp className="h-3 w-3" />
          {financialHealth.change > 0 ? "+" : ""}
          {financialHealth.change}%
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted">from last month</p>

      <div className="relative mx-auto mt-2 h-[140px] w-full max-w-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              cx="50%"
              cy="85%"
              startAngle={180}
              endAngle={0}
              innerRadius={68}
              outerRadius={88}
              paddingAngle={0}
              stroke="none"
            >
              <Cell fill="#2563eb" />
              <Cell fill="#E8EAED" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-[28px] font-bold leading-none text-ink">
            {financialHealth.percentSaved}%
          </span>
          <span className="mt-1 text-center text-[10px] leading-tight text-muted">
            of monthly income
            <br />
            saved
          </span>
        </div>
      </div>
    </div>
  )
}
