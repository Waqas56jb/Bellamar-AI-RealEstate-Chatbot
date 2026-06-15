// A single chat message — bot (with avatar on the left) or user (right-aligned).
export default function MessageBubble({ from, text }) {
  const isBot = from === 'bot'
  return (
    <div className={`msg-row ${isBot ? 'msg-row--bot' : 'msg-row--user'}`}>
      {isBot && <div className="msg-avatar" aria-hidden="true">B</div>}
      <div className={`msg-bubble ${isBot ? 'msg-bubble--bot' : 'msg-bubble--user'}`}>
        {text}
      </div>
    </div>
  )
}
