import { useEffect, useState } from 'react'
import { Power, Palette, Languages, MessageSquareText, Save, Check } from 'lucide-react'
import { api } from '../api'

const THEMES = [
  { value: 'adriatic', label: 'Adriatic (navy + gold)' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'sand', label: 'Sand' },
]
const LANGS = [
  { value: 'en', label: 'English' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'hr', label: 'Hrvatski' },
  { value: 'pl', label: 'Polski' },
]

export default function Settings() {
  const [s, setS] = useState(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.settings().then((d) => setS(d.settings)).catch((e) => setError(e.message))
  }, [])

  const set = (patch) => { setS((cur) => ({ ...cur, ...patch })); setSaved(false) }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const { settings } = await api.updateSettings({
        is_enabled: s.is_enabled,
        theme: s.theme,
        primary_language: s.primary_language,
        welcome_en: s.welcome_en,
        welcome_nl: s.welcome_nl,
        welcome_hr: s.welcome_hr,
        welcome_pl: s.welcome_pl,
      })
      setS(settings)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!s) {
    return (
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">Loading…</p>
        {error && <div className="alert alert--error">{error}</div>}
      </div>
    )
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Control how the chatbot looks and behaves.</p>
        </div>
        <button className="btn btn--icon" onClick={save} disabled={saving}>
          {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> {saving ? 'Saving…' : 'Save changes'}</>}
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="panel">
        <div className="setting-row">
          <div className="setting-row__label">
            <span className="setting-row__icon"><Power size={18} /></span>
            <div>
              <strong>Chatbot enabled</strong>
              <p className="page-sub" style={{ margin: 0 }}>Turn the assistant on or off across the website.</p>
            </div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={s.is_enabled} onChange={(e) => set({ is_enabled: e.target.checked })} />
            <span className="switch__slider" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-row__label">
            <span className="setting-row__icon"><Palette size={18} /></span>
            <strong>Theme</strong>
          </div>
          <select className="field field--auto" value={s.theme} onChange={(e) => set({ theme: e.target.value })}>
            {THEMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-row__label">
            <span className="setting-row__icon"><Languages size={18} /></span>
            <strong>Default language</strong>
          </div>
          <select className="field field--auto" value={s.primary_language} onChange={(e) => set({ primary_language: e.target.value })}>
            {LANGS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h3 className="panel__title"><MessageSquareText size={17} /> Welcome messages</h3>
        </div>
        {LANGS.map((l) => (
          <label className="form__label form__label--block" key={l.value}>
            {l.label}
            <textarea
              className="field field--area"
              rows={2}
              value={s[`welcome_${l.value}`] || ''}
              onChange={(e) => set({ [`welcome_${l.value}`]: e.target.value })}
            />
          </label>
        ))}
      </div>

      <button className="btn btn--lg btn--icon" onClick={save} disabled={saving}>
        {saved ? <><Check size={18} /> Saved</> : <><Save size={18} /> {saving ? 'Saving…' : 'Save changes'}</>}
      </button>
    </div>
  )
}
