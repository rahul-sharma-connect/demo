import { useEffect, useState, type ReactNode } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

type DashboardLayoutProps = {
  main: ReactNode
  right?: ReactNode
}

export function DashboardLayout({ main, right }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)")
    const apply = () => setCollapsed(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  return (
    <div className="relative flex min-h-screen bg-mist">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-24 left-1/3 h-[380px] w-[380px] rounded-full bg-sky-200/40 blur-[100px]" />
        <div className="absolute top-1/2 -right-20 h-[320px] w-[320px] rounded-full bg-blue-200/30 blur-[110px]" />
      </div>

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Header />

        <div className="flex flex-1 flex-col gap-4 px-5 pb-8 lg:flex-row lg:gap-5 lg:px-6">
          <main className="min-w-0 flex-1 space-y-4">{main}</main>
          {right != null && (
            <aside className="w-full shrink-0 space-y-4 xl:w-[300px]">
              {right}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
