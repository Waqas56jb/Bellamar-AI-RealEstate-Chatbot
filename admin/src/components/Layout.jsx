const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'leads', label: 'Leads', icon: '👥' },
  { key: 'training', label: 'Training', icon: '🧠' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function Layout({ page, onNavigate, onLogout, children }) {
  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo">B</div>
          <div>
            <div className="sidebar__name">Bellamar</div>
            <div className="sidebar__sub">Chatbot Admin</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`nav-item ${page === n.key ? 'is-active' : ''}`}
              onClick={() => onNavigate(n.key)}
            >
              <span className="nav-item__icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <button className="sidebar__logout" onClick={onLogout}>
          ⏻ Log out
        </button>
      </aside>

      <main className="content">
        <div className="content__inner">{children}</div>
      </main>
    </div>
  )
}
