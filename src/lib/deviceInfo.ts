export type DeviceInfo = {
  userAgent: string
  language: string
  languages: string[]
  timezone: string
  timezoneOffsetMinutes: number
  platform: string
  vendor: string
  screen: {
    width: number
    height: number
    availWidth: number
    availHeight: number
    colorDepth: number
    pixelRatio: number
  }
  viewport: {
    width: number
    height: number
  }
  hardwareConcurrency: number | null
  maxTouchPoints: number
  cookieEnabled: boolean
  online: boolean
  referrer: string
  pageUrl: string
  connection: {
    effectiveType: string | null
    downlink: number | null
    rtt: number | null
    saveData: boolean | null
  } | null
}

export function collectDeviceInfo(): DeviceInfo {
  const nav = navigator
  const conn = (
    nav as Navigator & {
      connection?: {
        effectiveType?: string
        downlink?: number
        rtt?: number
        saveData?: boolean
      }
    }
  ).connection

  let timezone = 'unknown'
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    /* ignore */
  }

  return {
    userAgent: nav.userAgent,
    language: nav.language,
    languages: [...(nav.languages ?? [nav.language])],
    timezone,
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
    platform: nav.platform,
    vendor: nav.vendor,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    hardwareConcurrency: nav.hardwareConcurrency ?? null,
    maxTouchPoints: nav.maxTouchPoints ?? 0,
    cookieEnabled: nav.cookieEnabled,
    online: nav.onLine,
    referrer: document.referrer || '',
    pageUrl: window.location.href,
    connection: conn
      ? {
          effectiveType: conn.effectiveType ?? null,
          downlink: conn.downlink ?? null,
          rtt: conn.rtt ?? null,
          saveData: conn.saveData ?? null,
        }
      : null,
  }
}
