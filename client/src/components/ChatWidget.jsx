import { useEffect, useMemo, useState } from 'react'
import Header from './Header'
import WelcomeScreen from './WelcomeScreen'
import ChatScreen from './ChatScreen'
import { I18N, resolveAnswerKey } from '../data/content'
import { api } from '../api'

let msgId = 0
const nextId = () => `m${++msgId}`
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fill = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')

// Top-level chat widget. Talks to the live backend:
//   • general questions  -> POST /api/chat   (OpenAI, trained on Bellamar)
//   • lead capture        -> conversational flow -> POST /api/leads (Supabase)
//   • welcome/on-off      -> GET /api/settings
export default function ChatWidget({ embedded = false, onRequestClose }) {
  const [isOpen, setIsOpen] = useState(true)
  const [started, setStarted] = useState(false)
  const [lang, setLang] = useState('en')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [settings, setSettings] = useState(null)
  const [conversationId, setConversationId] = useState(null)

  // Conversational lead capture state.
  const [leadStep, setLeadStep] = useState(null) // 'name' | 'email' | 'interest'
  const [lead, setLead] = useState({ name: '', email: '', interest: '' })

  const t = useMemo(() => I18N[lang], [lang])

  // Load widget settings (welcome message, on/off) once.
  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {})
  }, [])

  const pushUser = (text) => setMessages((p) => [...p, { id: nextId(), type: 'text', from: 'user', text }])
  const pushBot = (text) => setMessages((p) => [...p, { id: nextId(), type: 'text', from: 'bot', text }])

  // Local "bot says" used for the deterministic lead-capture questions.
  const sayBot = (text) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      pushBot(text)
    }, 600)
  }

  const greetingText = (code) => settings?.welcome?.[code] || I18N[code].greeting

  // Build OpenAI-style history from the visible conversation (+ the new turn).
  const historyFrom = (msgs, extraUserText) => {
    const h = msgs
      .filter((m) => m.type === 'text')
      .map((m) => ({ role: m.from === 'bot' ? 'assistant' : 'user', content: m.text }))
    if (extraUserText) h.push({ role: 'user', content: extraUserText })
    return h
  }

  // ----- Real AI reply (streamed token-by-token) ---------------------------
  const sendToAI = async (userText) => {
    const history = historyFrom(messages, userText)
    const botId = nextId()
    setIsTyping(true)
    let placed = false

    try {
      const { reply, conversationId: cid } = await api.chatStream({
        messages: history,
        language: lang,
        conversationId,
        onToken: (full) => {
          if (!placed) {
            placed = true
            setIsTyping(false)
            // Drop in the bot bubble on the first token, then keep updating it.
            setMessages((p) => [...p, { id: botId, type: 'text', from: 'bot', text: full, streaming: true }])
          } else {
            setMessages((p) => p.map((m) => (m.id === botId ? { ...m, text: full } : m)))
          }
        },
      })
      if (cid) setConversationId(cid)
      // Finalize: stop the streaming cursor; ensure full text is set.
      setMessages((p) =>
        p.map((m) => (m.id === botId ? { ...m, text: reply || m.text, streaming: false } : m)),
      )
      if (!placed && !reply) pushBot(t.answers.fallback)
    } catch (e) {
      setIsTyping(false)
      if (placed) setMessages((p) => p.map((m) => (m.id === botId ? { ...m, streaming: false } : m)))
      else pushBot(t.errorMessage)
    }
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
        sayBot(t.leadFlow.emailInvalid) // re-ask, stay on this step
        return
      }
      setLead((l) => ({ ...l, email: value }))
      setLeadStep('interest')
      sayBot(t.leadFlow.askInterest)
    } else if (leadStep === 'interest') {
      const finalLead = { ...lead, interest: value, language: lang }
      setLeadStep(null)
      // Persist to the backend (Supabase). UX continues regardless of result.
      api.sendLead(finalLead).catch((err) => console.warn('[Bellamar] lead save failed:', err?.message))
      sayBot(fill(t.leadFlow.done, finalLead))
    }
  }

  // ----- Routing -----------------------------------------------------------
  const startConversation = () => {
    setStarted(true)
    if (settings && settings.isEnabled === false) {
      setMessages([{ id: nextId(), type: 'text', from: 'bot', text: t.offlineMessage }])
      return
    }
    setMessages([
      { id: nextId(), type: 'text', from: 'bot', text: greetingText(lang) },
      { id: nextId(), type: 'quick' },
    ])
  }

  const handlePickQuick = (item) => {
    if (leadStep) setLeadStep(null)
    pushUser(item.text)
    if (item.id === 'contact') startLeadFlow()
    else sendToAI(item.text)
  }

  const handleSend = (text) => {
    if (leadStep) {
      handleLeadAnswer(text)
      return
    }
    // Strong contact/lead intent → start the structured capture flow.
    const intent = resolveAnswerKey(text, lang)
    pushUser(text)
    if (intent === 'lead' || intent === 'contact') startLeadFlow()
    else sendToAI(text)
  }

  const changeLang = (code) => {
    setLang(code)
    setLeadStep(null)
    if (started) {
      setMessages([
        { id: nextId(), type: 'text', from: 'bot', text: greetingText(code) },
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
        <img src="/logo.png" alt="" className="cw-launcher__img" />
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
