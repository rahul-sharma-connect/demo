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
  Sparkles,
  Tags,
  Layers,
  LineChart,
  Moon,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react'

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

export const features: Feature[] = [
  {
    title: 'Expense Tracking',
    description: 'Capture every rupee with lightning-fast entry and smart receipts.',
    icon: Wallet,
  },
  {
    title: 'Income Tracking',
    description: 'Monitor salary, side hustles, and irregular income in one view.',
    icon: TrendingUp,
  },
  {
    title: 'Budget Planning',
    description: 'Flexible envelopes that adapt as your month unfolds.',
    icon: PiggyBank,
  },
  {
    title: 'Goals',
    description: 'Set milestones for travel, emergency funds, and big purchases.',
    icon: Target,
  },
  {
    title: 'Savings',
    description: 'Automatic savings rules that quietly grow your nest egg.',
    icon: Landmark,
  },
  {
    title: 'Recurring Transactions',
    description: 'Never miss rent, EMIs, or subscriptions again.',
    icon: RefreshCw,
  },
  {
    title: 'Offline First',
    description: 'Log spends on the metro—sync when you reconnect.',
    icon: WifiOff,
  },
  {
    title: 'Cloud Sync',
    description: 'Encrypted sync across phone, tablet, and desktop.',
    icon: Cloud,
  },
  {
    title: 'Financial Reports',
    description: 'Beautiful monthly and yearly reports you will actually read.',
    icon: BarChart3,
  },
  {
    title: 'AI Insights',
    description: 'Personalized tips that spot leaks and celebrate progress.',
    icon: Sparkles,
  },
  {
    title: 'Smart Categories',
    description: 'AI that learns your habits and categorizes with precision.',
    icon: Tags,
  },
  {
    title: 'Multiple Wallets',
    description: 'Cash, cards, UPI, and investment accounts—unified.',
    icon: Layers,
  },
  {
    title: 'Net Worth',
    description: 'Assets minus liabilities with a clear growth trajectory.',
    icon: LineChart,
  },
  {
    title: 'Dark Mode',
    description: 'A calm night theme designed for late-night money checks.',
    icon: Moon,
  },
  {
    title: 'Export CSV',
    description: 'Your data, your rules—export anytime for taxes or analysis.',
    icon: FileSpreadsheet,
  },
  {
    title: 'Data Privacy',
    description: 'End-to-end encryption. We never sell your financial data.',
    icon: ShieldCheck,
  },
]
