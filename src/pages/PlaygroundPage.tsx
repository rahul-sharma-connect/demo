import { useCallback, useEffect, useState, type FormEvent } from "react"
import {
  newId,
  playgroundApi,
  type PlaygroundAccount,
} from "../api/client"
import { useAuth } from "../auth/AuthContext"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { Field, FormActions, Modal, inputClass } from "../components/ui/Modal"
import { useDashboardData } from "../data/DashboardDataContext"
import { useLiveRefresh } from "../hooks/useLiveRefresh"

export function PlaygroundPage() {
  const { accessToken } = useAuth()
  const { formatCurrency } = useDashboardData()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<PlaygroundAccount[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const [accModal, setAccModal] = useState(false)
  const [accName, setAccName] = useState("")
  const [accType, setAccType] = useState<"money" | "zero">("money")
  const [accBalance, setAccBalance] = useState("0")
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [txModal, setTxModal] = useState(false)
  const [txTitle, setTxTitle] = useState("")
  const [txAmount, setTxAmount] = useState("")
  const [txType, setTxType] = useState<"income" | "expense">("expense")

  const load = useCallback(async (silent = false) => {
    if (!accessToken) return
    if (!silent) {
      setLoading(true)
      setError(null)
    }
    try {
      const list = await playgroundApi.listAccounts(accessToken)
      setAccounts(list)
      setActiveId((prev) => prev ?? list[0]?.id ?? null)
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

  const active = accounts.find((a) => a.id === activeId)

  async function createAccount(e: FormEvent) {
    e.preventDefault()
    if (!accessToken || !accName.trim()) {
      setFormError("Name is required.")
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      const id = newId()
      const balance = accType === "money" ? Number(accBalance) || 0 : 0
      await playgroundApi.upsertAccount(accessToken, id, {
        name: accName.trim(),
        type: accType,
        balance: 0,
        createdAt: new Date().toISOString(),
      })
      if (accType === "money" && balance !== 0) {
        await playgroundApi.upsertTransaction(accessToken, newId(), {
          accountId: id,
          title: "Starting balance",
          amount: Math.abs(balance),
          type: balance >= 0 ? "income" : "expense",
          categoryName: "Start",
          categoryColor: "#66BB6A",
          createdAt: new Date().toISOString(),
        })
      }
      setAccModal(false)
      await load()
      setActiveId(id)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function deleteAccount(id: string) {
    if (!accessToken) return
    if (!confirm("Delete this playground space?")) return
    try {
      await playgroundApi.removeAccount(accessToken, id)
      if (activeId === id) setActiveId(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  async function addTx(e: FormEvent) {
    e.preventDefault()
    if (!accessToken || !activeId) return
    const amount = Number(txAmount)
    if (!txTitle.trim() || !(amount > 0)) {
      setFormError("Title and positive amount required.")
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      await playgroundApi.upsertTransaction(accessToken, newId(), {
        accountId: activeId,
        title: txTitle.trim(),
        amount,
        type: txType,
        categoryName: "General",
        categoryColor: "#888888",
        createdAt: new Date().toISOString(),
      })
      setTxModal(false)
      setTxTitle("")
      setTxAmount("")
      await load()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function deleteTx(id: string) {
    if (!accessToken) return
    if (!confirm("Delete this playground transaction?")) return
    try {
      await playgroundApi.removeTransaction(accessToken, id)
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
              <h1 className="text-xl font-bold text-ink">Playground</h1>
              <p className="text-[13px] text-muted">
                Sandbox spaces synced across mobile and web
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAccName("")
                setAccType("money")
                setAccBalance("0")
                setFormError(null)
                setAccModal(true)
              }}
              className="rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
            >
              New space
            </button>
          </div>

          {loading && (
            <p className="text-[13px] text-muted">Loading playground…</p>
          )}
          {error && (
            <p className="text-[13px] text-chart-expense">{error}</p>
          )}

          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            <div className="rounded-2xl border border-border/60 bg-card p-3 shadow-card">
              {accounts.length === 0 && !loading && (
                <p className="p-2 text-[12px] text-muted">No spaces yet.</p>
              )}
              <ul className="space-y-1">
                {accounts.map((acc) => (
                  <li key={acc.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(acc.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] ${
                        activeId === acc.id
                          ? "bg-primary-soft font-semibold text-primary"
                          : "text-ink hover:bg-[#F7F8FA]"
                      }`}
                    >
                      <span className="truncate">{acc.name}</span>
                      <span className="text-[11px] text-muted">
                        {formatCurrency(acc.balance)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              {!active ? (
                <p className="text-[13px] text-muted">
                  Select or create a playground space.
                </p>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] text-muted capitalize">
                        {active.type} space
                      </p>
                      <h2 className="text-[22px] font-bold text-ink">
                        {active.name}
                      </h2>
                      <p className="mt-1 text-[20px] font-bold text-primary">
                        {formatCurrency(active.balance)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTxTitle("")
                          setTxAmount("")
                          setTxType("expense")
                          setFormError(null)
                          setTxModal(true)
                        }}
                        className="rounded-xl bg-primary px-3 py-2 text-[12px] font-semibold text-white"
                      >
                        Add tx
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteAccount(active.id)}
                        className="rounded-xl border border-border px-3 py-2 text-[12px] font-semibold text-chart-expense"
                      >
                        Delete space
                      </button>
                    </div>
                  </div>

                  <ul className="divide-y divide-border/60">
                    {(active.transactions ?? []).length === 0 && (
                      <li className="py-3 text-[12px] text-muted">
                        No transactions in this space.
                      </li>
                    )}
                    {(active.transactions ?? []).map((tx) => {
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
                              {tx.categoryName || "General"} ·{" "}
                              {new Date(tx.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p
                              className={`text-[13px] font-bold ${
                                signed >= 0 ? "text-primary" : "text-ink"
                              }`}
                            >
                              {signed >= 0 ? "+" : "−"}
                              {formatCurrency(Math.abs(signed))}
                            </p>
                            <button
                              type="button"
                              onClick={() => void deleteTx(tx.id)}
                              className="text-[11px] font-semibold text-chart-expense"
                            >
                              Del
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </div>
          </div>

          <Modal
            open={accModal}
            title="New playground space"
            onClose={() => setAccModal(false)}
          >
            <form onSubmit={createAccount}>
              <Field label="Name">
                <input
                  className={inputClass}
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  required
                />
              </Field>
              <Field label="Type">
                <select
                  className={inputClass}
                  value={accType}
                  onChange={(e) =>
                    setAccType(e.target.value as "money" | "zero")
                  }
                >
                  <option value="money">Start with money</option>
                  <option value="zero">Start at zero</option>
                </select>
              </Field>
              {accType === "money" && (
                <Field label="Starting balance">
                  <input
                    className={inputClass}
                    type="number"
                    step="any"
                    value={accBalance}
                    onChange={(e) => setAccBalance(e.target.value)}
                  />
                </Field>
              )}
              {formError && (
                <p className="mb-2 text-[12px] text-chart-expense">{formError}</p>
              )}
              <FormActions
                onCancel={() => setAccModal(false)}
                saving={saving}
              />
            </form>
          </Modal>

          <Modal
            open={txModal}
            title="Playground transaction"
            onClose={() => setTxModal(false)}
          >
            <form onSubmit={addTx}>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  required
                />
              </Field>
              <Field label="Amount">
                <input
                  className={inputClass}
                  type="number"
                  min="0.01"
                  step="any"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                />
              </Field>
              <Field label="Type">
                <select
                  className={inputClass}
                  value={txType}
                  onChange={(e) =>
                    setTxType(e.target.value as "income" | "expense")
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </Field>
              {formError && (
                <p className="mb-2 text-[12px] text-chart-expense">{formError}</p>
              )}
              <FormActions
                onCancel={() => setTxModal(false)}
                saving={saving}
              />
            </form>
          </Modal>
        </>
      }
    />
  )
}
