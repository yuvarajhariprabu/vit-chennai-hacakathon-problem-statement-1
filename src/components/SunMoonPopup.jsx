import './SunMoonPopup.css'

export default function SunMoonPopup({ show, onClose }) {
  if (!show) return null

  return (
    <div className="smp-overlay" onClick={onClose}>
      <div className="smp-card" onClick={(e) => e.stopPropagation()}>
        {/* Celestial orbit */}
        <div className="smp-celestial-orbit">
          <span className="smp-sun">☀️</span>
          <span className="smp-divider">⚡</span>
          <span className="smp-moon">🌙</span>
        </div>

        {/* Title */}
        <div className="smp-title">☀️ SUN & MOON FOUNDER! 🌙</div>
        <div className="smp-subtitle">
          You have unlocked the secrets of the Celestial Cycle!<br />
          Daylight and Night Starlight now bow to your command in the ancient forest.
          <span className="smp-badge">✨ MASTER OF LIGHT & SHADOW ✨</span>
        </div>

        {/* Orbiting stars row */}
        <div className="smp-stars-row">⭐ 🌟 ☀️ 🌙 🌟 ⭐</div>

        {/* Dismiss button */}
        <button className="smp-close-btn" onClick={onClose}>
          ☀️ HARNESS THE CELESTIAL POWER 🌙
        </button>

        {/* Corner celestial sparkles */}
        <span className="smp-sparkle tl">✨</span>
        <span className="smp-sparkle tr">🌟</span>
        <span className="smp-sparkle bl">🌙</span>
        <span className="smp-sparkle br">☀️</span>
      </div>
    </div>
  )
}
