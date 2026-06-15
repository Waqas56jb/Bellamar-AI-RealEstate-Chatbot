import { useMemo, useState } from 'react'
import Header from './Header'
import WelcomeScreen from './WelcomeScreen'
import ChatScreen from './ChatScreen'
import { I18N, resolveAnswerKey } from '../data/content'

let msgId = 0
const nextId = () => `m${++msgId}`

// Top-level chat widget: launcher bubble + sliding panel that switches between
// the welcome view and the live conversation. Holds all conversation state.
//
// NOTE: bot replies are mocked locally (canned answers + simulated typing) so
// the frontend is fully demonstrable. Swap `botReply` for a backend/AI call later.
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true)
  const [started, setStarted] = useState(false)
  const [lang, setLang] = useState('en')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const t = useMemo(() => I18N[lang], [lang])

  // Simulate a bot turn: show typing, then push the canned answer for `key`.
  const botReply = (key) => {
    setIsTyping(true)
    const delay = 650 + Math.min(key.length, 8) * 60
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: nextId(), type: 'text', from: 'bot', text: t.answers[key] || t.answers.fallback },
      ])
      // After certain answers, offer the inline lead form.
      if (key === 'contact' || key === 'rentals' || key === 'lead') {
        setMessages((prev) => [...prev, { id: nextId(), type: 'lead' }])
      }
    }, delay)
  }

  const startConversation = () => {
    setStarted(true)
    setMessages([
      { id: nextId(), type: 'text', from: 'bot', text: t.greeting },
      { id: nextId(), type: 'quick' },
    ])
  }

  const handlePickQuick = (item) => {
    setMessages((prev) => [...prev, { id: nextId(), type: 'text', from: 'user', text: item.text }])
    botReply(item.id)
  }

  const handleSend = (text) => {
    setMessages((prev) => [...prev, { id: nextId(), type: 'text', from: 'user', text }])
    botReply(resolveAnswerKey(text, lang))
  }

  const handleLead = (lead) => {
    // Frontend only for now — log it; backend persistence comes later.
    // eslint-disable-next-line no-console
    console.log('[Bellamar] lead captured:', lead)
  }

  // Re-greet in the newly selected language if the chat is already open.
  const changeLang = (code) => {
    setLang(code)
    if (started) {
      setMessages([
        { id: nextId(), type: 'text', from: 'bot', text: I18N[code].greeting },
        { id: nextId(), type: 'quick' },
      ])
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        className="cw-launcher"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <span className="cw-launcher__icon">💬</span>
        <span className="cw-launcher__label">{t.role}</span>
      </button>
    )
  }

  return (
    <div className="cw-panel" role="dialog" aria-label={t.brand}>
      <Header t={t} lang={lang} onChangeLang={changeLang} onClose={() => setIsOpen(false)} />

      <div className="cw-body">
        {!started ? (
          <WelcomeScreen t={t} onStart={startConversation} />
        ) : (
          <ChatScreen
            t={t}
            messages={messages}
            isTyping={isTyping}
            onPickQuick={handlePickQuick}
            onSend={handleSend}
            onLead={handleLead}
          />
        )}
      </div>

      <footer className="cw-footer">{t.footer}</footer>
    </div>
  )
}
