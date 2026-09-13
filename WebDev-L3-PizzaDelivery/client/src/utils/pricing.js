export const DELIVERY_FEE = 60

const nprFormatter = new Intl.NumberFormat('en-NP', {
  maximumFractionDigits: 0,
})

export const SIZE_SURCHARGES = {
  S: -100,
  M: 0,
  L: 100,
  XL: 200,
  '2XL': 300,
  '3XL': 400,
}

export function getPizzaPrice(basePrice, size = 'M') {
  return Number(basePrice || 0) + (SIZE_SURCHARGES[size] || 0)
}

export function formatNpr(value) {
  return `NRP. ${nprFormatter.format(Number(value) || 0)}`
}
