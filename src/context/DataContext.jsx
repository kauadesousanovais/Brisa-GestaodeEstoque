import { createContext, useContext } from 'react'
import {
  addDoc, collection, doc, increment, serverTimestamp, updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useCollection } from '../hooks/useCollection'
import { todayISO } from '../utils/format'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { data: products, loading: loadingProducts } = useCollection('produtos', 'nome', 'asc')
  const { data: movements, loading: loadingMovements } = useCollection('movimentacoes', 'data', 'desc')
  const { data: sales, loading: loadingSales } = useCollection('vendas', 'data', 'desc')

  const loading = loadingProducts || loadingMovements || loadingSales

  async function addProduct(novo) {
    const ref = await addDoc(collection(db, 'produtos'), { ...novo, criadoEm: serverTimestamp() })
    if (novo.qtd > 0) {
      await addDoc(collection(db, 'movimentacoes'), {
        data: todayISO(),
        produtoId: ref.id,
        tipo: 'entrada',
        qtd: novo.qtd,
        motivo: 'Cadastro inicial de produto',
        valorUnit: novo.custo,
        criadoEm: serverTimestamp(),
      })
    }
  }

  async function registerMovement(product, tipo, qtd, motivo, valorUnit) {
    await updateDoc(doc(db, 'produtos', product.id), {
      qtd: increment(tipo === 'entrada' ? qtd : -qtd),
    })
    await addDoc(collection(db, 'movimentacoes'), {
      data: todayISO(),
      produtoId: product.id,
      tipo,
      qtd,
      motivo,
      valorUnit,
      criadoEm: serverTimestamp(),
    })
  }

  async function registerSale(product, qtd, data, valorUnit) {
    await addDoc(collection(db, 'vendas'), {
      data, produtoId: product.id, qtd, valorUnit, criadoEm: serverTimestamp(),
    })
    await updateDoc(doc(db, 'produtos', product.id), { qtd: increment(-qtd) })
    await addDoc(collection(db, 'movimentacoes'), {
      data,
      produtoId: product.id,
      tipo: 'saida',
      qtd,
      motivo: 'Venda balcão',
      valorUnit,
      criadoEm: serverTimestamp(),
    })
  }

  const value = {
  products, movements, sales, loading,
  addProduct, registerMovement, registerSale,
}

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData precisa estar dentro de <DataProvider>')
  return ctx
}
