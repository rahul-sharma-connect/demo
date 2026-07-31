const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001"

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type AuthUser = {
  id: string
  email: string
  displayName: string | null
}

type RequestOptions = {
  method?: string
  body?: unknown
  token?: string | null
  skipAuth?: boolean
}

let refreshHandler: (() => Promise<string | null>) | null = null

export function setRefreshHandler(handler: (() => Promise<string | null>) | null) {
  refreshHandler = handler
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (!options.skipAuth && options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? (options.body ? "POST" : "GET"),
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (res.status === 401 && !options.skipAuth && refreshHandler) {
    const next = await refreshHandler()
    if (next) {
      return apiRequest<T>(path, { ...options, token: next })
    }
  }

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? "Request failed")
  }
  return data as T
}

export const authApi = {
  register: (body: {
    email: string
    password: string
    displayName?: string
  }) =>
    apiRequest<AuthTokens & { user: AuthUser }>("/auth/register", {
      method: "POST",
      body,
      skipAuth: true,
    }),
  login: (body: { email: string; password: string }) =>
    apiRequest<AuthTokens & { user: AuthUser }>("/auth/login", {
      method: "POST",
      body,
      skipAuth: true,
    }),
  refresh: (refreshToken: string) =>
    apiRequest<AuthTokens & { user: AuthUser }>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      skipAuth: true,
    }),
  logout: (accessToken: string, refreshToken?: string) =>
    apiRequest<void>("/auth/logout", {
      method: "POST",
      body: { refreshToken },
      token: accessToken,
    }),
}

export const usersApi = {
  me: (token: string) =>
    apiRequest<AuthUser & { createdAt: string; updatedAt: string }>(
      "/users/me",
      { token },
    ),
  updateMe: (token: string, body: { displayName?: string | null }) =>
    apiRequest<AuthUser>("/users/me", {
      method: "PATCH",
      body,
      token,
    }),
}

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "ytd"

export type Category = {
  id: string
  userId: string
  name: string
  icon: string
  color: string
  type: string
  updatedAt: string
  deletedAt: string | null
}

export type Person = {
  id: string
  userId: string
  name: string
  phone: string | null
  note: string | null
  updatedAt: string
  deletedAt: string | null
}

export type SavingAccount = {
  id: string
  userId: string
  name: string
  balance: number
  goal: number
  icon: string
  color: string
  updatedAt: string
  deletedAt: string | null
}

export type Budget = {
  id: string
  userId: string
  categoryId: string
  dailyLimit: number | null
  monthlyLimit: number | null
  isEnforced: boolean
  updatedAt: string
  deletedAt: string | null
}

export type Transaction = {
  id: string
  userId: string
  title: string
  amount: number
  type: string
  categoryId: string | null
  personId: string | null
  savingsAccountId: string | null
  note: string | null
  attachment: string | null
  icon: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type Settings = {
  id: string
  userId: string
  theme: string
  language: string
  currency: string
  onboardingCompleted: boolean
  balance: number
  allowNegativeBalance: boolean
  homeInputMode: string
  updatedAt: string
  deletedAt: string | null
}

export type PlaygroundTransaction = {
  id: string
  userId: string
  accountId: string
  title: string
  amount: number
  type: string
  note: string | null
  icon: string | null
  categoryName: string | null
  categoryColor: string | null
  attachment: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type PlaygroundAccount = {
  id: string
  userId: string
  name: string
  type: string
  balance: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  transactions?: PlaygroundTransaction[]
}

export function newId() {
  return crypto.randomUUID()
}

export function parseTxAttachment(attachment: string | null | undefined): {
  photo: string | null
  voiceUri: string | null
} {
  if (!attachment) return { photo: null, voiceUri: null }
  try {
    const parsed = JSON.parse(attachment) as {
      photo?: string | null
      voiceUri?: string | null
    }
    return {
      photo: parsed.photo ?? null,
      voiceUri: parsed.voiceUri ?? null,
    }
  } catch {
    return { photo: null, voiceUri: null }
  }
}

export function serializeTxAttachment(
  photo?: string | null,
  voiceUri?: string | null,
): string | null {
  if (!photo && !voiceUri) return null
  return JSON.stringify({ photo: photo ?? null, voiceUri: voiceUri ?? null })
}

export const uploadsApi = {
  image: (token: string, imageBase64: string, name?: string) =>
    apiRequest<{ url: string; deleteUrl: string | null }>("/uploads/image", {
      method: "POST",
      token,
      body: { imageBase64, name },
    }),
}

export const categoriesApi = {
  list: (token: string) =>
    apiRequest<Category[]>("/categories", { token }),
  upsert: (
    token: string,
    id: string,
    body: {
      name: string
      icon: string
      color: string
      type: "income" | "expense"
    },
  ) =>
    apiRequest<Category>(`/categories/${id}`, {
      method: "PUT",
      body,
      token,
    }),
  remove: (token: string, id: string) =>
    apiRequest<Category>(`/categories/${id}`, {
      method: "DELETE",
      token,
    }),
}

export const peopleApi = {
  list: (token: string) => apiRequest<Person[]>("/people", { token }),
  upsert: (
    token: string,
    id: string,
    body: { name: string; phone?: string | null; note?: string | null },
  ) =>
    apiRequest<Person>(`/people/${id}`, { method: "PUT", body, token }),
  remove: (token: string, id: string) =>
    apiRequest<Person>(`/people/${id}`, { method: "DELETE", token }),
}

export const savingAccountsApi = {
  list: (token: string) =>
    apiRequest<SavingAccount[]>("/saving-accounts", { token }),
  upsert: (
    token: string,
    id: string,
    body: {
      name: string
      balance?: number
      goal?: number
      icon?: string
      color?: string
    },
  ) =>
    apiRequest<SavingAccount>(`/saving-accounts/${id}`, {
      method: "PUT",
      body,
      token,
    }),
  remove: (token: string, id: string) =>
    apiRequest<SavingAccount>(`/saving-accounts/${id}`, {
      method: "DELETE",
      token,
    }),
}

export const budgetsApi = {
  list: (token: string) => apiRequest<Budget[]>("/budgets", { token }),
  upsert: (
    token: string,
    id: string,
    body: {
      categoryId: string
      dailyLimit?: number | null
      monthlyLimit?: number | null
      isEnforced?: boolean
    },
  ) =>
    apiRequest<Budget>(`/budgets/${id}`, { method: "PUT", body, token }),
  remove: (token: string, id: string) =>
    apiRequest<Budget>(`/budgets/${id}`, { method: "DELETE", token }),
}

export const transactionsApi = {
  list: (token: string, opts?: { limit?: number; offset?: number }) => {
    const params = new URLSearchParams()
    if (opts?.limit != null) params.set("limit", String(opts.limit))
    if (opts?.offset != null) params.set("offset", String(opts.offset))
    const q = params.toString()
    return apiRequest<Transaction[]>(
      `/transactions${q ? `?${q}` : ""}`,
      { token },
    )
  },
  upsert: (
    token: string,
    id: string,
    body: {
      title: string
      amount: number
      type: "income" | "expense"
      categoryId?: string | null
      personId?: string | null
      savingsAccountId?: string | null
      note?: string | null
      attachment?: string | null
      icon?: string | null
      createdAt: string
    },
  ) =>
    apiRequest<Transaction>(`/transactions/${id}`, {
      method: "PUT",
      body,
      token,
    }),
  remove: (token: string, id: string) =>
    apiRequest<Transaction>(`/transactions/${id}`, {
      method: "DELETE",
      token,
    }),
}

export const playgroundApi = {
  listAccounts: (token: string) =>
    apiRequest<PlaygroundAccount[]>("/playground-accounts", { token }),
  upsertAccount: (
    token: string,
    id: string,
    body: {
      name: string
      type: "money" | "zero"
      balance?: number
      createdAt: string
    },
  ) =>
    apiRequest<PlaygroundAccount>(`/playground-accounts/${id}`, {
      method: "PUT",
      body,
      token,
    }),
  removeAccount: (token: string, id: string) =>
    apiRequest<PlaygroundAccount>(`/playground-accounts/${id}`, {
      method: "DELETE",
      token,
    }),
  upsertTransaction: (
    token: string,
    id: string,
    body: {
      accountId: string
      title: string
      amount: number
      type: "income" | "expense"
      note?: string | null
      icon?: string | null
      categoryName?: string | null
      categoryColor?: string | null
      createdAt: string
    },
  ) =>
    apiRequest<PlaygroundTransaction>(`/playground-transactions/${id}`, {
      method: "PUT",
      body,
      token,
    }),
  removeTransaction: (token: string, id: string) =>
    apiRequest<PlaygroundTransaction>(`/playground-transactions/${id}`, {
      method: "DELETE",
      token,
    }),
}

export const settingsApi = {
  get: (token: string) => apiRequest<Settings>("/settings", { token }),
  patch: (
    token: string,
    body: Partial<{
      theme: string
      language: string
      currency: string
      onboardingCompleted: boolean
      balance: number
      allowNegativeBalance: boolean
      homeInputMode: string
    }>,
  ) =>
    apiRequest<Settings>("/settings", {
      method: "PATCH",
      body,
      token,
    }),
}

export const analyticsApi = {
  overview: (token: string, period: AnalyticsPeriod | string = "30d") =>
    apiRequest<{
      balance: number
      period: string
      income: number
      expenses: number
      saved: number
      changes: { income: number; expenses: number; saved: number }
    }>(`/analytics/overview?period=${period}`, { token }),
  weekly: (token: string, period: AnalyticsPeriod | string = "7d") =>
    apiRequest<{
      balance: number
      period: string
      weeklyChart: Array<{
        day: string
        savings: number
        income: number
        expenses: number
        idle: number
        total: number
      }>
    }>(`/analytics/weekly?period=${period}`, { token }),
  costBreakdown: (token: string, period: AnalyticsPeriod | string = "30d") =>
    apiRequest<{
      total: number
      period: string
      costCategories: Array<{
        name: string
        percent: number
        color: string
        amount: number
      }>
    }>(`/analytics/cost-breakdown?period=${period}`, { token }),
  spendingLimit: (token: string) =>
    apiRequest<{ spent: number; limit: number }>(
      "/analytics/spending-limit",
      { token },
    ),
  goals: (token: string) =>
    apiRequest<{
      goals: Array<{
        id: string
        name: string
        current: number
        target: number
        left: string
        color?: string
        icon?: string
      }>
    }>("/analytics/goals", { token }),
  recentTransactions: (token: string) =>
    apiRequest<{
      transactions: Array<{
        id: string
        initials: string
        color: string
        name: string
        date: string
        amount: number
        type: "income" | "expense"
        categoryName: string | null
        categoryIcon: string | null
        status: "Completed" | "Declined"
      }>
    }>("/analytics/transactions/recent", { token }),
  financialHealth: (token: string, period: AnalyticsPeriod | string = "30d") =>
    apiRequest<{ amount: number; change: number; percentSaved: number }>(
      `/analytics/financial-health?period=${period}`,
      { token },
    ),
}
