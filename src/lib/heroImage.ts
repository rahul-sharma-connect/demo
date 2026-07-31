import { images } from "@/assets/images"

export type HeroMoodKey =
  | "flying"
  | "winner"
  | "cash"
  | "thinking"
  | "sad"
  | "angry"
  | "food"
  | "travel"
  | "bills"
  | "shopping"
  | "loan"

const FOOD_ICONS = new Set(["food-apple", "hamburger", "pizza", "coffee"])
const TRAVEL_ICONS = new Set(["car", "airplane", "bus", "train", "taxi"])
const SHOPPING_ICONS = new Set(["cart", "shopping"])

const MOOD_IMAGES: Record<HeroMoodKey, string> = {
  flying: images.flying,
  winner: images.winner,
  cash: images.cash,
  thinking: images.thinking,
  sad: images.sad,
  angry: images.angry,
  food: images.food,
  travel: images.travel,
  bills: images.bills,
  shopping: images.shopping,
  loan: images.loan,
}

const MOOD_LABELS: Record<HeroMoodKey, string> = {
  flying: "Ready when you are",
  winner: "You're crushing it",
  cash: "Looking good",
  thinking: "Let's plan your next move",
  sad: "Balance needs a little love",
  angry: "Spending is running hot",
  food: "Food vibes lately",
  travel: "Adventure mode",
  bills: "Bills season",
  shopping: "Shopping spree energy",
  loan: "Loan watch",
}

export type HeroTxInput = {
  type: "income" | "expense"
  categoryName?: string | null
  categoryIcon?: string | null
  name?: string
}

function getCategoryMood(
  categoryName?: string | null,
  categoryIcon?: string | null,
  title?: string,
): HeroMoodKey | null {
  const name = `${categoryName ?? ""} ${title ?? ""}`.toLowerCase()
  const icon = categoryIcon ?? ""

  if (name.includes("food") || FOOD_ICONS.has(icon)) return "food"
  if (name.includes("travel") || TRAVEL_ICONS.has(icon)) return "travel"
  if (name.includes("rent") || name.includes("bill") || icon === "home")
    return "bills"
  if (name.includes("shop") || SHOPPING_ICONS.has(icon)) return "shopping"
  if (name.includes("loan") || icon === "bank") return "loan"

  return null
}

/** Same priority rules as the mobile home Yeti mood. */
export function getHomeHeroMood({
  balance,
  transactions,
  income,
  expense,
}: {
  balance: number
  transactions: HeroTxInput[]
  income: number
  expense: number
}): { key: HeroMoodKey; src: string; label: string } {
  if (balance < 0) {
    const key: HeroMoodKey = expense > income * 2 ? "angry" : "sad"
    return { key, src: MOOD_IMAGES[key], label: MOOD_LABELS[key] }
  }

  if (balance === 0) {
    return {
      key: "thinking",
      src: MOOD_IMAGES.thinking,
      label: MOOD_LABELS.thinking,
    }
  }

  const recentExpense = transactions.find((tx) => tx.type === "expense")
  if (recentExpense) {
    const mood = getCategoryMood(
      recentExpense.categoryName,
      recentExpense.categoryIcon,
      recentExpense.name,
    )
    if (mood) {
      return { key: mood, src: MOOD_IMAGES[mood], label: MOOD_LABELS[mood] }
    }
  }

  const recentIncome = transactions.find((tx) => tx.type === "income")
  if (recentIncome && !recentExpense) {
    const key: HeroMoodKey = balance > 1000 ? "winner" : "cash"
    return { key, src: MOOD_IMAGES[key], label: MOOD_LABELS[key] }
  }

  if (income > expense && balance > 0) {
    return { key: "cash", src: MOOD_IMAGES.cash, label: MOOD_LABELS.cash }
  }

  return { key: "flying", src: MOOD_IMAGES.flying, label: MOOD_LABELS.flying }
}
