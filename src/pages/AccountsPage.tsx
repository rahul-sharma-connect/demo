import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import {
  newId,
  savingAccountsApi,
  transactionsApi,
  type SavingAccount,
  type Transaction,
} from "../api/client"
import { useAuth } from "../auth/AuthContext"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { Field, FormActions, Modal, inputClass } from "../components/ui/Modal"
import { useDashboardData } from "../data/DashboardDataContext"
import { useLiveRefresh } from "../hooks/useLiveRefresh"

export function AccountsPage() {
  const { accessToken } = useAuth()
  const { formatCurrency, refresh: refreshDashboard } = useDashboardData()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<SavingAccount[]>([])
  const [recent, setRecent] = useState<Transaction[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SavingAccount | null>(null)
  const [name, setName] = useState("")
  const [goal, setGoal] = useState("")
  const [balance, setBalance] = useState("")
  const [color, setColor] = useState("#66BB6A")
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!accessToken) return
    if (!silent) {
      setLoading(true)
      setError(null)
    }
    try {
      const [accRes, txRes] = await Promise.all([
        savingAccountsApi.list(accessToken),
        transactionsApi.list(accessToken, { limit: 200 }),
      ])
      setAccounts(accRes)
      setRecent(txRes.filter((t) => t.savingsAccountId != null).slice(0, 12))
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

  const total = useMemo(
    () => accounts.reduce((sum, a) => sum + a.balance, 0),
    [accounts],
  )

  function openCreate() {
    setEditing(null)
    setName("")
    setGoal("0")
    setBalance("0")
    setColor("#66BB6A")
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(account: SavingAccount) {
    setEditing(account)
    setName(account.name)
    setGoal(String(account.goal))
    setBalance(String(account.balance))
    setColor(account.color || "#66BB6A")
    setFormError(null)
    setModalOpen(true)
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!accessToken || !name.trim()) {
      setFormError("Name is required.")
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      const id = editing?.id ?? newId()
      await savingAccountsApi.upsert(accessToken, id, {
        name: name.trim(),
        goal: Number(goal) || 0,
        balance: Number(balance) || 0,
        color,
        icon: "piggy-bank",
      })
      setModalOpen(false)
      await load()
      void refreshDashboard({ silent: true })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(account: SavingAccount) {
    if (!accessToken) return
    if (!confirm(`Delete savings goal “${account.name}”?`)) return
    try {
      await savingAccountsApi.remove(accessToken, account.id)
      await load()
      void refreshDashboard({ silent: true })
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
              <h1 className="text-xl font-bold text-ink">Accounts</h1>
              <p className="text-[13px] text-muted">
                Saving & Win vault — edit goals from web or mobile
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Add savings goal
            </button>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <p className="text-[12px] font-medium text-muted">Total savings</p>
            <p className="mt-1 text-[28px] font-bold tracking-tight text-ink">
              {loading ? "…" : formatCurrency(total)}
            </p>
          </div>

          {error && (
            <p className="text-[13px] text-chart-expense">{error}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {!loading && accounts.length === 0 && (
              <p className="text-[13px] text-muted sm:col-span-2 xl:col-span-3">
                No savings accounts yet. Add a goal here or on mobile.
              </p>
            )}
            {accounts.map((account) => {
              const pct = Math.min(
                100,
                (account.balance / Math.max(account.goal || 1, 1)) * 100,
              )
              return (
                <div
                  key={account.id}
                  className="rounded-2xl border border-border/60 bg-card p-5 shadow-card"
                >
                  <button
                    type="button"
                    onClick={() => openEdit(account)}
                    className="mb-3 flex w-full items-center gap-3 text-left"
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-[12px] font-bold text-white"
                      style={{ backgroundColor: account.color || "#66BB6A" }}
                    >
                      {account.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-ink">
                        {account.name}
                      </p>
                      <p className="text-[11px] text-muted">
                        {account.goal > 0
                          ? `Goal ${formatCurrency(account.goal)}`
                          : "No goal set"}
                      </p>
                    </div>
                  </button>
                  <p className="text-[20px] font-bold text-ink">
                    {formatCurrency(account.balance)}
                  </p>
                  {account.goal > 0 && (
                    <>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEF0F2]">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] text-muted">
                        {pct.toFixed(0)}% of goal
                      </p>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => void onDelete(account)}
                    className="mt-3 text-[11px] font-semibold text-chart-expense hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )
            })}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <p className="mb-3 text-[13px] font-semibold text-ink">
              Recent savings activity
            </p>
            {recent.length === 0 ? (
              <p className="text-[12px] text-muted">
                No savings-linked transactions yet.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {recent.map((tx) => {
                  const signed =
                    tx.type === "expense"
                      ? -Math.abs(tx.amount)
                      : Math.abs(tx.amount)
                  return (
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
                          {tx.type === "expense" ? " · Deposit" : " · Withdrawal"}
                        </p>
                      </div>
                      <p
                        className={`shrink-0 text-[13px] font-bold ${
                          signed >= 0 ? "text-primary" : "text-ink"
                        }`}
                      >
                        {signed >= 0 ? "+" : "−"}
                        {formatCurrency(Math.abs(signed))}
                      </p>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <Modal
            open={modalOpen}
            title={editing ? "Edit savings goal" : "New savings goal"}
            onClose={() => setModalOpen(false)}
          >
            <form onSubmit={onSave}>
              <Field label="Name">
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>
              <Field label="Balance">
                <input
                  className={inputClass}
                  type="number"
                  step="any"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </Field>
              <Field label="Goal">
                <input
                  className={inputClass}
                  type="number"
                  step="any"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </Field>
              <Field label="Color">
                <input
                  className={inputClass}
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </Field>
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
