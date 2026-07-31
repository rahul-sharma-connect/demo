import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import {
  categoriesApi,
  newId,
  parseTxAttachment,
  peopleApi,
  savingAccountsApi,
  serializeTxAttachment,
  transactionsApi,
  uploadsApi,
  type Category,
  type Person,
  type SavingAccount,
  type Transaction,
} from "../api/client"
import { useAuth } from "../auth/AuthContext"
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { Field, FormActions, Modal, inputClass } from "../components/ui/Modal"
import { useDashboardData } from "../data/DashboardDataContext"
import { useLiveRefresh } from "../hooks/useLiveRefresh"
import { colorForId, initialsFrom } from "../lib/format"

type SortKey = "newest" | "oldest" | "highest" | "lowest"
type TypeFilter = "all" | "income" | "expense"

type FormState = {
  title: string
  amount: string
  type: "income" | "expense"
  categoryId: string
  personId: string
  savingsAccountId: string
  note: string
  photo: string
}

const emptyForm: FormState = {
  title: "",
  amount: "",
  type: "expense",
  categoryId: "",
  personId: "",
  savingsAccountId: "",
  note: "",
  photo: "",
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== "string") {
        reject(new Error("Could not read image"))
        return
      }
      resolve(result)
    }
    reader.onerror = () => reject(new Error("Could not read image"))
    reader.readAsDataURL(file)
  })
}

export function TransactionsPage() {
  const { accessToken } = useAuth()
  const { formatCurrency, refresh: refreshDashboard } = useDashboardData()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [txs, setTxs] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [savings, setSavings] = useState<SavingAccount[]>([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [categoryId, setCategoryId] = useState<string>("all")
  const [sort, setSort] = useState<SortKey>("newest")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(async (silent = false) => {
    if (!accessToken) return
    if (!silent) {
      setLoading(true)
      setError(null)
    }
    try {
      const [txRes, catRes, peopleRes, savRes] = await Promise.all([
        transactionsApi.list(accessToken, { limit: 500 }),
        categoriesApi.list(accessToken),
        peopleApi.list(accessToken),
        savingAccountsApi.list(accessToken),
      ])
      setTxs(txRes)
      setCategories(catRes)
      setPeople(peopleRes)
      setSavings(savRes)
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

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  )
  const peopleMap = useMemo(
    () => new Map(people.map((p) => [p.id, p])),
    [people],
  )

  const filtered = useMemo(() => {
    let list = [...txs]
    if (typeFilter !== "all") list = list.filter((t) => t.type === typeFilter)
    if (categoryId !== "all")
      list = list.filter((t) => t.categoryId === categoryId)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.note ?? "").toLowerCase().includes(q),
      )
    }
    list.sort((a, b) => {
      if (sort === "newest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sort === "oldest")
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sort === "highest") return b.amount - a.amount
      return a.amount - b.amount
    })
    return list
  }, [txs, typeFilter, categoryId, search, sort])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(tx: Transaction) {
    const { photo } = parseTxAttachment(tx.attachment)
    setEditing(tx)
    setForm({
      title: tx.title,
      amount: String(tx.amount),
      type: tx.type === "income" ? "income" : "expense",
      categoryId: tx.categoryId ?? "",
      personId: tx.personId ?? "",
      savingsAccountId: tx.savingsAccountId ?? "",
      note: tx.note ?? "",
      photo: photo ?? "",
    })
    setFormError(null)
    setModalOpen(true)
  }

  async function onPhotoSelected(file: File | null) {
    if (!file || !accessToken) return
    setUploading(true)
    setFormError(null)
    try {
      const dataUrl = await fileToBase64(file)
      const { url } = await uploadsApi.image(accessToken, dataUrl, file.name)
      setForm((f) => ({ ...f, photo: url }))
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    const amount = Number(form.amount)
    if (!form.title.trim() || !(amount > 0)) {
      setFormError("Title and a positive amount are required.")
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      const id = editing?.id ?? newId()
      const existingVoice = editing
        ? parseTxAttachment(editing.attachment).voiceUri
        : null
      await transactionsApi.upsert(accessToken, id, {
        title: form.title.trim(),
        amount,
        type: form.type,
        categoryId: form.categoryId || null,
        personId: form.personId || null,
        savingsAccountId: form.savingsAccountId || null,
        note: form.note.trim() || null,
        attachment: serializeTxAttachment(form.photo || null, existingVoice),
        createdAt: editing?.createdAt ?? new Date().toISOString(),
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

  async function onDelete(tx: Transaction) {
    if (!accessToken) return
    if (!confirm(`Delete “${tx.title}”?`)) return
    try {
      await transactionsApi.remove(accessToken, tx.id)
      await load()
      void refreshDashboard({ silent: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const typeCategories = categories.filter((c) => c.type === form.type)

  return (
    <DashboardLayout
      main={
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-ink">Transactions</h1>
              <p className="text-[13px] text-muted">
                Create, edit, and sync activity with mobile
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-ink"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest amount</option>
                <option value="lowest">Lowest amount</option>
              </select>
              <button
                type="button"
                onClick={openCreate}
                className="rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
              >
                Add transaction
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or note…"
              className="mb-3 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-primary/40"
            />
            <div className="mb-3 flex flex-wrap gap-2">
              {(["all", "income", "expense"] as TypeFilter[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold capitalize ${
                    typeFilter === t
                      ? "bg-primary text-white"
                      : "bg-[#F0F1F3] text-muted hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryId("all")}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${
                  categoryId === "all"
                    ? "bg-primary-soft text-primary"
                    : "bg-[#F7F8FA] text-muted"
                }`}
              >
                All categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${
                    categoryId === c.id
                      ? "bg-primary-soft text-primary"
                      : "bg-[#F7F8FA] text-muted"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card shadow-card">
            {loading && (
              <p className="p-5 text-[13px] text-muted">Loading transactions…</p>
            )}
            {error && (
              <p className="p-5 text-[13px] text-chart-expense">{error}</p>
            )}
            {!loading && !error && filtered.length === 0 && (
              <p className="p-5 text-[13px] text-muted">No transactions found.</p>
            )}
            {!loading && filtered.length > 0 && (
              <ul className="divide-y divide-border/60">
                {filtered.map((tx) => {
                  const cat = tx.categoryId
                    ? categoryMap.get(tx.categoryId)
                    : undefined
                  const person = tx.personId
                    ? peopleMap.get(tx.personId)
                    : undefined
                  const { photo } = parseTxAttachment(tx.attachment)
                  const signed =
                    tx.type === "expense"
                      ? -Math.abs(tx.amount)
                      : Math.abs(tx.amount)
                  return (
                    <li
                      key={tx.id}
                      className="flex items-center gap-3 px-4 py-3.5"
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{
                            backgroundColor: cat?.color ?? colorForId(tx.id),
                          }}
                        >
                          {initialsFrom(tx.title)}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => openEdit(tx)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="truncate text-[13px] font-semibold text-ink">
                          {tx.title}
                        </p>
                        <p className="truncate text-[11px] text-muted">
                          {[cat?.name, person?.name]
                            .filter(Boolean)
                            .join(" · ") || "Uncategorized"}
                          {" · "}
                          {new Date(tx.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          {tx.note ? ` · ${tx.note}` : ""}
                        </p>
                      </button>
                      <p
                        className={`shrink-0 text-[13px] font-bold ${
                          signed >= 0 ? "text-primary" : "text-ink"
                        }`}
                      >
                        {signed >= 0 ? "+" : "−"}
                        {formatCurrency(Math.abs(signed))}
                      </p>
                      <button
                        type="button"
                        onClick={() => void onDelete(tx)}
                        className="text-[11px] font-semibold text-chart-expense hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <Modal
            open={modalOpen}
            title={editing ? "Edit transaction" : "Add transaction"}
            onClose={() => setModalOpen(false)}
          >
            <form onSubmit={onSave}>
              <Field label="Title">
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </Field>
              <Field label="Amount">
                <input
                  className={inputClass}
                  type="number"
                  min="0.01"
                  step="any"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  required
                />
              </Field>
              <Field label="Type">
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      type: e.target.value as "income" | "expense",
                      categoryId: "",
                    }))
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </Field>
              <Field label="Category">
                <select
                  className={inputClass}
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, categoryId: e.target.value }))
                  }
                >
                  <option value="">None</option>
                  {typeCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Person (IOU)">
                <select
                  className={inputClass}
                  value={form.personId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, personId: e.target.value }))
                  }
                >
                  <option value="">None</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Savings account">
                <select
                  className={inputClass}
                  value={form.savingsAccountId}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      savingsAccountId: e.target.value,
                    }))
                  }
                >
                  <option value="">None</option>
                  {savings.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Note">
                <textarea
                  className={`${inputClass} min-h-[72px] resize-y`}
                  value={form.note}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, note: e.target.value }))
                  }
                  placeholder="Optional note (syncs with mobile)"
                />
              </Field>
              <Field label="Photo">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading || saving}
                  className="mb-2 block w-full text-[12px] text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-[12px] file:font-semibold file:text-primary"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    void onPhotoSelected(file)
                    e.target.value = ""
                  }}
                />
                {uploading && (
                  <p className="mb-2 text-[12px] text-muted">Uploading…</p>
                )}
                {form.photo ? (
                  <div className="relative overflow-hidden rounded-xl border border-border">
                    <img
                      src={form.photo}
                      alt="Attachment"
                      className="max-h-48 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, photo: "" }))}
                      className="absolute right-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-[11px] font-semibold text-white"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className="text-[12px] text-muted">
                    Optional receipt or photo (stored via imgbb link)
                  </p>
                )}
              </Field>
              {formError && (
                <p className="mb-2 text-[12px] text-chart-expense">{formError}</p>
              )}
              <FormActions
                onCancel={() => setModalOpen(false)}
                saving={saving || uploading}
              />
            </form>
          </Modal>
        </>
      }
    />
  )
}
