import { LANGUAGES } from '../data/content'

// Widget header: brand logo + name + online status, language switcher, close.
export default function Header({ t, lang, onChangeLang, onClose }) {
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
        <div className="lang-switch" role="group" aria-label="Language">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              title={l.name}
              className={`lang-switch__btn ${lang === l.code ? 'is-active' : ''}`}
              onClick={() => onChangeLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button type="button" className="cw-close" onClick={onClose} aria-label="Close chat">
          ×
        </button>
      </div>
    </header>
  )
}
