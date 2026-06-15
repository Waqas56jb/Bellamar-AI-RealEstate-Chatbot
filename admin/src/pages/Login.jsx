import { useState } from 'react'
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { api, tokenStore } from '../api'

export default function Login({ onLoggedIn }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await api.login(password)
      tokenStore.set(token)
      onLoggedIn()
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={submit}>
        <div className="login__logo"><img src="/logo.png" alt="Bellamar" /></div>
        <h1 className="login__title">Bellamar Admin</h1>
        <p className="login__subtitle">
          <ShieldCheck size={14} /> Secure chatbot control panel
        </p>

        <div className="login__field">
          <Lock size={17} />
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
        </div>

        {error && <p className="login__error">{error}</p>}

        <button className="login__btn" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : <>Sign In <ArrowRight size={17} /></>}
        </button>
      </form>
    </div>
  )
}
