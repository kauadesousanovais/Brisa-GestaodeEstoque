import { useEffect, useState } from 'react'
import {
  collection, limit as firestoreLimit, onSnapshot, orderBy, query, where,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useCollection(name, orderField, direction = 'asc', options = {}) {
  const { start, end, maxResults } = options
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const constraints = []
    if (start !== undefined) constraints.push(where(orderField, '>=', start))
    if (end !== undefined) constraints.push(where(orderField, '<=', end))
    constraints.push(orderBy(orderField, direction))
    if (maxResults) constraints.push(firestoreLimit(maxResults))

    const q = query(collection(db, name), ...constraints)
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((document) => ({ id: document.id, ...document.data() })))
        setError(null)
        setLoading(false)
      },
      (err) => {
        console.error('Erro ao carregar "' + name + '":', err)
        setError(err)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [name, orderField, direction, start, end, maxResults])

  return { data, loading, error }
}