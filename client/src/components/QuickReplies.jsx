// White rounded option cards (icon + label) shown under the greeting,
// mirroring the reference design's quick-action menu.
export default function QuickReplies({ items, onPick }) {
  return (
    <div className="quick-replies">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="quick-reply"
          onClick={() => onPick(item)}
        >
          <span className="quick-reply__icon" aria-hidden="true">{item.icon}</span>
          <span className="quick-reply__text">{item.text}</span>
        </button>
      ))}
    </div>
  )
}
