import { useEffect, useState } from 'react'
import { api } from '../api'

const CARDS = [
  { key: 'totalLeads', label: 'Total Leads', icon: '👥' },
  { key: 'leadsLast7Days', label: 'Leads (7 days)', icon: '📈' },
  { key: 'totalConversations', label: 'Conversations', icon: '💬' },
  { key: 'totalMessages', label: 'Messages', icon: '✉️' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.stats().then(setStats).catch((e) => setError(e.message))
  }, [])

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">Overview of your chatbot activity.</p>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="cards">
        {CARDS.map((c) => (
          <div className="stat-card" key={c.key}>
            <span className="stat-card__icon">{c.icon}</span>
            <div className="stat-card__value">{stats ? stats[c.key] : '—'}</div>
            <div className="stat-card__label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
