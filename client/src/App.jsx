import ChatWidget from './components/ChatWidget'

// Demo host page. On the real site the widget embeds bottom-right over Bellamar's
// own pages; here we show it on a dark stage so the panel reads clearly.
export default function App() {
  return (
    <div className="stage">
      <div className="cw-mount">
        <ChatWidget />
      </div>
    </div>
  )
}
