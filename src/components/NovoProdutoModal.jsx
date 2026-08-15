import { useState } from 'react'
import Modal from './Modal'
import { useData } from '../context/DataContext'

const EMPTY = { nome: '', marca: '', fragrancia: '', ml: '', custo: '', venda: '', qtd: '' }

export default function NovoProdutoModal({ onClose }) {
  const { addProduct } = useData()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await addProduct({
        nome: form.nome.trim(),
        marca: form.marca.trim(),
        fragrancia: form.fragrancia.trim(),
        ml: form.ml === '' ? null : Number(form.ml),
        custo: Number(form.custo),
        venda: Number(form.venda),
        qtd: Number(form.qtd),
      })
      onClose()
    } catch (err) {
      setError('Não foi possível salvar: ' + err.message)
      setSaving(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="modal-title">Novo produto</div>
      <div className="modal-sub">Cadastre um novo perfume no estoque</div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Nome do produto</label>
          <input required placeholder="Ex: Fleur de Nuit" value={form.nome} onChange={update('nome')} />
        </div>
        <div className="modal-row">
          <div className="field">
            <label>Marca</label>
            <input required placeholder="Ex: Maison Cardeal" value={form.marca} onChange={update('marca')} />
          </div>
          <div className="field">
            <label>Fragrância (opcional)</label>
            <input placeholder="Ex: Lavanda" value={form.fragrancia} onChange={update('fragrancia')} />
          </div>
        </div>
        <div className="modal-row">
          <div className="field">
            <label>Volume (ml) (opcional)</label>
            <input type="number" min="1" placeholder="100" value={form.ml} onChange={update('ml')} />
          </div>
        </div>
        <div className="modal-row">
          <div className="field">
            <label>Preço de custo (R$)</label>
            <input type="number" step="0.01" min="0" required placeholder="0,00" value={form.custo} onChange={update('custo')} />
          </div>
          <div className="field">
            <label>Preço de venda (R$)</label>
            <input type="number" step="0.01" min="0" required placeholder="0,00" value={form.venda} onChange={update('venda')} />
          </div>
        </div>
        <div className="field">
          <label>Quantidade inicial</label>
          <input type="number" min="0" required placeholder="0" value={form.qtd} onChange={update('qtd')} />
        </div>
        {error && <div className="field-hint" style={{ color: 'var(--danger-soft)' }}>{error}</div>}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Salvando…' : 'Cadastrar produto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
