import ChatWidget from './components/ChatWidget'

// When loaded inside the embed iframe (?embed=1), render only the panel on a
// transparent background; the host page (embed.js) provides the launcher and
// frame. The close button posts a message so the host can hide the iframe.
const isEmbed = new URLSearchParams(window.location.search).get('embed') === '1'

export default function App() {
  if (isEmbed) {
    document.body.classList.add('embed')
    return (
      <ChatWidget
        embedded
        onRequestClose={() => window.parent?.postMessage({ type: 'bellamar-chat-close' }, '*')}
      />
    )
  }

  // Standalone demo page (dark stage with floating panel).
  return (
    <div className="stage">
      <div className="cw-mount">
        <ChatWidget />
      </div>
    </div>
  )
}
