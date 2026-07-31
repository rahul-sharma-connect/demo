import { DashboardLayout } from "../components/layout/DashboardLayout"
import { DashboardHero } from "../components/widgets/DashboardHero"
import { SummaryStats } from "../components/widgets/SummaryStats"
import { BalanceOverview } from "../components/widgets/BalanceOverview"
import { SpendingLimit } from "../components/widgets/SpendingLimit"
import { OptimizationTips } from "../components/widgets/OptimizationTips"
import { CostAnalysis } from "../components/widgets/CostAnalysis"
import { FinancialHealth } from "../components/widgets/FinancialHealth"
import { GoalTracker } from "../components/widgets/GoalTracker"
import { MyCard } from "../components/widgets/MyCard"
import { QuickActions } from "../components/widgets/QuickActions"
import { QuickPayment } from "../components/widgets/QuickPayment"
import { TransactionHistory } from "../components/widgets/TransactionHistory"
import { useDashboardData } from "../data/DashboardDataContext"

export function DashboardPage() {
  const { loading, error, refresh } = useDashboardData()

  return (
    <DashboardLayout
      main={
        <>
          {(loading || error) && (
            <div className="mb-1 flex items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white/80 px-4 py-2.5 text-sm shadow-sm backdrop-blur-xl">
              <span className="text-muted">
                {loading ? "Loading live data…" : error}
              </span>
              {!loading && (
                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="font-semibold text-primary"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.7fr)]">
            <DashboardHero />
            <SummaryStats />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_1fr]">
            <BalanceOverview />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <SpendingLimit />
              <OptimizationTips />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <CostAnalysis />
            <FinancialHealth />
            <div className="md:col-span-2 xl:col-span-1">
              <GoalTracker />
            </div>
          </div>
        </>
      }
      right={
        <>
          <MyCard />
          <QuickActions />
          <QuickPayment />
          <TransactionHistory />
        </>
      }
    />
  )
}
