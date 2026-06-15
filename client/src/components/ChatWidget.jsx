import { useMemo, useState } from 'react'
import Header from './Header'
import WelcomeScreen from './WelcomeScreen'
import ChatScreen from './ChatScreen'
import { I18N, resolveAnswerKey } from '../data/content'

let msgId = 0
const nextId = () => `m${++msgId}`
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fill = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')

// Top-level chat widget. Holds conversation state and a small conversational
// lead-capture flow (asks name → email → interest one question at a time,
// instead of an input form).
//
// NOTE: bot replies + lead capture are mocked locally so the frontend is fully
// demonstrable. Swap `botReply` for POST /api/chat and `submitLead` for
// POST /api/leads when the backend is connected.
export default function ChatWidget({ embedded = false, onRequestClose }) {
  const [isOpen, setIsOpen] = useState(true)
  const [started, setStarted] = useState(false)
  const [lang, setLang] = useState('en')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  // Lead capture state: which question we're on + answers gathered so far.
  const [leadStep, setLeadStep] = useState(null) // 'name' | 'email' | 'interest'
  const [lead, setLead] = useState({ name: '', email: '', interest: '' })

  const t = useMemo(() => I18N[lang], [lang])

  const pushUser = (text) => setMessages((p) => [...p, { id: nextId(), type: 'text', from: 'user', text }])
  const pushBot = (text) => setMessages((p) => [...p, { id: nextId(), type: 'text', from: 'bot', text }])

  // Bot "types" for a beat, then says something (optionally chaining an action).
  const sayBot = (text, after) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      pushBot(text)
      if (after) after()
    }, 650)
  }

  // ----- Conversational lead capture --------------------------------------
  const startLeadFlow = () => {
    setLead({ name: '', email: '', interest: '' })
    setLeadStep('name')
    sayBot(t.leadFlow.askName)
  }

  const handleLeadAnswer = (text) => {
    pushUser(text)
    const value = text.trim()

    if (leadStep === 'name') {
      setLead((l) => ({ ...l, name: value }))
      setLeadStep('email')
      sayBot(fill(t.leadFlow.askEmail, { name: value }))
    } else if (leadStep === 'email') {
      if (!EMAIL_RE.test(value)) {
        sayBot(t.leadFlow.emailInvalid) // re-ask, stay on email step
        return
      }
      setLead((l) => ({ ...l, email: value }))
      setLeadStep('interest')
      sayBot(t.leadFlow.askInterest)
    } else if (leadStep === 'interest') {
      const finalLead = { ...lead, interest: value, language: lang }
      setLeadStep(null)
      submitLead(finalLead)
      sayBot(fill(t.leadFlow.done, finalLead))
    }
  }

  const submitLead = (data) => {
    // Frontend mock — replace with POST /api/leads when the backend is wired.
    // eslint-disable-next-line no-console
    console.log('[Bellamar] lead captured:', data)
  }

  // ----- Normal chat -------------------------------------------------------
  const botReply = (key) => {
    if (key === 'lead') {
      startLeadFlow()
      return
    }
    sayBot(t.answers[key] || t.answers.fallback, () => {
      // After contact/rentals info, smoothly move into capturing details.
      if (key === 'contact' || key === 'rentals') setTimeout(startLeadFlow, 550)
    })
  }

  const startConversation = () => {
    setStarted(true)
    setMessages([
      { id: nextId(), type: 'text', from: 'bot', text: t.greeting },
      { id: nextId(), type: 'quick' },
    ])
  }

  const handlePickQuick = (item) => {
    if (leadStep) setLeadStep(null) // picking a topic cancels an in-progress capture
    pushUser(item.text)
    botReply(item.id)
  }

  const handleSend = (text) => {
    if (leadStep) {
      handleLeadAnswer(text)
      return
    }
    pushUser(text)
    botReply(resolveAnswerKey(text, lang))
  }

  // Re-greet in the newly selected language; cancel any capture in progress.
  const changeLang = (code) => {
    setLang(code)
    setLeadStep(null)
    if (started) {
      setMessages([
        { id: nextId(), type: 'text', from: 'bot', text: I18N[code].greeting },
        { id: nextId(), type: 'quick' },
      ])
    }
  }

  const handleClose = () => {
    if (embedded) onRequestClose?.()
    else setIsOpen(false)
  }

  if (!embedded && !isOpen) {
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
    <div className={`cw-panel ${embedded ? 'cw-panel--embed' : ''}`} role="dialog" aria-label={t.brand}>
      <Header t={t} lang={lang} onChangeLang={changeLang} onClose={handleClose} />

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
          />
        )}
      </div>

      <footer className="cw-footer">{t.footer}</footer>
    </div>
  )
}
