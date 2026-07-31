import { useEffect } from "react"

const DEFAULT_INTERVAL_MS = 30_000

/**
 * Call `onRefresh` when the tab becomes visible and on an interval while visible.
 */
export function useLiveRefresh(
  onRefresh: () => void | Promise<void>,
  intervalMs = DEFAULT_INTERVAL_MS,
) {
  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setInterval> | null = null

    const run = () => {
      if (cancelled) return
      void Promise.resolve(onRefresh())
    }

    const startPolling = () => {
      if (timer) return
      timer = setInterval(() => {
        if (document.visibilityState === "visible") run()
      }, intervalMs)
    }

    const stopPolling = () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        run()
        startPolling()
      } else {
        stopPolling()
      }
    }

    const onFocus = () => run()

    if (document.visibilityState === "visible") startPolling()
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("focus", onFocus)

    return () => {
      cancelled = true
      stopPolling()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("focus", onFocus)
    }
  }, [onRefresh, intervalMs])
}
