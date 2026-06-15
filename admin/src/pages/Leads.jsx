import { useEffect, useState } from 'react'
import { api } from '../api'

const STATUSES = ['new', 'contacted', 'closed']

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    await api.updateLead(id, status)
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  const remove = async (id) => {
    if (!confirm('Delete this lead?')) return
    await api.deleteLead(id)
    setLeads((ls) => ls.filter((l) => l.id !== id))
  }

  return (
    <div>
      <h1 className="page-title">Leads</h1>
      <p className="page-sub">Visitors captured by the chatbot.</p>

      {error && <div className="alert alert--error">{error}</div>}

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="table__empty">Loading…</td></tr>
            )}
            {!loading && leads.length === 0 && (
              <tr><td colSpan={7} className="table__empty">No leads yet.</td></tr>
            )}
            {leads.map((l) => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td><a href={`mailto:${l.email}`}>{l.email}</a></td>
                <td>{l.interest || '—'}</td>
                <td><span className="pill">{l.language?.toUpperCase()}</span></td>
                <td>{new Date(l.created_at).toLocaleDateString()}</td>
                <td>
                  <select
                    className={`status status--${l.status}`}
                    value={l.status}
                    onChange={(e) => changeStatus(l.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="icon-btn" onClick={() => remove(l.id)} title="Delete">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
