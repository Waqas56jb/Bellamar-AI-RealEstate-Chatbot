import { useEffect, useState } from 'react'
import { api, tokenStore } from './api'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Training from './pages/Training'
import Settings from './pages/Settings'

const PAGES = {
  dashboard: Dashboard,
  leads: Leads,
  training: Training,
  settings: Settings,
}

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [page, setPage] = useState('dashboard')

  // Validate any stored token on load.
  useEffect(() => {
    if (!tokenStore.get()) {
      setChecking(false)
      return
    }
    api
      .verify()
      .then(() => setAuthed(true))
      .catch(() => tokenStore.clear())
      .finally(() => setChecking(false))
  }, [])

  const handleLogout = () => {
    tokenStore.clear()
    setAuthed(false)
    setPage('dashboard')
  }

  if (checking) {
    return <div className="boot">Loading…</div>
  }

  if (!authed) {
    return <Login onLoggedIn={() => setAuthed(true)} />
  }

  const Page = PAGES[page] || Dashboard

  return (
    <Layout page={page} onNavigate={setPage} onLogout={handleLogout}>
      <Page />
    </Layout>
  )
}
