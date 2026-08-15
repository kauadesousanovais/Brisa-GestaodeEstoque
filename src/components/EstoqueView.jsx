import { useState } from 'react'
import { useData } from '../context/DataContext'
import { fmtBRL, fmtDate } from '../utils/format'
import { productById } from '../utils/calculations'
import PageHeader from './PageHeader'
import VialGauge from './VialGauge'
import NovoProdutoModal from './NovoProdutoModal'
import MovimentoModal from './MovimentoModal'
import { IconPlus } from './Icons'

export default function EstoqueView() {
  const { products, recentMovements } = useData()
  const [modal, setModal] = useState(null) // null | 'novo' | { tipo, product }

  const totalUnidades = products.reduce((s, p) => s + p.qtd, 0)
  const outOfStockCount = products.filter((p) => p.qtd <= 0).length
  const valorEstoque = products.reduce((s, p) => s + p.qtd * p.custo, 0)
  const recentMovs = recentMovements

  return (
    <>
      <PageHeader title="Estoque" subtitle="Itens disponíveis, entradas e saídas do estoque" />
      <div className="content">
        <div className="stat-row">
          <div className="card stat-card">
            <div className="stat-label">Itens em estoque</div>
            <div className="stat-value">{totalUnidades}</div>
            <div className="stat-delta">{products.length} produtos cadastrados</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Produtos esgotados</div>
            <div className={`stat-value ${outOfStockCount > 0 ? 'danger' : 'success'}`}>{outOfStockCount}</div>
            <div className="stat-delta">produtos sem unidades</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Valor em estoque</div>
            <div className="stat-value gold">{fmtBRL(valorEstoque)}</div>
            <div className="stat-delta">a preço de custo</div>
          </div>
        </div>

        <div className="section-head">
          <div className="section-title">Produtos</div>
          <button className="btn btn-primary btn-small" onClick={() => setModal('novo')}>
            <IconPlus /> Novo produto
          </button>
        </div>

        <div className="product-grid">
          {products.map((p) => {
            const low = p.qtd <= 0
            const percent = Math.min(1, p.qtd / 10)
            return (
              <div key={p.id} className={`card product-card ${low ? 'low' : ''}`}>
                {low && <span className="badge badge-low">Esgotado</span>}
                <div className="vial"><VialGauge percent={percent} low={low} /></div>
                <div className="product-info">
                  <div className="product-fam">{p.fragrancia || p.familia || 'Sem fragrância informada'}</div>
                  <div className="product-name">{p.nome}</div>
                  <div className="product-brand">{p.marca}{p.ml ? ' · ' + p.ml + 'ml' : ''}</div>
                  <div className="product-meta">
                    <div><span>Qtd.</span>{p.qtd} un.</div>
                    <div><span>Custo</span>{fmtBRL(p.custo)}</div>
                    <div><span>Venda</span>{fmtBRL(p.venda)}</div>
                  </div>
                  <div className="product-actions">
                    <button className="icon-btn" title="Registrar entrada" onClick={() => setModal({ tipo: 'entrada', product: p })}>
                      <IconPlus />
                    </button>
                    <button className="icon-btn" title="Registrar saída" onClick={() => setModal({ tipo: 'saida', product: p })}>
                      −
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {products.length === 0 && (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '44px 20px', color: 'var(--ink-faint)' }}>
            <p>Nenhum produto cadastrado ainda. Clique em "Novo produto" para começar.</p>
          </div>
        )}
        </div>

        <div className="section-head"><div className="section-title">Movimentações recentes</div></div>
        <div className="card table-card">
          <table>
            <thead>
              <tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Quantidade</th><th>Motivo</th><th>Valor</th></tr>
            </thead>
            <tbody>
              {recentMovs.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-faint)', padding: 24 }}>Nenhuma movimentação registrada.</td></tr>
              )}
              {recentMovs.map((m) => {
                const p = productById(products, m.produtoId)
                return (
                  <tr key={m.id}>
                    <td className="mono">{fmtDate(m.data)}</td>
                    <td className="strong">{p ? p.nome : '—'}</td>
                    <td><span className={`badge ${m.tipo === 'entrada' ? 'badge-in' : 'badge-out'}`}>{m.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span></td>
                    <td className="mono">{m.tipo === 'entrada' ? '+' : '−'}{m.qtd} un.</td>
                    <td>{m.motivo}</td>
                    <td className="mono">{fmtBRL(m.valorUnit * m.qtd)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal === 'novo' && <NovoProdutoModal onClose={() => setModal(null)} />}
      {modal && modal !== 'novo' && (
        <MovimentoModal product={modal.product} tipo={modal.tipo} onClose={() => setModal(null)} />
      )}
    </>
  )
}
