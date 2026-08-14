import { useData } from '../context/DataContext'
import { fmtBRL, MONTHS, ALL_MONTHS } from '../utils/format'
import { monthlyRevenue, monthlyCost } from '../utils/calculations'
import PageHeader from './PageHeader'
import BalancoChart from './BalancoChart'

export default function BalancoView() {
  const { movements, sales } = useData()
  const monthsIdx = ALL_MONTHS

  const totalRev = monthsIdx.reduce((s, i) => s + monthlyRevenue(sales, i), 0)
  const totalCost = monthsIdx.reduce((s, i) => s + monthlyCost(movements, i), 0)
  const totalSaldo = totalRev - totalCost

  return (
    <>
      <PageHeader title="Balanço" subtitle="Comparativo entre entradas e gastos com base no estoque" />
      <div className="content">
        <div className="stat-row">
          <div className="card stat-card">
            <div className="stat-label">Total de entradas (receita)</div>
            <div className="stat-value success">{fmtBRL(totalRev)}</div>
            <div className="stat-delta">vendas realizadas no período</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Total de gastos</div>
            <div className="stat-value danger">{fmtBRL(totalCost)}</div>
            <div className="stat-delta">compras de reposição de estoque</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Saldo final</div>
            <div className={`stat-value ${totalSaldo >= 0 ? 'success' : 'danger'}`}>{fmtBRL(totalSaldo)}</div>
            <div className="stat-delta">receita − gastos</div>
          </div>
        </div>

        <div className="card chart-card">
          <div className="section-title-sm">Entradas vs. gastos</div>
          <div className="section-title">Balanço mensal do estoque</div>
          <div className="chart-wrap"><BalancoChart months={monthsIdx} sales={sales} movements={movements} /></div>
        </div>

        <div className="section-head"><div className="section-title">Detalhamento por mês</div></div>
        <div className="card">
          <table>
            <thead><tr><th>Mês</th><th>Entradas</th><th>Gastos</th><th>Saldo</th></tr></thead>
            <tbody>
              {monthsIdx.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-faint)', padding: 24 }}>Sem dados suficientes ainda.</td></tr>
              )}
              {monthsIdx.map((i) => {
                const rev = monthlyRevenue(sales, i)
                const cost = monthlyCost(movements, i)
                const saldo = rev - cost
                return (
                  <tr key={i}>
                    <td className="strong">{MONTHS[i]}</td>
                    <td className="mono" style={{ color: 'var(--success-soft)' }}>{fmtBRL(rev)}</td>
                    <td className="mono" style={{ color: 'var(--danger-soft)' }}>{fmtBRL(cost)}</td>
                    <td className={`mono strong ${saldo >= 0 ? 'balance-pos' : 'balance-neg'}`}>
                      {saldo >= 0 ? '+' : ''}{fmtBRL(saldo)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {monthsIdx.length > 0 && (
              <tfoot>
                <tr>
                  <td className="strong">Total</td>
                  <td className="mono strong" style={{ color: 'var(--success-soft)' }}>{fmtBRL(totalRev)}</td>
                  <td className="mono strong" style={{ color: 'var(--danger-soft)' }}>{fmtBRL(totalCost)}</td>
                  <td className={`mono strong ${totalSaldo >= 0 ? 'balance-pos' : 'balance-neg'}`}>{fmtBRL(totalSaldo)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </>
  )
}
