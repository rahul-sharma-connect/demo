export function formatMoney(
  n: number,
  currency = "USD",
  compact = false,
): string {
  const code = currency || "USD"
  try {
    if (compact) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
        maximumFractionDigits: 0,
      }).format(n)
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: n % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(n)
  } catch {
    return `${code} ${n.toFixed(2)}`
  }
}

export function initialsFrom(name: string, email = ""): string {
  const source = name.trim() || email
  const parts = source.split(/[\s@]+/).filter(Boolean)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

export const PEOPLE_COLORS = [
  "#66BB6A",
  "#FF8A65",
  "#5C6BC0",
  "#26A69A",
  "#EC407A",
  "#F5C542",
  "#9575CD",
]

export function colorForId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i) * 17) % 7
  return PEOPLE_COLORS[hash] ?? PEOPLE_COLORS[0]
}
