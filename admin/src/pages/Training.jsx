import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Power, BrainCircuit, X } from 'lucide-react'
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
      if (editingId) await api.updateTraining(editingId, form)
      else await api.createTraining(form)
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggle = async (d) => { await api.updateTraining(d.id, { is_active: !d.is_active }); load() }

  const remove = async (id) => {
    if (!confirm('Delete this document?')) return
    await api.deleteTraining(id)
    load()
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Training</h1>
          <p className="page-sub">Knowledge the chatbot uses to answer — applied to the AI live.</p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <form className="panel form" onSubmit={save}>
        <div className="panel__head">
          <h3 className="panel__title">
            {editingId ? <><Pencil size={17} /> Edit document</> : <><Plus size={17} /> Add document</>}
          </h3>
          {editingId && (
            <button type="button" className="icon-btn" onClick={reset} title="Cancel edit"><X size={18} /></button>
          )}
        </div>
        <input
          className="field"
          placeholder="Title (e.g. Pricing policy, Office hours)"
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
            <select className="field" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
              {LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active
          </label>
          <div className="form__actions">
            <button className="btn btn--icon" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update' : <><Plus size={16} /> Add</>}
            </button>
          </div>
        </div>
      </form>

      <div className="doc-list">
        {docs.length === 0 && (
          <div className="empty-state">
            <BrainCircuit size={30} />
            <p>No training documents yet. Add one above to teach the chatbot.</p>
          </div>
        )}
        {docs.map((d) => (
          <div className={`doc ${d.is_active ? '' : 'doc--off'}`} key={d.id}>
            <div className="doc__head">
              <strong>{d.title}</strong>
              <span className="pill">{d.language.toUpperCase()}</span>
              <span className={`dot ${d.is_active ? 'dot--on' : 'dot--off'}`} />
            </div>
            <p className="doc__content">{d.content}</p>
            <div className="doc__actions">
              <button className="btn btn--ghost btn--icon" onClick={() => toggle(d)}>
                <Power size={15} /> {d.is_active ? 'Disable' : 'Enable'}
              </button>
              <button className="btn btn--ghost btn--icon" onClick={() => edit(d)}>
                <Pencil size={15} /> Edit
              </button>
              <button className="btn btn--danger btn--icon" onClick={() => remove(d.id)}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
