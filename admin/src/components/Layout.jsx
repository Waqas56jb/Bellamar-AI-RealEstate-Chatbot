import { useState } from 'react'
import { LayoutDashboard, Users, BrainCircuit, Settings, LogOut, Menu, X } from 'lucide-react'

const NAV = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { key: 'leads', label: 'Leads', Icon: Users },
  { key: 'training', label: 'Training', Icon: BrainCircuit },
  { key: 'settings', label: 'Settings', Icon: Settings },
]

export default function Layout({ page, onNavigate, onLogout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const current = NAV.find((n) => n.key === page)

  const go = (key) => {
    onNavigate(key)
    setMobileOpen(false)
  }

  return (
    <div className="admin">
      {/* Mobile top bar */}
      <header className="topbar">
        <button className="topbar__menu" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <span className="topbar__title">{current?.label}</span>
      </header>

      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="sidebar__top">
          <div className="sidebar__brand">
            <div className="sidebar__logo"><img src="/logo.png" alt="Bellamar" /></div>
            <div>
              <div className="sidebar__name">Bellamar</div>
              <div className="sidebar__sub">Chatbot Admin</div>
            </div>
          </div>
          <button className="sidebar__close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={`nav-item ${page === key ? 'is-active' : ''}`}
              onClick={() => go(key)}
            >
              <Icon size={19} strokeWidth={2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar__logout" onClick={onLogout}>
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </aside>

      <main className="content">
        <div className="content__inner">{children}</div>
      </main>
    </div>
  )
}
