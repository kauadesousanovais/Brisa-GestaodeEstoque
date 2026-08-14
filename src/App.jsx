import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { DataProvider, useData } from './context/DataContext'
import { isFirebaseConfigured } from './firebase'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import EstoqueView from './components/EstoqueView'
import VendasView from './components/VendasView'
import BalancoView from './components/BalancoView'

function ConfigWarning() {
  if (isFirebaseConfigured) return null
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: '#B14A45', color: '#FFFFFF', fontFamily: 'Work Sans, sans-serif',
      fontSize: 13, fontWeight: 600, textAlign: 'center', padding: '10px 16px',
    }}>
    </div>
  )
}

function LoadingScreen({ label = 'Carregando…' }) {
  return (
    <div className="login-screen">
      <div style={{ color: 'var(--ink-faint)', fontSize: 13 }}>{label}</div>
    </div>
  )
}

function MainApp({ userEmail }) {
  const [view, setView] = useState('estoque')
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
  const { loading } = useData()

  if (loading) return <LoadingScreen label="Carregando dados do Firestore…" />

  return (
    <div className="shell">
      <Sidebar view={view} setView={setView} userEmail={userEmail} />
      <main className="main">
        {view === 'estoque' && <EstoqueView />}
        {view === 'vendas' && <VendasView activeMonth={activeMonth} setActiveMonth={setActiveMonth} />}
        {view === 'balanco' && <BalancoView />}
      </main>
    </div>
  )
}

export default function App() {
  const user = useAuth()

  return (
    <>
      {user === undefined && <LoadingScreen />}
      {user === null && <Login />}
      {user && (
        <DataProvider>
          <MainApp userEmail={user.email} />
        </DataProvider>
      )}
    </>
  )
}
