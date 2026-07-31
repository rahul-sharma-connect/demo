import { useDashboardData } from "../../data/DashboardDataContext"

export function CostAnalysis() {
  const { costCategories, costTotal, formatCurrency } = useDashboardData()

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <div className="mb-1 flex items-baseline justify-between">
        <div>
          <p className="text-[12px] font-medium text-muted">Spending overview</p>
          <h3 className="text-[22px] font-bold tracking-tight text-ink">
            {formatCurrency(costTotal)}
          </h3>
        </div>
        <span className="text-[12px] font-medium text-muted">This period</span>
      </div>

      <div className="mt-4 flex h-3 overflow-hidden rounded-full">
        {costCategories.map((cat) => (
          <div
            key={cat.name}
            style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
            title={`${cat.name} ${cat.percent}%`}
          />
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {costCategories.map((cat) => (
          <li key={cat.name} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span className="flex-1 truncate text-muted">{cat.name}</span>
            <span className="font-semibold text-ink">{cat.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
