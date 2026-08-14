import { monthOf } from './format'

export function productById(products, id) {
  return products.find((p) => p.id === id)
}

export function salesByMonth(sales, monthIdx) {
  return sales
    .filter((s) => monthOf(s.data) === monthIdx)
    .sort((a, b) => a.data.localeCompare(b.data))
}

export function monthsWithData(sales, movements) {
  const set = new Set([
    ...sales.map((s) => monthOf(s.data)),
    ...movements.map((m) => monthOf(m.data)),
  ])
  return [...set].sort((a, b) => a - b)
}

export function monthlyRevenue(sales, monthIdx) {
  return salesByMonth(sales, monthIdx).reduce((sum, s) => sum + s.valorUnit * s.qtd, 0)
}

export function monthlyProfit(sales, products, monthIdx) {
  return salesByMonth(sales, monthIdx).reduce((sum, s) => {
    const p = productById(products, s.produtoId)
    return sum + (s.valorUnit - (p ? p.custo : 0)) * s.qtd
  }, 0)
}

export function monthlyCost(movements, monthIdx) {
  return movements
    .filter((m) => m.tipo === 'entrada' && monthOf(m.data) === monthIdx)
    .reduce((sum, m) => sum + m.valorUnit * m.qtd, 0)
}
