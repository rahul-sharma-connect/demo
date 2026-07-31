export const balanceOverview = {
  balance: 12450,
  period: "7d",
}

export const weeklyChart = [
  { day: "Sun", savings: 0, income: 0, expenses: 0, idle: 320, total: 320 },
  { day: "Mon", savings: 150, income: 430, expenses: 280, idle: 0, total: 860 },
  { day: "Tue", savings: 0, income: 0, expenses: 0, idle: 280, total: 280 },
  { day: "Wed", savings: 0, income: 0, expenses: 0, idle: 400, total: 400 },
  { day: "Thu", savings: 0, income: 0, expenses: 0, idle: 350, total: 350 },
  { day: "Fri", savings: 0, income: 0, expenses: 0, idle: 260, total: 260 },
  { day: "Sat", savings: 0, income: 0, expenses: 0, idle: 300, total: 300 },
]

export const summaryStats = [
  { label: "Total income", value: 15000, change: 5.1, positive: true },
  { label: "Total expenses", value: 6700, change: -15.5, positive: false },
  { label: "Saved balance", value: 8300, change: 20.7, positive: true },
]

export const spendingLimit = {
  spent: 8600,
  limit: 10000,
}

export const costCategories = [
  { name: "Housing", percent: 18, color: "#66BB6A" },
  { name: "Debt payments", percent: 7, color: "#FF8A65" },
  { name: "Food", percent: 6, color: "#F5C542" },
  { name: "Transportation", percent: 9, color: "#4DB6AC" },
  { name: "Healthcare", percent: 10, color: "#9575CD" },
  { name: "Investments", percent: 17, color: "#4CAF50" },
  { name: "Other", percent: 33, color: "#BDBDBD" },
]

export const financialHealth = {
  amount: 15780,
  change: 17.5,
  percentSaved: 75,
}

export const goals = [
  {
    id: "reserve",
    name: "Reserve",
    current: 7000,
    target: 10000,
    left: "Left to save 4 months",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=80&h=80&fit=crop",
  },
  {
    id: "travel",
    name: "Travel",
    current: 4200,
    target: 8000,
    left: "Left to save 6 months",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80&h=80&fit=crop",
  },
  {
    id: "car",
    name: "Car",
    current: 12500,
    target: 25000,
    left: "Left to save 14 months",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=80&h=80&fit=crop",
  },
  {
    id: "estate",
    name: "Real Estate",
    current: 48000,
    target: 120000,
    left: "Left to save 3 years",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=80&h=80&fit=crop",
  },
]

export const cardInfo = {
  number: "xxxx xxxx xxxx 7890",
  name: "Yousuf H Faysal",
  expiry: "09/28",
  brand: "VISA",
}

export const quickPayments = [
  { name: "Davis", initials: "DA", color: "#66BB6A" },
  { name: "Elli", initials: "EL", color: "#FF8A65" },
  { name: "Leo", initials: "LE", color: "#5C6BC0" },
  { name: "Maya", initials: "MA", color: "#26A69A" },
  { name: "Sam", initials: "SA", color: "#EC407A" },
]

export const transactions = [
  {
    id: "1",
    initials: "TD",
    color: "#66BB6A",
    name: "Dividend payout",
    date: "25 Feb 2025",
    amount: 1100,
    status: "Completed" as const,
  },
  {
    id: "2",
    initials: "SF",
    color: "#5C6BC0",
    name: "Subscriptions",
    date: "24 Feb 2025",
    amount: -49.99,
    status: "Completed" as const,
  },
  {
    id: "3",
    initials: "WL",
    color: "#FF8A65",
    name: "Wire transfer",
    date: "23 Feb 2025",
    amount: -850,
    status: "Declined" as const,
  },
  {
    id: "4",
    initials: "AM",
    color: "#F5C542",
    name: "Amazon refund",
    date: "22 Feb 2025",
    amount: 64.2,
    status: "Completed" as const,
  },
  {
    id: "5",
    initials: "GR",
    color: "#26A69A",
    name: "Grocery Mart",
    date: "21 Feb 2025",
    amount: -128.4,
    status: "Completed" as const,
  },
  {
    id: "6",
    initials: "PY",
    color: "#9575CD",
    name: "Payroll deposit",
    date: "20 Feb 2025",
    amount: 3200,
    status: "Completed" as const,
  },
]

export const userProfile = {
  name: "Yousuf H Faysal",
  email: "yousuf@yetiwise.app",
  initials: "YF",
}

export { formatMoney as formatCurrency } from "../lib/format"
