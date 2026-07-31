import {
  ArrowUpFromLine,
  Send,
  HandCoins,
  History,
  MoreHorizontal,
} from "lucide-react"

const actions = [
  { label: "Top up", icon: ArrowUpFromLine },
  { label: "Send", icon: Send },
  { label: "Request", icon: HandCoins },
  { label: "History", icon: History },
  { label: "More", icon: MoreHorizontal },
]

export function QuickActions() {
  return (
    <div className="flex justify-between gap-1 px-1">
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="flex flex-col items-center gap-1.5"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition-colors hover:bg-[#F7F8FA]">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </span>
          <span className="text-[10.5px] font-medium text-muted">{label}</span>
        </button>
      ))}
    </div>
  )
}
