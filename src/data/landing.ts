import type { LucideIcon } from 'lucide-react'
import {
  Smartphone,
  Monitor,
  Shield,
  Sparkles,
  RefreshCw,
  WifiOff,
  Users,
  PiggyBank,
  BarChart3,
  Mic,
} from 'lucide-react'
import { images } from '@/assets/images'

export const highlights = [
  {
    title: 'Track every rupee',
    description: 'Income, expenses, notes, and photos—fast entry without the spreadsheet guilt.',
    image: images.bills,
  },
  {
    title: 'AI that actually helps',
    description: 'Soft insights that spot leaks, celebrate progress, and keep money calm.',
    image: images.thinking,
  },
  {
    title: 'Hit goals gently',
    description: 'Budgets, savings vaults, and milestones that grow with your habits.',
    image: images.winner,
  },
  {
    title: 'Friends & IOUs',
    description: 'Give, take, and settle with people you trust—balances stay clear.',
    image: images.cash,
  },
] as const

export const howItWorks = [
  {
    step: '01',
    title: 'Set up in minutes',
    description:
      'Pick your currency and language, set a starting balance, and meet your Yeti buddy.',
    image: images.flying,
  },
  {
    step: '02',
    title: 'Log life as it happens',
    description:
      'Add income or expenses with categories, notes, photos, or voice—offline first.',
    image: images.shopping,
  },
  {
    step: '03',
    title: 'See the full picture',
    description:
      'Budgets, cash flow, people, and reports sync to the web dashboard when you are ready.',
    image: images.thinking,
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
    subtitle: 'iOS & Android — coming soon',
    badge: 'Coming soon',
    points: [
      {
        title: 'Offline first',
        description: 'Log spends on the metro; sync when you reconnect.',
        icon: WifiOff,
      },
      {
        title: 'Voice & photos',
        description: 'Hold to record notes; attach receipts from camera or gallery.',
        icon: Mic,
      },
      {
        title: 'PIN & biometrics',
        description: 'Optional unlock so your money stays private on-device.',
        icon: Shield,
      },
      {
        title: 'People & savings',
        description: 'IOUs, vaults, and mood-aware Yeti home screen.',
        icon: Users,
      },
    ],
  },
  {
    id: 'web',
    title: 'Web dashboard',
    subtitle: 'Same cloud account — available now for early access',
    badge: 'Early access',
    points: [
      {
        title: 'Full overview',
        description: 'Balance, cash flow, budgets, and transaction history on a big screen.',
        icon: Monitor,
      },
      {
        title: 'Cloud sync',
        description: 'Bidirectional sync with the mobile app when it launches.',
        icon: RefreshCw,
      },
      {
        title: 'Budgets & people',
        description: 'Manage limits, friends, and playground accounts from the desktop.',
        icon: PiggyBank,
      },
      {
        title: 'Reports that stick',
        description: 'Charts and health signals you will actually want to check.',
        icon: BarChart3,
      },
    ],
  },
]

export const principles = [
  {
    title: 'Privacy-minded',
    description: 'We do not sell your financial data. Export or delete anytime.',
    icon: Shield,
  },
  {
    title: 'Offline capable',
    description: 'Your entries live on-device first, then sync encrypted when online.',
    icon: WifiOff,
  },
  {
    title: 'Soft AI insights',
    description: 'Helpful tips without shame—clarity over judgment.',
    icon: Sparkles,
  },
  {
    title: 'One account everywhere',
    description: 'Mobile and web share the same cloud profile and preferences.',
    icon: Smartphone,
  },
] as const

export const faqs = [
  {
    q: 'When does YetiWize launch?',
    a: 'The mobile apps are coming soon on the App Store and Google Play. The web dashboard is available now for early cloud accounts—sign up to get ready for launch.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. We do not sell personal financial data. Sync is encrypted in transit, and offline-first keeps entries on your device until you sync. Request export or deletion at hello@yetiwize.com.',
  },
  {
    q: 'Will mobile and web stay in sync?',
    a: 'Yes. One cloud account syncs settings, categories, people, budgets, transactions, and more across devices with soft deletes and last-write-wins conflict handling.',
  },
  {
    q: 'Which currencies and languages are supported?',
    a: 'Onboarding supports USD, EUR, GBP, JPY, INR, NPR, and more, plus English, Nepali, Hindi, and Spanish—with more to come.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. YetiWize is for personal finance tracking and clarity—not tax, investment, or professional financial advice.',
  },
] as const
