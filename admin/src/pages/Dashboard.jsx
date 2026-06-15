import { useEffect, useState } from 'react'
import {
  Users, TrendingUp, MessagesSquare, Mail, ArrowUpRight, Clock,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { api } from '../api'

const CARDS = [
  { key: 'totalLeads', label: 'Total Leads', Icon: Users, tint: '#1f5a70' },
  { key: 'leadsLast7Days', label: 'Leads · 7 days', Icon: TrendingUp, tint: '#c9a45f' },
  { key: 'totalConversations', label: 'Conversations', Icon: MessagesSquare, tint: '#2563eb' },
  { key: 'totalMessages', label: 'Messages', Icon: Mail, tint: '#16a34a' },
]

// Build a [{ day, count }] series for the last 7 days from the leads list.
function buildSeries(leads) {
  const days = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({
      key,
      day: d.toLocaleDateString(undefined, { weekday: 'short' }),
      count: 0,
    })
  }
  const index = Object.fromEntries(days.map((d) => [d.key, d]))
  for (const l of leads) {
    const k = String(l.created_at).slice(0, 10)
    if (index[k]) index[k].count += 1
  }
  return days
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.stats(), api.leads()])
      .then(([s, l]) => {
        setStats(s)
        setLeads(l.leads || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const series = buildSeries(leads)
  const recent = leads.slice(0, 5)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Overview of your chatbot activity.</p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="cards">
        {CARDS.map(({ key, label, Icon, tint }) => (
          <div className="stat-card" key={key}>
            <div className="stat-card__top">
              <span className="stat-card__icon" style={{ background: `${tint}1a`, color: tint }}>
                <Icon size={20} />
              </span>
            </div>
            <div className="stat-card__value">{loading ? '—' : stats?.[key] ?? 0}</div>
            <div className="stat-card__label">{label}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel__head">
          <h3 className="panel__title">Leads · last 7 days</h3>
          <span className="panel__hint"><TrendingUp size={15} /> trend</span>
        </div>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <AreaChart data={series} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a45f" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#c9a45f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ece6d8" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6a7780' }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6a7780' }} width={36} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #e4ddd0', fontSize: 13 }}
                labelStyle={{ color: '#0c2733', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="count" stroke="#c9a45f" strokeWidth={2.5} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h3 className="panel__title">Recent leads</h3>
          <Clock size={16} color="#6a7780" />
        </div>
        {recent.length === 0 ? (
          <p className="page-sub" style={{ margin: 0 }}>No leads yet.</p>
        ) : (
          <ul className="recent">
            {recent.map((l) => (
              <li className="recent__item" key={l.id}>
                <span className="recent__avatar">{(l.name || '?').charAt(0).toUpperCase()}</span>
                <div className="recent__info">
                  <strong>{l.name}</strong>
                  <span>{l.email}</span>
                </div>
                <span className="recent__meta">
                  {new Date(l.created_at).toLocaleDateString()}
                  <ArrowUpRight size={15} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
