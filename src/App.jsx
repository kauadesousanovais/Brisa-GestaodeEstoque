import { lazy, Suspense, useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { DataProvider, useData } from './context/DataContext'
import Login from './components/Login'
import Sidebar from './components/Sidebar'

const EstoqueView = lazy(() => import('./components/EstoqueView'))
const VendasView = lazy(() => import('./components/VendasView'))
const BalancoView = lazy(() => import('./components/BalancoView'))

function LoadingScreen({ label = 'Carregando…' }) {
  return (
    <div className="login-screen">
      <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>{label}</div>
    </div>
  )
}

function DataError({ error }) {
  return (
    <div className="data-error card">
      <h2>Não foi possível carregar os dados</h2>
      <p>{error?.message || 'Verifique sua conexão e as permissões do Firestore.'}</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>
        Tentar novamente
      </button>
    </div>
  )
}

function MainApp({
  userEmail, activeYear, setActiveYear,
}) {
  const [view, setView] = useState('estoque')
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
  const { loading, error } = useData()

  if (loading) return <LoadingScreen label="Carregando dados do Firestore…" />
  if (error) return <DataError error={error} />

  return (
    <div className="shell">
      <Sidebar view={view} setView={setView} userEmail={userEmail} />
      <main className="main">
        <Suspense fallback={<LoadingScreen label="Carregando tela…" />}>
          {view === 'estoque' && <EstoqueView />}
          {view === 'vendas' && (
            <VendasView
              activeMonth={activeMonth}
              setActiveMonth={setActiveMonth}
              activeYear={activeYear}
              setActiveYear={setActiveYear}
            />
          )}
          {view === 'balanco' && (
            <BalancoView activeYear={activeYear} setActiveYear={setActiveYear} />
          )}
        </Suspense>
      </main>
    </div>
  )
}

export default function App() {
  const user = useAuth()
  const [activeYear, setActiveYear] = useState(new Date().getFullYear())

  return (
    <>
      {user === undefined && <LoadingScreen />}
      {user === null && <Login />}
      {user && (
        <DataProvider year={activeYear}>
          <MainApp
            userEmail={user.email}
            activeYear={activeYear}
            setActiveYear={setActiveYear}
          />
        </DataProvider>
      )}
    </>
  )
}