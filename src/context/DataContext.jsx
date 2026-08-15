import { createContext, useContext } from 'react'
import {
  collection, doc, runTransaction, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useCollection } from '../hooks/useCollection'
import { todayISO } from '../utils/format'

const DataContext = createContext(null)

const positiveInteger = (value, label) => {
  const number = Number(value)
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(label + ' deve ser um número inteiro maior que zero.')
  }
  return number
}

const nonNegativeMoney = (value, label) => {
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(label + ' deve ser um valor válido e não negativo.')
  }
  return number
}

export function DataProvider({ children, year }) {
  const period = {
    start: year + '-01-01',
    end: year + '-12-31',
  }
  const productsQuery = useCollection('produtos', 'nome', 'asc')
  const movementsQuery = useCollection('movimentacoes', 'data', 'desc', period)
  const recentMovementsQuery = useCollection('movimentacoes', 'criadoEm', 'desc', { maxResults: 12 })
  const salesQuery = useCollection('vendas', 'data', 'desc', period)

  const loading = productsQuery.loading || movementsQuery.loading || salesQuery.loading
  const error = productsQuery.error || movementsQuery.error || recentMovementsQuery.error || salesQuery.error

  async function addProduct(novo) {
    const product = {
      nome: String(novo.nome || '').trim(),
      marca: String(novo.marca || '').trim(),
      fragrancia: String(novo.fragrancia || '').trim(),
      ml: novo.ml === null || novo.ml === '' ? null : positiveInteger(novo.ml, 'Volume'),
      custo: nonNegativeMoney(novo.custo, 'Preço de custo'),
      venda: nonNegativeMoney(novo.venda, 'Preço de venda'),
      qtd: Number(novo.qtd),
    }
    if (!product.nome || !product.marca) throw new Error('Nome e marca são obrigatórios.')
    if (!Number.isInteger(product.qtd) || product.qtd < 0) {
      throw new Error('Quantidade inicial deve ser um número inteiro não negativo.')
    }

    const batch = writeBatch(db)
    const productRef = doc(collection(db, 'produtos'))
    batch.set(productRef, { ...product, criadoEm: serverTimestamp() })
    if (product.qtd > 0) {
      batch.set(doc(collection(db, 'movimentacoes')), {
        data: todayISO(),
        produtoId: productRef.id,
        tipo: 'entrada',
        qtd: product.qtd,
        motivo: 'Cadastro inicial de produto',
        valorUnit: product.custo,
        contabilizaGasto: true,
        criadoEm: serverTimestamp(),
      })
    }
    await batch.commit()
  }

  async function changeStock({ product, tipo, qtd, data = todayISO(), motivo, valorUnit }) {
    if (!product?.id) throw new Error('Produto inválido.')
    if (tipo !== 'entrada' && tipo !== 'saida') throw new Error('Tipo de movimentação inválido.')
    const quantity = positiveInteger(qtd, 'Quantidade')
    const unitValue = nonNegativeMoney(valorUnit, 'Valor unitário')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) throw new Error('Data inválida.')

    await runTransaction(db, async (transaction) => {
      const productRef = doc(db, 'produtos', product.id)
      const snapshot = await transaction.get(productRef)
      if (!snapshot.exists()) throw new Error('Produto não encontrado.')

      const current = snapshot.data()
      const currentQty = Number(current.qtd) || 0
      if (tipo === 'saida' && currentQty < quantity) {
        throw new Error('Estoque insuficiente. Disponível: ' + currentQty + ' un.')
      }

      transaction.update(productRef, {
        qtd: currentQty + (tipo === 'entrada' ? quantity : -quantity),
      })
      transaction.set(doc(collection(db, 'movimentacoes')), {
        data,
        produtoId: product.id,
        tipo,
        qtd: quantity,
        motivo: tipo === 'entrada' ? motivo : 'Venda balcão',
        valorUnit: unitValue,
        contabilizaGasto: tipo === 'entrada',
        criadoEm: serverTimestamp(),
      })

      if (tipo === 'saida') {
        transaction.set(doc(collection(db, 'vendas')), {
          data,
          produtoId: product.id,
          qtd: quantity,
          valorUnit: unitValue,
          custoUnit: nonNegativeMoney(current.custo, 'Custo do produto'),
          criadoEm: serverTimestamp(),
        })
      }
    })
  }

  const registerMovement = (product, tipo, qtd, motivo, valorUnit) =>
    changeStock({ product, tipo, qtd, motivo, valorUnit })

  const registerSale = (product, qtd, data, valorUnit) =>
    changeStock({ product, tipo: 'saida', qtd, data, motivo: 'Venda balcão', valorUnit })

  const value = {
    products: productsQuery.data,
    movements: movementsQuery.data,
    recentMovements: recentMovementsQuery.data,
    sales: salesQuery.data,
    loading,
    error,
    addProduct,
    registerMovement,
    registerSale,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData precisa estar dentro de <DataProvider>')
  return ctx
}
