import { useState } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Waves,
  PieChart,
  TrendingUp,
  Users,
  FlaskConical,
  BookOpen,
  Headphones,
  PanelLeftClose,
  PanelLeft,
  Zap,
  X,
} from "lucide-react"
import { images } from "@/assets/images"

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Accounts", icon: Wallet, to: "/accounts" },
  { label: "Transactions", icon: ArrowLeftRight, to: "/transactions" },
  { label: "Cash flow", icon: Waves, to: "/cash-flow" },
  { label: "Budget", icon: PieChart, to: "/budget" },
  { label: "People", icon: Users, to: "/people" },
  { label: "Playground", icon: FlaskConical, to: "/playground" },
  { label: "Investments", icon: TrendingUp, to: null },
]

const secondaryNav = [
  { label: "Learning center", icon: BookOpen },
  { label: "Support", icon: Headphones },
]

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [showPromo, setShowPromo] = useState(true)

  return (
    <aside
      className={`sticky top-0 z-20 flex h-screen shrink-0 flex-col border-r border-sky-100/80 bg-white/80 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-5 ${collapsed ? "justify-center" : ""}`}
      >
        <img
          src={images.icon}
          alt=""
          className="h-9 w-9 shrink-0 rounded-xl object-cover shadow-sm shadow-primary/20"
          aria-hidden="true"
        />
        {!collapsed && (
          <span className="font-display text-[15px] font-bold tracking-tight text-ink">
            Yeti
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Wize
            </span>
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 scroll-thin">
        <ul className="flex flex-col gap-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon
            if (!item.to) {
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    title={`${item.label} (coming soon)`}
                    disabled
                    className={`flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium text-muted/60 ${
                      collapsed ? "justify-center px-0" : ""
                    }`}
                  >
                    <Icon
                      className="h-[18px] w-[18px] shrink-0"
                      strokeWidth={1.75}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                </li>
              )
            }
            return (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors ${
                      isActive
                        ? "bg-[#F0F1F3] text-ink"
                        : "text-muted hover:bg-[#F7F8FA] hover:text-ink"
                    } ${collapsed ? "justify-center px-0" : ""}`
                  }
                >
                  <Icon
                    className="h-[18px] w-[18px] shrink-0"
                    strokeWidth={1.75}
                  />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <div
          className={`my-4 border-t border-border ${collapsed ? "mx-1" : ""}`}
        />

        <ul className="flex flex-col gap-0.5">
          {secondaryNav.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.label}>
                <button
                  type="button"
                  title={`${item.label} (coming soon)`}
                  disabled
                  className={`flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium text-muted/60 ${
                    collapsed ? "justify-center px-0" : ""
                  }`}
                >
                  <Icon
                    className="h-[18px] w-[18px] shrink-0"
                    strokeWidth={1.75}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {!collapsed && showPromo && (
        <div className="mx-3 mb-3 rounded-2xl bg-[#F0F1F3] p-3.5">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                <Zap className="h-3.5 w-3.5 text-primary" fill="currentColor" />
              </div>
              <span className="text-[13px] font-semibold text-ink">
                Upgrade to Pro!
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPromo(false)}
              className="text-muted hover:text-ink"
              aria-label="Dismiss promo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mb-3 text-[11px] leading-relaxed text-muted">
            Unlock advanced insights, unlimited goals, and priority support.
          </p>
          <button
            type="button"
            className="w-full rounded-lg bg-ink py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Upgrade now
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        className={`mb-4 mx-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-[#F7F8FA] hover:text-ink ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {collapsed ? (
          <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
        ) : (
          <>
            <PanelLeftClose className="h-[18px] w-[18px]" strokeWidth={1.75} />
            <span>Collapse sidebar</span>
          </>
        )}
      </button>
    </aside>
  )
}
