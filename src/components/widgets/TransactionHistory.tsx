import { Link } from "react-router-dom"
import { useDashboardData } from "../../data/DashboardDataContext"

export function TransactionHistory() {
  const { transactions, formatCurrency } = useDashboardData()

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink">Transaction history</p>
        <Link
          to="/transactions"
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          See all
        </Link>
      </div>

      <ul className="max-h-[340px] space-y-3 overflow-y-auto scroll-thin pr-1">
        {transactions.length === 0 && (
          <li className="text-[12px] text-muted">No transactions yet.</li>
        )}
        {transactions.map((tx) => (
          <li key={tx.id} className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: tx.color }}
            >
              {tx.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">
                {tx.name}
              </p>
              <p className="text-[11px] text-muted">{tx.date}</p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className={`text-[13px] font-bold ${
                  tx.amount >= 0 ? "text-primary" : "text-ink"
                }`}
              >
                {tx.amount >= 0 ? "+ " : "- "}
                {formatCurrency(Math.abs(tx.amount))}
              </p>
              <p
                className={`text-[10.5px] font-medium ${
                  tx.status === "Completed"
                    ? "text-primary"
                    : "text-chart-expense"
                }`}
              >
                {tx.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
