import { useState } from 'react'
import { useData } from '../context/DataContext'
import { fmtBRL, fmtDate, MONTHS, ALL_MONTHS } from '../utils/format'
import {
  salesByMonth, monthlyRevenue, monthlyProfit, productById,
} from '../utils/calculations'
import PageHeader from './PageHeader'
import VendaModal from './VendaModal'
import VendasChart from './VendasChart'
import { IconPlus } from './Icons'

export default function VendasView({ activeMonth, setActiveMonth }) {
  const { products, sales } = useData()
  const [showModal, setShowModal] = useState(false)

  const monthSales = salesByMonth(sales, activeMonth)
  const revenue = monthlyRevenue(sales, activeMonth)
  const profit = monthlyProfit(sales, products, activeMonth)
  const unitsSold = monthSales.reduce((s, x) => s + x.qtd, 0)

  return (
    <>
      <PageHeader title="Vendas & Lucros" subtitle="Vendas realizadas e lucro obtido, organizados por mês" />
      <div className="content">
        <div className="card chart-card">
          <div className="section-title-sm">Lucro por mês</div>
          <div className="section-title">Evolução de lucros com vendas</div>
          <div className="chart-wrap"><VendasChart months={ALL_MONTHS} sales={sales} products={products} /></div>
        </div>

        <div className="month-tabs">
          {MONTHS.map((m, i) => {
            const count = salesByMonth(sales, i).length
            return (
              <button
                key={m}
                className={`month-tab ${activeMonth === i ? 'active' : ''}`}
                onClick={() => setActiveMonth(i)}
              >
                {m}<span className="count">{count ? `· ${count}` : ''}</span>
              </button>
            )
          })}
        </div>

        <div className="stat-row">
          <div className="card stat-card">
            <div className="stat-label">Unidades vendidas</div>
            <div className="stat-value">{unitsSold}</div>
            <div className="stat-delta">em {MONTHS[activeMonth]}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Receita do mês</div>
            <div className="stat-value gold">{fmtBRL(revenue)}</div>
            <div className="stat-delta">{monthSales.length} vendas registradas</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Lucro do mês</div>
            <div className="stat-value success">{fmtBRL(profit)}</div>
            <div className="stat-delta">receita − custo dos produtos</div>
          </div>
        </div>

        <div className="section-head">
          <div className="section-title">Vendas de {MONTHS[activeMonth]}</div>
          <button className="btn btn-primary btn-small" onClick={() => setShowModal(true)}>
            <IconPlus /> Registrar venda
          </button>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr><th>Data</th><th>Produto</th><th>Qtd.</th><th>Valor unit.</th><th>Total</th><th>Lucro</th></tr>
            </thead>
            <tbody>
              {monthSales.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-faint)', padding: 24 }}>
                  Nenhuma venda registrada em {MONTHS[activeMonth]}.
                </td></tr>
              )}
              {monthSales.map((s) => {
                const p = productById(products, s.produtoId)
                const lucro = (s.valorUnit - (p ? p.custo : 0)) * s.qtd
                return (
                  <tr key={s.id}>
                    <td className="mono">{fmtDate(s.data)}</td>
                    <td className="strong">{p ? p.nome : '—'}</td>
                    <td className="mono">{s.qtd} un.</td>
                    <td className="mono">{fmtBRL(s.valorUnit)}</td>
                    <td className="mono strong">{fmtBRL(s.valorUnit * s.qtd)}</td>
                    <td className="mono" style={{ color: 'var(--success-soft)' }}>{fmtBRL(lucro)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <VendaModal onClose={() => setShowModal(false)} />}
    </>
  )
}
