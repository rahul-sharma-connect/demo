import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { useSearchParams } from "react-router-dom"
import {
  newId,
  peopleApi,
  transactionsApi,
  type Person,
  type Transaction,
} from "../api/client"
import { useAuth } from "../auth/AuthContext"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { Field, FormActions, Modal, inputClass } from "../components/ui/Modal"
import { useDashboardData } from "../data/DashboardDataContext"
import { useLiveRefresh } from "../hooks/useLiveRefresh"
import { colorForId, initialsFrom } from "../lib/format"

function personBalance(txs: Transaction[], personId: string) {
  let theyOwe = 0
  let youOwe = 0
  for (const t of txs) {
    if (t.personId !== personId) continue
    if (t.type === "expense") theyOwe += Math.abs(t.amount)
    else youOwe += Math.abs(t.amount)
  }
  return { balance: theyOwe - youOwe, theyOwe, youOwe }
}

export function PeoplePage() {
  const { accessToken } = useAuth()
  const { formatCurrency } = useDashboardData()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get("id")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [people, setPeople] = useState<Person[]>([])
  const [txs, setTxs] = useState<Transaction[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Person | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!accessToken) return
    if (!silent) {
      setLoading(true)
      setError(null)
    }
    try {
      const [peopleRes, txRes] = await Promise.all([
        peopleApi.list(accessToken),
        transactionsApi.list(accessToken, { limit: 500 }),
      ])
      setPeople(peopleRes)
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

  const rows = useMemo(
    () =>
      people.map((person) => ({
        person,
        ...personBalance(txs, person.id),
      })),
    [people, txs],
  )

  const selected = rows.find((r) => r.person.id === selectedId)

  const history = useMemo(() => {
    if (!selectedId) return []
    return txs
      .filter((t) => t.personId === selectedId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
  }, [txs, selectedId])

  function openCreate() {
    setEditing(null)
    setName("")
    setPhone("")
    setNote("")
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(person: Person) {
    setEditing(person)
    setName(person.name)
    setPhone(person.phone ?? "")
    setNote(person.note ?? "")
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
      await peopleApi.upsert(accessToken, id, {
        name: name.trim(),
        phone: phone.trim() || null,
        note: note.trim() || null,
      })
      setModalOpen(false)
      await load()
      setSearchParams({ id }, { replace: true })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(person: Person) {
    if (!accessToken) return
    if (!confirm(`Delete “${person.name}”?`)) return
    try {
      await peopleApi.remove(accessToken, person.id)
      if (selectedId === person.id) setSearchParams({}, { replace: true })
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
              <h1 className="text-xl font-bold text-ink">People</h1>
              <p className="text-[13px] text-muted">
                IOU contacts — manage from web or mobile
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Add person
            </button>
          </div>

          {loading && <p className="text-[13px] text-muted">Loading people…</p>}
          {error && (
            <p className="text-[13px] text-chart-expense">{error}</p>
          )}

          <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-2xl border border-border/60 bg-card shadow-card">
              {!loading && rows.length === 0 && (
                <p className="p-5 text-[13px] text-muted">
                  No people yet. Add a contact to track IOUs.
                </p>
              )}
              <ul className="divide-y divide-border/60">
                {rows.map(({ person, balance }) => {
                  const active = selectedId === person.id
                  return (
                    <li key={person.id}>
                      <div
                        className={`flex items-center gap-2 px-3 py-2 ${
                          active ? "bg-primary-soft/50" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setSearchParams(
                              active ? {} : { id: person.id },
                              { replace: true },
                            )
                          }
                          className="flex min-w-0 flex-1 items-center gap-3 px-1 py-1.5 text-left"
                        >
                          <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ backgroundColor: colorForId(person.id) }}
                          >
                            {initialsFrom(person.name)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-semibold text-ink">
                              {person.name}
                            </p>
                            <p className="text-[11px] text-muted">
                              {person.phone || "No phone"}
                            </p>
                          </div>
                          <p
                            className={`shrink-0 text-[13px] font-bold ${
                              balance > 0
                                ? "text-primary"
                                : balance < 0
                                  ? "text-chart-expense"
                                  : "text-muted"
                            }`}
                          >
                            {balance === 0
                              ? "Settled"
                              : `${balance > 0 ? "+" : "−"}${formatCurrency(Math.abs(balance))}`}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(person)}
                          className="text-[11px] font-semibold text-primary"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void onDelete(person)}
                          className="text-[11px] font-semibold text-chart-expense"
                        >
                          Del
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              {!selected ? (
                <p className="text-[13px] text-muted">
                  Select a person to see their balance and history.
                </p>
              ) : (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full text-[13px] font-bold text-white"
                      style={{
                        backgroundColor: colorForId(selected.person.id),
                      }}
                    >
                      {initialsFrom(selected.person.name)}
                    </span>
                    <div>
                      <p className="text-[16px] font-bold text-ink">
                        {selected.person.name}
                      </p>
                      <p className="text-[12px] text-muted">
                        {selected.person.note ||
                          selected.person.phone ||
                          "No details"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-[#F7F8FA] p-3">
                      <p className="text-[10px] font-medium text-muted">
                        They owe
                      </p>
                      <p className="mt-0.5 text-[14px] font-bold text-primary">
                        {formatCurrency(selected.theyOwe)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F7F8FA] p-3">
                      <p className="text-[10px] font-medium text-muted">
                        You owe
                      </p>
                      <p className="mt-0.5 text-[14px] font-bold text-chart-expense">
                        {formatCurrency(selected.youOwe)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F7F8FA] p-3">
                      <p className="text-[10px] font-medium text-muted">Net</p>
                      <p className="mt-0.5 text-[14px] font-bold text-ink">
                        {selected.balance === 0
                          ? "Settled"
                          : formatCurrency(selected.balance)}
                      </p>
                    </div>
                  </div>
                  <p className="mb-2 text-[13px] font-semibold text-ink">
                    History
                  </p>
                  {history.length === 0 ? (
                    <p className="text-[12px] text-muted">
                      No transactions with this person.
                    </p>
                  ) : (
                    <ul className="max-h-[360px] divide-y divide-border/60 overflow-y-auto scroll-thin">
                      {history.map((tx) => {
                        const signed =
                          tx.type === "expense"
                            ? Math.abs(tx.amount)
                            : -Math.abs(tx.amount)
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
                            <p
                              className={`shrink-0 text-[13px] font-bold ${
                                signed >= 0
                                  ? "text-primary"
                                  : "text-chart-expense"
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
                </>
              )}
            </div>
          </div>

          <Modal
            open={modalOpen}
            title={editing ? "Edit person" : "Add person"}
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
              <Field label="Phone">
                <input
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
              <Field label="Note">
                <input
                  className={inputClass}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
