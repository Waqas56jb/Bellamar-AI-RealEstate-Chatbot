import { useEffect, useRef, useState } from 'react'
import { LANGUAGES } from '../data/content'

// Widget header: brand logo + name + online status, compact language dropdown,
// and close. The language picker is a dropdown (not a button row) so the brand
// title always gets the space it needs and never wraps.
export default function Header({ t, lang, onChangeLang, onClose }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

  // Close the dropdown on outside click.
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const pick = (code) => {
    onChangeLang(code)
    setOpen(false)
  }

  return (
    <header className="cw-header">
      <div className="cw-header__brand">
        <div className="cw-logo">
          B
          <span className="cw-logo__status" aria-hidden="true" />
        </div>
        <div className="cw-header__titles">
          <h2 className="cw-header__name">{t.brand}</h2>
          <p className="cw-header__role">
            <span className="status-dot" /> {t.role} · {t.status}
          </p>
        </div>
      </div>

      <div className="cw-header__actions">
        <div className="lang" ref={ref}>
          <button
            type="button"
            className="lang__toggle"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Select language"
          >
            <span className="lang__globe" aria-hidden="true">🌐</span>
            <span className="lang__code">{current.label}</span>
            <span className={`lang__chev ${open ? 'is-open' : ''}`} aria-hidden="true">⌄</span>
          </button>
          {open && (
            <ul className="lang__menu" role="listbox">
              {LANGUAGES.map((l) => (
                <li key={l.code} role="option" aria-selected={l.code === lang}>
                  <button
                    type="button"
                    className={`lang__item ${l.code === lang ? 'is-active' : ''}`}
                    onClick={() => pick(l.code)}
                  >
                    <span className="lang__item-code">{l.label}</span>
                    <span className="lang__item-name">{l.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" className="cw-close" onClick={onClose} aria-label="Close chat">
          ×
        </button>
      </div>
    </header>
  )
}
