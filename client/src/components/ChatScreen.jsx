import { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import QuickReplies from './QuickReplies'

// Conversation view: scrollable message list (with quick replies rendered
// inline as a special message type) and the input row. Lead details are
// collected conversationally by the bot, so there is no inline form here.
export default function ChatScreen({ t, messages, isTyping, onPickQuick, onSend }) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  // Keep the latest message in view as the conversation grows.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  const submit = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  return (
    <div className="chat">
      <div className="chat__messages" ref={scrollRef}>
        {messages.map((m) => {
          if (m.type === 'quick') {
            return <QuickReplies key={m.id} items={t.quickReplies} onPick={onPickQuick} />
          }
          return <MessageBubble key={m.id} from={m.from} text={m.text} streaming={m.streaming} />
        })}
        {isTyping && <TypingIndicator />}
      </div>

      <form className="chat__input-row" onSubmit={submit}>
        <input
          className="chat__input"
          type="text"
          placeholder={t.inputPlaceholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="chat__send" aria-label="Send message">
          ↑
        </button>
      </form>
    </div>
  )
}
