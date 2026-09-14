import type { LucideIcon } from 'lucide-react'
import {
  Smartphone,
  Monitor,
  Shield,
  LayoutDashboard,
  RefreshCw,
  WifiOff,
  PiggyBank,
  BarChart3,
  Wallet,
  Target,
} from 'lucide-react'
import { images } from '@/assets/images'

export const highlights = [
  {
    title: 'A clear dashboard',
    description:
      'See your balance, recent transactions, and money coming in and going out — all in one quick overview, without digging through multiple screens.',
    image: images.bills,
  },
  {
    title: 'Track income & expenses',
    description:
      'Record every transaction and organize spending into categories like food, shopping, transportation, bills, and entertainment.',
    image: images.shopping,
  },
  {
    title: 'Multiple wallets',
    description:
      'Separate cash, bank accounts, digital payments, and savings — each tracked individually while contributing to your total balance.',
    image: images.cash,
  },
  {
    title: 'Budgets & savings goals',
    description:
      'Set daily or monthly spending limits and save toward laptops, trips, emergency funds, or any target with visual progress.',
    image: images.winner,
  },
] as const

export const howItWorks = [
  {
    step: '01',
    title: 'Track your money',
    description:
      'Record income and expenses, organize transactions into categories, and manage multiple wallets from one clean dashboard.',
    image: images.flying,
  },
  {
    step: '02',
    title: 'Control your spending',
    description:
      'Set daily or monthly limits for categories like food or shopping, monitor your progress, and make better decisions before you overspend.',
    image: images.shopping,
  },
  {
    step: '03',
    title: 'Build your savings',
    description:
      'Create goals for anything you are working toward, add funds gradually, and watch your progress become visual and measurable.',
    image: images.winner,
  },
] as const

export interface PlatformPoint {
  title: string
  description: string
  icon: LucideIcon
}

export const platforms: {
  id: string
  title: string
  subtitle: string
  badge: string
  points: PlatformPoint[]
}[] = [
  {
    id: 'mobile',
    title: 'Mobile app',
    subtitle: 'Your everyday expense tracker — iOS & Android coming soon',
    badge: 'Coming soon',
    points: [
      {
        title: 'Offline first',
        description: 'Manage your finances without depending on a constant internet connection.',
        icon: WifiOff,
      },
      {
        title: 'Quick dashboard',
        description: 'Check your balance and recent activity as naturally as any everyday app.',
        icon: LayoutDashboard,
      },
      {
        title: 'Multiple wallets',
        description: 'Track cash, bank, digital payments, and savings separately in one place.',
        icon: Wallet,
      },
      {
        title: 'Savings goals',
        description: 'Set targets, add funds over time, and follow visual progress toward each goal.',
        icon: Target,
      },
    ],
  },
  {
    id: 'web',
    title: 'Web dashboard',
    subtitle: 'A bigger view of your money — coming soon',
    badge: 'Coming soon',
    points: [
      {
        title: 'Full overview',
        description: 'Review balances, wallets, and transaction history on a larger screen.',
        icon: Monitor,
      },
      {
        title: 'Budget monitoring',
        description: 'See spending limits and category progress at a glance.',
        icon: PiggyBank,
      },
      {
        title: 'Transaction history',
        description: 'Browse and understand where your money has been going over time.',
        icon: BarChart3,
      },
      {
        title: 'Cloud sync',
        description: 'Keep your records aligned across devices when you choose to sync.',
        icon: RefreshCw,
      },
    ],
  },
]

export const principles = [
  {
    title: 'Simple by design',
    description: 'No overwhelming charts, banking jargon, or features you will never use.',
    icon: LayoutDashboard,
  },
  {
    title: 'Offline first',
    description: 'A reliable personal tracker on your phone — no complicated bank integrations required.',
    icon: WifiOff,
  },
  {
    title: 'Not a banking app',
    description: 'YetiWize helps you manually understand and organize your money — it does not replace your bank.',
    icon: Shield,
  },
  {
    title: 'For everyday people',
    description: 'Built for students, professionals, freelancers, and anyone who wants better spending control.',
    icon: Smartphone,
  },
] as const

export const faqs = [
  {
    q: 'What is YetiWize?',
    a: 'YetiWize is a personal finance and expense tracking app built to make everyday money management simple and clear. It helps you track expenses, record income, manage wallets, control spending, and save toward goals — all from one friendly app.',
  },
  {
    q: 'Is YetiWize a bank?',
    a: 'No. YetiWize is not a banking app and does not try to replace your bank. It is a personal money management companion that helps you manually understand and organize your finances.',
  },
  {
    q: 'Who is YetiWize for?',
    a: 'YetiWize is especially useful for students, professionals, freelancers, small earners, and anyone who wants a simpler way to stay aware of their spending and gradually make smarter money decisions.',
  },
  {
    q: 'Does it work offline?',
    a: 'Yes. YetiWize is designed with an offline-first approach, so you can manage everyday financial records without needing a constant internet connection.',
  },
  {
    q: 'When does YetiWize launch?',
    a: 'YetiWize is coming soon on the App Store and Google Play. Join the wishlist on this page to get notified when we launch.',
  },
] as const
