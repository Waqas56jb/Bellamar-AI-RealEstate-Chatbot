import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'

// Open any links the bot returns in a new tab, safely.
const mdComponents = {
  a: (props) => <a target="_blank" rel="noopener noreferrer" {...props} />,
}

// A single chat message. Bot messages are rendered as Markdown (bold headings,
// line breaks, bullet lists, links); user messages stay plain text.
export default function MessageBubble({ from, text }) {
  const isBot = from === 'bot'
  return (
    <div className={`msg-row ${isBot ? 'msg-row--bot' : 'msg-row--user'}`}>
      {isBot && <div className="msg-avatar" aria-hidden="true">B</div>}
      <div className={`msg-bubble ${isBot ? 'msg-bubble--bot' : 'msg-bubble--user'}`}>
        {isBot ? (
          <div className="md">
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
