import { useState } from 'react'

// Inline lead-capture card (name, email, interest). Rendered as a bot message
// when the user signals interest. On submit it bubbles the lead up to the parent
// — the backend wiring (save to DB / notify team) is added later.
export default function LeadForm({ t, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', interest: '' })
  const [sent, setSent] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    onSubmit?.(form)
    setSent(true)
  }

  if (sent) {
    return <div className="lead-thanks">{t.leadThanks}</div>
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <p className="lead-form__title">{t.leadPrompt}</p>
      <input
        className="lead-form__input"
        type="text"
        placeholder={t.leadName}
        value={form.name}
        onChange={update('name')}
        required
      />
      <input
        className="lead-form__input"
        type="email"
        placeholder={t.leadEmail}
        value={form.email}
        onChange={update('email')}
        required
      />
      <input
        className="lead-form__input"
        type="text"
        placeholder={t.leadInterest}
        value={form.interest}
        onChange={update('interest')}
      />
      <button className="lead-form__submit" type="submit">
        {t.leadSubmit}
      </button>
    </form>
  )
}
