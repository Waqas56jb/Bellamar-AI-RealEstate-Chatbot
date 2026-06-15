import { useEffect, useState } from 'react'
import { api } from '../api'

const LANGS = ['all', 'en', 'nl', 'hr', 'pl']
const EMPTY = { title: '', content: '', language: 'all', is_active: true }

export default function Training() {
  const [docs, setDocs] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    api.training().then((d) => setDocs(d.documents || [])).catch((e) => setError(e.message))
  }
  useEffect(load, [])

  const reset = () => { setForm(EMPTY); setEditingId(null) }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (editingId) {
        await api.updateTraining(editingId, form)
      } else {
        await api.createTraining(form)
      }
      reset()
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const edit = (d) => {
    setEditingId(d.id)
    setForm({ title: d.title, content: d.content, language: d.language, is_active: d.is_active })
  }

  const toggle = async (d) => {
    await api.updateTraining(d.id, { is_active: !d.is_active })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this document?')) return
    await api.deleteTraining(id)
    load()
  }

  return (
    <div>
      <h1 className="page-title">Training</h1>
      <p className="page-sub">Knowledge the chatbot uses to answer. Added live to the AI.</p>

      {error && <div className="alert alert--error">{error}</div>}

      <form className="panel form" onSubmit={save}>
        <h3 className="panel__title">{editingId ? 'Edit document' : 'Add document'}</h3>
        <input
          className="field"
          placeholder="Title (e.g. Pricing policy)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="field field--area"
          placeholder="Content the chatbot should know…"
          rows={5}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <div className="form__row">
          <label className="form__label">
            Language
            <select
              className="field"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            >
              {LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>
          <div className="form__actions">
            {editingId && <button type="button" className="btn btn--ghost" onClick={reset}>Cancel</button>}
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </form>

      <div className="doc-list">
        {docs.length === 0 && <p className="page-sub">No training documents yet.</p>}
        {docs.map((d) => (
          <div className={`doc ${d.is_active ? '' : 'doc--off'}`} key={d.id}>
            <div className="doc__head">
              <strong>{d.title}</strong>
              <span className="pill">{d.language.toUpperCase()}</span>
            </div>
            <p className="doc__content">{d.content}</p>
            <div className="doc__actions">
              <button className="btn btn--ghost" onClick={() => toggle(d)}>
                {d.is_active ? 'Disable' : 'Enable'}
              </button>
              <button className="btn btn--ghost" onClick={() => edit(d)}>Edit</button>
              <button className="btn btn--danger" onClick={() => remove(d.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
