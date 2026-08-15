export function productById(products, id) {
  return products.find((p) => p.id === id)
}

const dateParts = (iso) => {
  const [year, month] = String(iso || '').split('-').map(Number)
  return { year, monthIdx: month - 1 }
}

const inPeriod = (iso, monthIdx, year) => {
  const parts = dateParts(iso)
  return parts.monthIdx === monthIdx && parts.year === year
}

export function salesByMonth(sales, monthIdx, year) {
  return sales
    .filter((s) => inPeriod(s.data, monthIdx, year))
    .sort((a, b) => a.data.localeCompare(b.data))
}

export function yearsWithData(sales, movements) {
  const currentYear = new Date().getFullYear()
  const recentYears = Array.from({ length: 10 }, (_, index) => currentYear - index)
  const dataYears = [...sales, ...movements]
    .map((item) => dateParts(item.data).year)
    .filter(Number.isInteger)
  return [...new Set([...recentYears, ...dataYears])].sort((a, b) => b - a)
}

export function monthlyRevenue(sales, monthIdx, year) {
  return salesByMonth(sales, monthIdx, year)
    .reduce((sum, sale) => sum + sale.valorUnit * sale.qtd, 0)
}

export function saleUnitCost(sale, products) {
  if (Number.isFinite(sale.custoUnit)) return sale.custoUnit
  return Number(productById(products, sale.produtoId)?.custo) || 0
}

export function monthlyProfit(sales, products, monthIdx, year) {
  return salesByMonth(sales, monthIdx, year).reduce(
    (sum, sale) => sum + (sale.valorUnit - saleUnitCost(sale, products)) * sale.qtd,
    0,
  )
}

const COST_REASONS = new Set([
  'Cadastro inicial de produto',
  'Compra de fornecedor',
  'Reposição de estoque',
  'Entrada de estoque',
])

export function movementIsCost(movement) {
  if (typeof movement.contabilizaGasto === 'boolean') return movement.contabilizaGasto
  return COST_REASONS.has(movement.motivo)
}

export function monthlyCost(movements, monthIdx, year) {
  return movements
    .filter((movement) =>
      movement.tipo === 'entrada'
      && movementIsCost(movement)
      && inPeriod(movement.data, monthIdx, year))
    .reduce((sum, movement) => sum + movement.valorUnit * movement.qtd, 0)
}