import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import {
  budgetsApi,
  categoriesApi,
  newId,
  transactionsApi,
  type Budget,
  type Category,
  type Transaction,
} from "../api/client"
import { useAuth } from "../auth/AuthContext"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { Field, FormActions, Modal, inputClass } from "../components/ui/Modal"
import { useDashboardData } from "../data/DashboardDataContext"
import { useLiveRefresh } from "../hooks/useLiveRefresh"

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function spentInRange(txs: Transaction[], categoryId: string, from: Date) {
  return txs
    .filter(
      (t) =>
        t.type === "expense" &&
        t.categoryId === categoryId &&
        new Date(t.createdAt) >= from,
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

export function BudgetPage() {
  const { accessToken } = useAuth()
  const { formatCurrency } = useDashboardData()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [txs, setTxs] = useState<Transaction[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Budget | null>(null)
  const [categoryId, setCategoryId] = useState("")
  const [daily, setDaily] = useState("")
  const [monthly, setMonthly] = useState("")
  const [enforced, setEnforced] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!accessToken) return
    if (!silent) {
      setLoading(true)
      setError(null)
    }
    try {
      const [budgetRes, catRes, txRes] = await Promise.all([
        budgetsApi.list(accessToken),
        categoriesApi.list(accessToken),
        transactionsApi.list(accessToken, { limit: 500 }),
      ])
      setBudgets(budgetRes)
      setCategories(catRes)
      setTxs(txRes)
      setError(null)
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : "Failed to load")
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    void load()
  }, [load])

  useLiveRefresh(
    useCallback(() => {
      void load(true)
    }, [load]),
  )

  const now = useMemo(() => new Date(), [])
  const dayStart = startOfDay(now)
  const monthStart = startOfMonth(now)
  const expenseCats = categories.filter((c) => c.type === "expense")

  const rows = useMemo(() => {
    const catMap = new Map(categories.map((c) => [c.id, c]))
    return budgets.map((budget) => ({
      budget,
      category: catMap.get(budget.categoryId),
      dailySpent: spentInRange(txs, budget.categoryId, dayStart),
      monthlySpent: spentInRange(txs, budget.categoryId, monthStart),
    }))
  }, [budgets, categories, txs, dayStart, monthStart])

  const categoryTxs = useMemo(() => {
    if (!selectedCategoryId) return []
    return txs
      .filter(
        (t) =>
          t.categoryId === selectedCategoryId &&
          t.type === "expense" &&
          new Date(t.createdAt) >= monthStart,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }, [txs, selectedCategoryId, monthStart])

  function statusColor(spent: number, limit: number | null) {
    if (limit == null || limit <= 0) return "bg-primary"
    const pct = spent / limit
    if (pct >= 1) return "bg-chart-expense"
    if (pct >= 0.8) return "bg-chart-savings"
    return "bg-primary"
  }

  function openCreate() {
    setEditing(null)
    setCategoryId(expenseCats[0]?.id ?? "")
    setDaily("")
    setMonthly("")
    setEnforced(true)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(budget: Budget) {
    setEditing(budget)
    setCategoryId(budget.categoryId)
    setDaily(budget.dailyLimit != null ? String(budget.dailyLimit) : "")
    setMonthly(budget.monthlyLimit != null ? String(budget.monthlyLimit) : "")
    setEnforced(budget.isEnforced)
    setFormError(null)
    setModalOpen(true)
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!accessToken || !categoryId) {
      setFormError("Pick a category.")
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      const id = editing?.id ?? newId()
      let monthlyLimit =
        monthly.trim() === "" ? null : Number(monthly)
      const dailyLimit = daily.trim() === "" ? null : Number(daily)
      if (dailyLimit != null && dailyLimit > 0 && (monthlyLimit == null || monthlyLimit <= 0)) {
        const days = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
        ).getDate()
        monthlyLimit = dailyLimit * days
      }
      await budgetsApi.upsert(accessToken, id, {
        categoryId,
        dailyLimit,
        monthlyLimit,
        isEnforced: enforced,
      })
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(budget: Budget) {
    if (!accessToken) return
    if (!confirm("Delete this budget?")) return
    try {
      await budgetsApi.remove(accessToken, budget.id)
      if (selectedCategoryId === budget.categoryId) setSelectedCategoryId(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  return (
    <DashboardLayout
      main={
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-ink">Budget</h1>
              <p className="text-[13px] text-muted">
                Set and enforce category limits from web or mobile
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Add budget
            </button>
          </div>

          {loading && (
            <p className="text-[13px] text-muted">Loading budgets…</p>
          )}
          {error && (
            <p className="text-[13px] text-chart-expense">{error}</p>
          )}
          {!loading && !error && rows.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <p className="text-[13px] text-muted">
                No budgets yet. Add limits for expense categories.
              </p>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {rows.map(({ budget, category, dailySpent, monthlySpent }) => {
              const dailyLimit = budget.dailyLimit
              const monthlyLimit = budget.monthlyLimit
              const dailyPct =
                dailyLimit && dailyLimit > 0
                  ? Math.min(100, (dailySpent / dailyLimit) * 100)
                  : 0
              const monthlyPct =
                monthlyLimit && monthlyLimit > 0
                  ? Math.min(100, (monthlySpent / monthlyLimit) * 100)
                  : 0
              const active = selectedCategoryId === budget.categoryId
              return (
                <div
                  key={budget.id}
                  className={`rounded-2xl border bg-card p-5 shadow-card ${
                    active
                      ? "border-primary/40 ring-2 ring-primary/15"
                      : "border-border/60"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategoryId(
                        active ? null : budget.categoryId,
                      )
                    }
                    className="mb-3 flex w-full items-center gap-2.5 text-left"
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-bold text-white"
                      style={{
                        backgroundColor: category?.color ?? "#66BB6A",
                      }}
                    >
                      {(category?.name ?? "?").slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">
                        {category?.name ?? "Unknown category"}
                      </p>
                      <p className="text-[11px] text-muted">
                        {budget.isEnforced ? "Enforced" : "Tracking only"}
                      </p>
                    </div>
                  </button>

                  {dailyLimit != null && dailyLimit > 0 && (
                    <div className="mb-3">
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span className="text-muted">Daily</span>
                        <span className="font-medium text-ink">
                          {formatCurrency(dailySpent)} /{" "}
                          {formatCurrency(dailyLimit)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF0F2]">
                        <div
                          className={`h-full rounded-full ${statusColor(dailySpent, dailyLimit)}`}
                          style={{ width: `${dailyPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {monthlyLimit != null && monthlyLimit > 0 && (
                    <div>
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span className="text-muted">Monthly</span>
                        <span className="font-medium text-ink">
                          {formatCurrency(monthlySpent)} /{" "}
                          {formatCurrency(monthlyLimit)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF0F2]">
                        <div
                          className={`h-full rounded-full ${statusColor(monthlySpent, monthlyLimit)}`}
                          style={{ width: `${monthlyPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => openEdit(budget)}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(budget)}
                      className="text-[11px] font-semibold text-chart-expense hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {selectedCategoryId && (
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <p className="mb-3 text-[13px] font-semibold text-ink">
                This month’s expenses
              </p>
              {categoryTxs.length === 0 ? (
                <p className="text-[12px] text-muted">No expenses yet.</p>
              ) : (
                <ul className="divide-y divide-border/60">
                  {categoryTxs.map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-ink">
                          {tx.title}
                        </p>
                        <p className="text-[11px] text-muted">
                          {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="shrink-0 text-[13px] font-bold text-ink">
                        −{formatCurrency(Math.abs(tx.amount))}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <Modal
            open={modalOpen}
            title={editing ? "Edit budget" : "Add budget"}
            onClose={() => setModalOpen(false)}
          >
            <form onSubmit={onSave}>
              <Field label="Category">
                <select
                  className={inputClass}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  disabled={!!editing}
                >
                  {expenseCats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Daily limit">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="any"
                  value={daily}
                  onChange={(e) => setDaily(e.target.value)}
                />
              </Field>
              <Field label="Monthly limit">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="any"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                />
              </Field>
              <label className="mb-3 flex items-center gap-2 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={enforced}
                  onChange={(e) => setEnforced(e.target.checked)}
                />
                Enforce budget
              </label>
              {formError && (
                <p className="mb-2 text-[12px] text-chart-expense">{formError}</p>
              )}
              <FormActions
                onCancel={() => setModalOpen(false)}
                saving={saving}
              />
            </form>
          </Modal>
        </>
      }
    />
  )
}
