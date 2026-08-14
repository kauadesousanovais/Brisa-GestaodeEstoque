export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
export const ALL_MONTHS = MONTHS.map((_, i) => i)

export const fmtBRL = (n) =>
  (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const fmtDate = (iso) => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export const monthOf = (iso) => parseInt(iso.split('-')[1], 10) - 1

export const todayISO = () => new Date().toISOString().slice(0, 10)
