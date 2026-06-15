// Landing view inside the panel — centered logo, welcome copy and the
// "Start Conversation" pill button (mirrors the reference design).
export default function WelcomeScreen({ t, onStart }) {
  return (
    <div className="welcome">
      <div className="welcome__logo-ring">
        <div className="welcome__logo">B</div>
      </div>
      <h3 className="welcome__title">{t.welcomeTitle}</h3>
      <p className="welcome__subtitle">{t.welcomeSubtitle}</p>
      <button type="button" className="welcome__cta" onClick={onStart}>
        <span className="welcome__cta-icon" aria-hidden="true">✦</span>
        {t.startButton}
      </button>
    </div>
  )
}
