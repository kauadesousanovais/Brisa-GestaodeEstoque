import { useState } from 'react'
import Modal from './Modal'
import { useData } from '../context/DataContext'

export default function MovimentoModal({ product, tipo, onClose }) {
  const { registerMovement } = useData()
  const isEntrada = tipo === 'entrada'
  const [qtd, setQtd] = useState('')
  const [valor, setValor] = useState(isEntrada ? product.custo : product.venda)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const q = Number(qtd)
    if (!Number.isInteger(q) || q <= 0) { setError('Informe uma quantidade válida.'); return }
    if (!isEntrada && q > product.qtd) { setError('Estoque insuficiente. Disponível: ' + product.qtd + ' un.'); return }
    setSaving(true)
    setError('')
    try {
      await registerMovement(product, tipo, q, isEntrada ? 'Entrada de estoque' : 'Venda balcão', Number(valor))
      onClose()
    } catch (err) {
      setError('Não foi possível salvar: ' + err.message)
      setSaving(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="modal-title">{isEntrada ? 'Registrar entrada' : 'Registrar saída'}</div>
      <div className="modal-sub">{product.nome} · estoque atual: {product.qtd} un.</div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Quantidade</label>
          <input
            type="number" min="1" max={!isEntrada ? product.qtd : undefined} required
            placeholder="0" value={qtd} onChange={(e) => setQtd(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Valor unitário (R$)</label>
          <input type="number" step="0.01" min="0" value={valor} onChange={(e) => setValor(e.target.value)} />
        </div>
        {!isEntrada && <div className="field-hint">Quantidade máxima disponível: {product.qtd} un.</div>}
        {error && <div className="field-hint" style={{ color: 'var(--danger-soft)' }}>{error}</div>}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando…' : isEntrada ? 'Registrar entrada' : 'Registrar saída'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
