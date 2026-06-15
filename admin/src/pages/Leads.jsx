import { useEffect, useMemo, useState } from 'react'
import { Search, Trash2, RefreshCw, Inbox } from 'lucide-react'
import { api } from '../api'

const STATUSES = ['new', 'contacted', 'closed']
const FILTERS = ['all', ...STATUSES]

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    api
      .leads()
      .then((d) => setLeads(d.leads || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const changeStatus = async (id, status) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)))
    await api.updateLead(id, status).catch((e) => setError(e.message))
  }

  const remove = async (id) => {
    if (!confirm('Delete this lead?')) return
    setLeads((ls) => ls.filter((l) => l.id !== id))
    await api.deleteLead(id).catch((e) => setError(e.message))
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads.filter((l) => {
      if (filter !== 'all' && l.status !== filter) return false
      if (!q) return true
      return [l.name, l.email, l.interest].some((v) => String(v || '').toLowerCase().includes(q))
    })
  }, [leads, query, filter])

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-sub">Visitors captured by the chatbot.</p>
        </div>
        <button className="btn btn--ghost btn--icon" onClick={load} title="Refresh">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            placeholder="Search name, email, interest…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="chips">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? 'is-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Interest</th>
              <th>Lang</th>
              <th>Date</th>
              <th>Status</th>
              <th aria-label="actions"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="table__empty">Loading…</td></tr>}
            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={7} className="table__empty">
                  <Inbox size={26} /><div>No leads found.</div>
                </td>
              </tr>
            )}
            {visible.map((l) => (
              <tr key={l.id}>
                <td>
                  <div className="cell-name">
                    <span className="avatar">{(l.name || '?').charAt(0).toUpperCase()}</span>
                    {l.name}
                  </div>
                </td>
                <td><a href={`mailto:${l.email}`}>{l.email}</a></td>
                <td>{l.interest || '—'}</td>
                <td><span className="pill">{l.language?.toUpperCase()}</span></td>
                <td className="muted">{new Date(l.created_at).toLocaleDateString()}</td>
                <td>
                  <select
                    className={`status status--${l.status}`}
                    value={l.status}
                    onChange={(e) => changeStatus(l.id, e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <button className="icon-btn icon-btn--danger" onClick={() => remove(l.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
