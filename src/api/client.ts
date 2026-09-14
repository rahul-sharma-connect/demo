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

export type PushTargetType = "self" | "user" | "all" | "topic"

export type ScheduledNotification = {
  id: string
  userId: string
  title: string
  body: string
  data: Record<string, unknown> | null
  scheduledAt: string
  status: string
  targetType: PushTargetType
  targetUserId: string | null
  topic: string | null
  sentAt: string | null
  sendResult: unknown
  createdAt: string
  updatedAt: string
}

export type RecurrenceType = "daily" | "weekly" | "monthly"

export type RecurringNotification = {
  id: string
  userId: string
  title: string
  body: string
  data: Record<string, unknown> | null
  recurrence: RecurrenceType
  timezone: string
  nextRunAt: string
  endsAt: string | null
  status: string
  targetType: PushTargetType
  targetUserId: string | null
  topic: string | null
  lastSentAt: string | null
  lastSendResult: unknown
  createdAt: string
  updatedAt: string
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
  register: (body: { email: string; password: string; displayName?: string }) =>
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
    apiRequest<AuthUser & { createdAt: string; updatedAt: string }>("/users/me", {
      token,
    }),
}

export type NotificationPayload = {
  title: string
  body: string
  data?: Record<string, string | number | boolean>
  targetType: PushTargetType
  targetUserId?: string
  topic?: string
}

export type RegisteredDevice = {
  id: string
  token: string
  platform: string
  userName: string | null
  osVersion: string | null
  manufacturer: string | null
  model: string | null
  screenWidth: number | null
  screenHeight: number | null
  screenDensity: number | null
  appVersion: string | null
  appInstallTime: string | null
  appUpdateTime: string | null
  deviceLanguage: string | null
  timezone: string | null
  architecture: string | null
  packageName: string | null
  createdAt: string | null
  lastSeenAt: string | null
  profileRegisteredAt: string | null
}

export const devicesApi = {
  listProfiles: (token: string) =>
    apiRequest<RegisteredDevice[]>("/devices/profiles", { token }),
}

export type FeedbackTopic = "feature" | "bug" | "improvement" | "other"

export type FeedbackRecord = {
  id: string
  topic: FeedbackTopic
  message: string
  deviceId: string | null
  deviceTokenPreview: string | null
  platform: string | null
  appVersion: string | null
  userName: string | null
  status: string
  createdAt: string | null
  device: RegisteredDevice | null
}

export const feedbackApi = {
  list: (token: string) => apiRequest<FeedbackRecord[]>("/feedback", { token }),
}

export type AnalyticsSummary = {
  totalEvents: number
  totalBatches: number
  sessionStarts: number
  topScreens: { name: string; count: number }[]
  topButtons: { name: string; count: number }[]
  exitScreens: { name: string; count: number }[]
}

export type AnalyticsEvent = {
  type: "screen_view" | "button_click" | "app_background" | "session_start"
  screen?: string
  button?: string
  lastScreen?: string
  at?: string
}

export type AnalyticsBatchRecord = {
  id: string
  sessionId: string
  sentAt: string
  receivedAt: string | null
  platform: string | null
  appVersion: string | null
  userName: string | null
  deviceId: string | null
  eventCount: number
  events: AnalyticsEvent[]
}

export const analyticsApi = {
  summary: (token: string) =>
    apiRequest<AnalyticsSummary>("/analytics/summary", { token }),
  batches: (token: string, limit = 50) =>
    apiRequest<AnalyticsBatchRecord[]>(`/analytics/batches?limit=${limit}`, { token }),
}

export type WishlistPlatform = "ios" | "android" | "both"

export const notificationsApi = {
  send: (token: string, body: NotificationPayload) =>
    apiRequest<{ ok: boolean; sent?: number; failed?: number; messageId?: string }>(
      "/notifications/send",
      { method: "POST", body, token },
    ),
  schedule: (
    token: string,
    body: NotificationPayload & { scheduledAt: string },
  ) =>
    apiRequest<ScheduledNotification>("/notifications/schedule", {
      method: "POST",
      body,
      token,
    }),
  listScheduled: (token: string) =>
    apiRequest<ScheduledNotification[]>("/notifications/scheduled", { token }),
  cancelScheduled: (token: string, id: string) =>
    apiRequest<ScheduledNotification>(`/notifications/scheduled/${id}`, {
      method: "DELETE",
      token,
    }),
  createRecurring: (
    token: string,
    body: NotificationPayload & {
      recurrence: RecurrenceType
      startsAt: string
      endsAt?: string | null
      timezone?: string
    },
  ) =>
    apiRequest<RecurringNotification>("/notifications/recurring", {
      method: "POST",
      body,
      token,
    }),
  listRecurring: (token: string) =>
    apiRequest<RecurringNotification[]>("/notifications/recurring", { token }),
  cancelRecurring: (token: string, id: string) =>
    apiRequest<RecurringNotification>(`/notifications/recurring/${id}`, {
      method: "DELETE",
      token,
    }),
}
