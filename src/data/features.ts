import type { LucideIcon } from 'lucide-react'
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  Target,
  Landmark,
  RefreshCw,
  WifiOff,
  Cloud,
  BarChart3,
  Tags,
  Layers,
  History,
  Moon,
  FileSpreadsheet,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react'

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
  category: 'track' | 'plan' | 'sync' | 'insights'
  featured?: boolean
}

export const features: Feature[] = [
  {
    title: 'Expense Tracking',
    description: 'Record everyday spending quickly and see exactly where your money is going.',
    icon: Wallet,
    category: 'track',
    featured: true,
  },
  {
    title: 'Income Tracking',
    description: 'Log salary, freelance work, and other income alongside your expenses.',
    icon: TrendingUp,
    category: 'track',
  },
  {
    title: 'Category Organization',
    description: 'Sort transactions into food, shopping, transportation, bills, entertainment, and more.',
    icon: Tags,
    category: 'track',
  },
  {
    title: 'Multiple Wallets',
    description: 'Keep separate wallets for cash, bank accounts, digital payments, and savings.',
    icon: Layers,
    category: 'track',
    featured: true,
  },
  {
    title: 'Transaction History',
    description: 'Review past income and expenses whenever you need a clearer picture.',
    icon: History,
    category: 'track',
  },
  {
    title: 'Recurring Transactions',
    description: 'Track regular bills, rent, subscriptions, and other repeating payments.',
    icon: RefreshCw,
    category: 'track',
  },
  {
    title: 'Budget Limits',
    description: 'Set daily or monthly spending limits for categories and monitor your progress.',
    icon: PiggyBank,
    category: 'plan',
    featured: true,
  },
  {
    title: 'Savings Goals',
    description: 'Save toward a laptop, trip, emergency fund, or any target with visual progress.',
    icon: Target,
    category: 'plan',
  },
  {
    title: 'Savings Vaults',
    description: 'Add funds gradually and watch your goals become measurable over time.',
    icon: Landmark,
    category: 'plan',
  },
  {
    title: 'Balance Overview',
    description: 'See your current balance and how much is coming in versus going out.',
    icon: LayoutDashboard,
    category: 'insights',
  },
  {
    title: 'Spending Patterns',
    description: 'Notice where money may be disappearing and adjust before you overspend.',
    icon: BarChart3,
    category: 'insights',
  },
  {
    title: 'Offline First',
    description: 'Manage records on your phone without needing constant internet access.',
    icon: WifiOff,
    category: 'sync',
  },
  {
    title: 'Cloud Sync',
    description: 'Optional sync to keep your records available across devices.',
    icon: Cloud,
    category: 'sync',
  },
  {
    title: 'Export CSV',
    description: 'Export your data anytime for personal records or analysis.',
    icon: FileSpreadsheet,
    category: 'sync',
  },
  {
    title: 'Data Privacy',
    description: 'Your financial records stay yours — we do not sell your personal data.',
    icon: ShieldCheck,
    category: 'sync',
  },
  {
    title: 'Dark Mode',
    description: 'A modern, friendly interface designed for comfortable everyday use.',
    icon: Moon,
    category: 'sync',
  },
]

export const featureGroups = [
  {
    id: 'track' as const,
    label: 'Track & organize',
    description: 'Record income and expenses and keep every wallet in one place.',
  },
  {
    id: 'plan' as const,
    label: 'Control & save',
    description: 'Set spending limits and work toward goals that matter to you.',
  },
  {
    id: 'sync' as const,
    label: 'Reliable & private',
    description: 'Offline-first tracking with optional sync and data you control.',
  },
  {
    id: 'insights' as const,
    label: 'Understand',
    description: 'Simple overviews that help you stay aware without overwhelm.',
  },
] as const

export const featuredFeatures = features.filter((f) => f.featured)
