import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'


export function useCollection(name, orderField, direction = 'asc') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, name), orderBy(orderField, direction))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error(`Erro ao carregar "${name}":`, err)
        setError(err)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [name, orderField, direction])

  return { data, loading, error }
}
