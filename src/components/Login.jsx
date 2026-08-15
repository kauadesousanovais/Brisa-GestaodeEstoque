import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { IconBrisaMark } from './Icons'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass)
    } catch (err) {
      setError('E-mail ou senha incorretos.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-mark">
          <IconBrisaMark size={40} />
          <div className="login-brand">Brisa</div>
          <div className="login-brand-sub">Perfumes de Ambientes</div>
          <div className="login-sub">Acesso restrito · Administração</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email" type="email" autoComplete="username" required
              placeholder="admin@sualoja.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="pass">Senha</label>
            <input
              id="pass" type="password" autoComplete="current-password" required
              placeholder="••••••••"
              value={pass} onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Entrando…' : 'Entrar no sistema'}
          </button>
          <div className="login-error">{error}</div>
        </form>
      </div>
    </div>
  )
}
