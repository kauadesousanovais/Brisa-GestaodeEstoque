import { useState } from 'react'
import Modal from './Modal'
import { useData } from '../context/DataContext'
import { fmtBRL, todayISO } from '../utils/format'

export default function VendaModal({ onClose }) {
  const { products, registerSale } = useData()
  const [produtoId, setProdutoId] = useState(products[0]?.id || '')
  const [data, setData] = useState(todayISO())
  const [qtd, setQtd] = useState(1)
  const [valor, setValor] = useState(products[0]?.venda || 0)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const produto = products.find((p) => p.id === produtoId)

  function handleProdutoChange(e) {
    const id = e.target.value
    setProdutoId(id)
    const p = products.find((x) => x.id === id)
    if (p) setValor(p.venda)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!produto) return
    let q = Number(qtd)
    q = Math.min(q, produto.qtd || q)
    if (q <= 0) { setError('Informe uma quantidade válida.'); return }
    setSaving(true)
    setError('')
    try {
      await registerSale(produto, q, data, Number(valor))
      onClose()
    } catch (err) {
      setError('Não foi possível salvar: ' + err.message)
      setSaving(false)
    }
  }

  if (products.length === 0) return null

  return (
    <Modal onClose={onClose}>
      <div className="modal-title">Registrar venda</div>
      <div className="modal-sub">A quantidade vendida é descontada do estoque automaticamente</div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Produto</label>
          <select value={produtoId} onChange={handleProdutoChange}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.nome} ({p.qtd} un.)</option>
            ))}
          </select>
        </div>
        <div className="modal-row">
          <div className="field">
            <label>Data da venda</label>
            <input type="date" required value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div className="field">
            <label>Quantidade</label>
            <input type="number" min="1" required value={qtd} onChange={(e) => setQtd(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Valor unitário (R$)</label>
          <input type="number" step="0.01" min="0" value={valor} onChange={(e) => setValor(e.target.value)} />
        </div>
        {produto && (
          <div className="field-hint">
            Estoque disponível: {produto.qtd} un. · custo: {fmtBRL(produto.custo)}
          </div>
        )}
        {error && <div className="field-hint" style={{ color: 'var(--danger-soft)' }}>{error}</div>}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando…' : 'Registrar venda'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
