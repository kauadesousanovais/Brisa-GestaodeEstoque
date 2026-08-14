import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { IconEstoque, IconVendas, IconBalanco, IconBrisaMark } from './Icons'

const NAV_ITEMS = [
  { key: 'estoque', label: 'Estoque', Icon: IconEstoque },
  { key: 'vendas', label: 'Vendas & Lucros', Icon: IconVendas },
  { key: 'balanco', label: 'Balanço', Icon: IconBalanco },
]

export default function Sidebar({ view, setView, userEmail }) {
  return (
    <aside className="sidebar">
      <div className="side-brand">
        <IconBrisaMark size={26} />
        <div className="side-brand-text">
          <span className="side-brand-script">Brisa</span>
          <span className="side-brand-caps">Perfumes de Ambientes</span>
          <span className="side-brand-tag">Gestão de Estoque</span>
        </div>
      </div>

      <div className="nav-eyebrow">Painel</div>
      <nav className="side-nav">
        {NAV_ITEMS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`nav-item ${view === key ? 'active' : ''}`}
            onClick={() => setView(key)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="side-footer">
        <div className="side-admin">
          <span className="dot" /> {userEmail || 'Administrador'}
        </div>
        <button className="side-logout" onClick={() => signOut(auth)}>
          Sair do sistema
        </button>
      </div>
    </aside>
  )
}
