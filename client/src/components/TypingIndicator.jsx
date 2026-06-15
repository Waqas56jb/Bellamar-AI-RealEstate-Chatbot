// Three-dot "bot is typing" animation, styled like a bot bubble.
export default function TypingIndicator() {
  return (
    <div className="msg-row msg-row--bot">
      <div className="msg-avatar" aria-hidden="true">
        <img src="/logo.png" alt="" />
      </div>
      <div className="msg-bubble msg-bubble--bot typing">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  )
}
