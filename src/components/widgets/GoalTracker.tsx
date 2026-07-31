import { Link } from "react-router-dom"
import { useDashboardData } from "../../data/DashboardDataContext"

export function GoalTracker() {
  const { goals, formatCurrency } = useDashboardData()

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink">Goal tracker</p>
        <Link
          to="/accounts"
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          See all
        </Link>
      </div>

      <ul className="space-y-4">
        {goals.length === 0 && (
          <li className="text-[12px] text-muted">No savings goals yet.</li>
        )}
        {goals.map((goal) => {
          const pct = Math.min(
            100,
            (goal.current / Math.max(goal.target, 1)) * 100,
          )
          return (
            <li key={goal.id} className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white"
                style={{ backgroundColor: goal.color ?? "#66BB6A" }}
              >
                {goal.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-semibold text-ink">
                    {goal.name}
                  </span>
                  <span className="shrink-0 text-[11px] font-medium text-ink">
                    {formatCurrency(goal.current)}{" "}
                    <span className="text-muted">
                      / {formatCurrency(goal.target)}
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EEF0F2]">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-[10.5px] text-muted">{goal.left}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
