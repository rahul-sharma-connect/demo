export const ONBOARDING_CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", symbol: "₹" },
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵", symbol: "₨" },
  { code: "ESP", name: "Spanish Peseta", flag: "🇪🇸", symbol: "Pts" },
] as const

export const ONBOARDING_LANGUAGES = [
  { value: "en", label: "English", native: "English" },
  { value: "ne", label: "Nepali", native: "नेपाली" },
  { value: "hi", label: "Hindi", native: "हिन्दी" },
  { value: "es", label: "Spanish", native: "Español" },
] as const

export type OnboardingStepId =
  | "welcome"
  | "name"
  | "currency"
  | "balances"
  | "finish"

export const ONBOARDING_STEPS: OnboardingStepId[] = [
  "welcome",
  "name",
  "currency",
  "balances",
  "finish",
]
