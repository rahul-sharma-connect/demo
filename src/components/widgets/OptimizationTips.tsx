import { ChevronRight } from "lucide-react"

const mosaic = [
  "bg-primary",
  "bg-chart-expense",
  "bg-primary/70",
  "bg-chart-savings",
  "bg-primary",
  "bg-chart-expense/80",
  "bg-primary/50",
  "bg-chart-savings/80",
  "bg-primary/80",
]

export function OptimizationTips() {
  return (
    <div className="flex h-full items-stretch gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-snug text-ink">
          Optimize your budget with these quick tips
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
          Tax season is coming — review deductions and trim unused subscriptions
          before March.
        </p>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary hover:underline"
        >
          Read more
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid shrink-0 grid-cols-3 gap-1 self-center">
        {mosaic.map((cls, i) => (
          <div key={i} className={`h-5 w-5 rounded-md ${cls}`} />
        ))}
      </div>
    </div>
  )
}
