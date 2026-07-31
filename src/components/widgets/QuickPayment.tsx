import { Link } from "react-router-dom"
import { Users } from "lucide-react"
import { useDashboardData } from "../../data/DashboardDataContext"

export function QuickPayment() {
  const { peoplePreview } = useDashboardData()

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink">People</p>
        <Link
          to="/people"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted hover:text-ink"
          aria-label="View all people"
        >
          <Users className="h-3.5 w-3.5" />
        </Link>
      </div>

      {peoplePreview.length === 0 ? (
        <p className="text-[12px] text-muted">
          No people yet. Sync from mobile to see IOUs here.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {peoplePreview.map((person) => (
            <Link
              key={person.id}
              to={`/people?id=${person.id}`}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full text-[12px] font-bold text-white"
                style={{ backgroundColor: person.color }}
              >
                {person.initials}
              </span>
              <span className="max-w-[56px] truncate text-[11px] font-medium text-muted">
                {person.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
