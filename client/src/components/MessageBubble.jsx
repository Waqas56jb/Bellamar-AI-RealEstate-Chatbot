import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'

// Open any links the bot returns in a new tab, safely.
const mdComponents = {
  a: (props) => <a target="_blank" rel="noopener noreferrer" {...props} />,
}

// A single chat message. Bot messages are rendered as Markdown (bold headings,
// line breaks, bullet lists, links); user messages stay plain text.
// While `streaming`, a blinking cursor is shown after the text.
export default function MessageBubble({ from, text, streaming = false }) {
  const isBot = from === 'bot'
  return (
    <div className={`msg-row ${isBot ? 'msg-row--bot' : 'msg-row--user'}`}>
      {isBot && (
        <div className="msg-avatar" aria-hidden="true">
          <img src="/logo.png" alt="" />
        </div>
      )}
      <div className={`msg-bubble ${isBot ? 'msg-bubble--bot' : 'msg-bubble--user'}`}>
        {isBot ? (
          <div className={`md ${streaming ? 'md--streaming' : ''}`}>
            <ReactMarkdown remarkPlugins={[remarkBreaks]} components={mdComponents}>
              {text}
            </ReactMarkdown>
          </div>
        ) : (
          text
        )}
      </div>
    </div>
  )
}
