import { motion, AnimatePresence } from "framer-motion"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { useMemo } from "react"
import { useDashboardData } from "@/data/DashboardDataContext"
import { getHomeHeroMood } from "@/lib/heroImage"

const PERIODS = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "ytd", label: "YTD" },
] as const

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function DashboardHero() {
  const {
    userProfile,
    balanceOverview,
    summaryStats,
    formatCurrency,
    period,
    setPeriod,
    transactions,
  } = useDashboardData()

  const income = summaryStats.find((s) => s.label === "Total income")?.value ?? 0
  const expense =
    summaryStats.find((s) => s.label === "Total expenses")?.value ?? 0
  const saved =
    summaryStats.find((s) => s.label === "Saved balance")?.value ?? 0

  const mood = useMemo(
    () =>
      getHomeHeroMood({
        balance: balanceOverview.balance,
        income,
        expense,
        transactions: transactions.map((tx) => ({
          type: tx.type,
          categoryName: tx.categoryName,
          categoryIcon: tx.categoryIcon,
          name: tx.name,
        })),
      }),
    [balanceOverview.balance, income, expense, transactions],
  )

  const greeting = greetingForHour(new Date().getHours())

  return (
    <section className="h-full rounded-2xl border border-border/60 bg-card p-5 shadow-card">
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-muted">{mood.label}</p>
          <h1 className="mt-1 text-[20px] font-bold tracking-tight text-ink">
            {greeting}, {userProfile.name.split(" ")[0]}
          </h1>

          <p className="mt-3 text-[12px] font-medium text-muted">
            Available balance
          </p>
          <p className="mt-0.5 text-[26px] font-bold tracking-tight text-ink">
            {formatCurrency(balanceOverview.balance)}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPeriod(p.value)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                  period === p.value
                    ? "bg-primary text-white"
                    : "bg-bg text-muted hover:text-ink"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <MiniStat
              label="Income"
              value={formatCurrency(income, true)}
              up
            />
            <MiniStat
              label="Expenses"
              value={formatCurrency(expense, true)}
              up={false}
            />
            <MiniStat
              label="Saved"
              value={formatCurrency(saved, true)}
              up={saved >= 0}
            />
          </div>
        </div>

        <div className="flex shrink-0 justify-center sm:justify-end">
          <AnimatePresence mode="wait">
            <motion.img
              key={mood.key}
              src={mood.src}
              alt={`Yeti feeling: ${mood.label}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-40 w-40 object-contain sm:h-44 sm:w-44"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function MiniStat({
  label,
  value,
  up,
}: {
  label: string
  value: string
  up: boolean
}) {
  return (
    <div className="rounded-xl bg-bg px-2.5 py-2">
      <div className="flex items-center gap-0.5 text-[10px] font-medium text-muted">
        {up ? (
          <ArrowUpRight className="h-3 w-3 text-primary" />
        ) : (
          <ArrowDownRight className="h-3 w-3 text-chart-expense" />
        )}
        {label}
      </div>
      <p className="mt-0.5 text-[13px] font-bold tracking-tight text-ink">
        {value}
      </p>
    </div>
  )
}
