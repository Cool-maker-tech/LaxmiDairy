/** Money and text formatting helpers. */

const inr = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
})

/** 1234 -> "₹1,234" */
export function formatINR(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return `₹${inr.format(Math.round(value))}`
}

/** 1234 -> "1,234" */
export function formatNumber(value) {
  return inr.format(Math.round(value ?? 0))
}

/** Trim and collapse runs of whitespace. */
export const tidy = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()

/** "88663 30092" from "918866330092" for readable display. */
export function prettyPhone(digits) {
  const d = String(digits ?? '').replace(/\D/g, '').slice(-10)
  if (d.length !== 10) return digits
  return `${d.slice(0, 5)} ${d.slice(5)}`
}

export const cx = (...parts) => parts.filter(Boolean).join(' ')
