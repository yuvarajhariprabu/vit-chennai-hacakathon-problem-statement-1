import './GoldenKoiPopup.css'

export default function GoldenKoiPopup({ show, onClose }) {
  if (!show) return null

  return (
    <div className="gk-overlay" onClick={onClose}>
      <div className="gk-card" onClick={(e) => e.stopPropagation()}>

        {/* Waves decoration */}
        <div className="gk-waves">🌊🌊🌊</div>

        {/* Giant koi emoji */}
        <div className="gk-fish-icon">🐟</div>

        {/* Title */}
        <div className="gk-title">✨ RARE GOLDEN KOI FOUND! ✨</div>
        <div className="gk-subtitle">
          You have found the legendary Golden Koi<br/>
          hidden deep in the ancient forest river!<br/>
          <span className="gk-fortune">🍀 Fortune & Luck now flow with you!</span>
        </div>

        {/* River decoration */}
        <div className="gk-river-row">💧🐟💛🐟💧</div>

        {/* Dismiss */}
        <button className="gk-close-btn" onClick={onClose}>
          🌊 RELEASE THE KOI 🌊
        </button>

        {/* Corner water drops */}
        <span className="gk-drop tl">💧</span>
        <span className="gk-drop tr">✨</span>
        <span className="gk-drop bl">✨</span>
        <span className="gk-drop br">💧</span>
      </div>
    </div>
  )
}
