import { Wifi } from "lucide-react"
import { useDashboardData } from "../../data/DashboardDataContext"

export function MyCard() {
  const { cardInfo } = useDashboardData()

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
      <p className="mb-3 text-[13px] font-semibold text-ink">My Card</p>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#60a5fa] via-primary to-[#1d4ed8] p-5 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 right-8 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative flex items-start justify-between">
          <Wifi className="h-5 w-5 rotate-90 opacity-90" strokeWidth={2} />
          <span className="text-[16px] font-bold italic tracking-wider">
            {cardInfo.brand}
          </span>
        </div>

        <p className="relative mt-8 font-mono text-[15px] tracking-[0.12em]">
          {cardInfo.number}
        </p>

        <div className="relative mt-5 flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/70">
              Card holder
            </p>
            <p className="text-[12px] font-semibold">{cardInfo.name}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-wider text-white/70">
              Expires
            </p>
            <p className="text-[12px] font-semibold">{cardInfo.expiry}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
