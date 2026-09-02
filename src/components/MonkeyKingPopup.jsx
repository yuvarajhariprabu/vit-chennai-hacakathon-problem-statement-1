import './MonkeyKingPopup.css'

export default function MonkeyKingPopup({ show, onClose }) {
  if (!show) return null

  return (
    <div className="mk-overlay" onClick={onClose}>
      <div className="mk-card" onClick={(e) => e.stopPropagation()}>
        {/* Decorative crown */}
        <div className="mk-crown">👑</div>

        {/* Monkey King Image */}
        <div className="mk-img-frame">
          <img src="/monkey_king.jpg" alt="Monkey King eating banana" className="mk-img" />
          <div className="mk-img-shine" />
        </div>

        {/* Royal Message */}
        <div className="mk-title">🐒 YOU ARE THE MONKEY KING! 🐒</div>
        <div className="mk-subtitle">You Rule the Sanctuary with the Power of Bananas!</div>

        {/* Banana decoration row */}
        <div className="mk-bananas">🍌🍌🍌🍌🍌</div>

        {/* Dismiss button */}
        <button className="mk-close-btn" onClick={onClose}>
          👑 CLAIM YOUR THRONE 👑
        </button>

        {/* Corner sparkles */}
        <span className="mk-sparkle tl">✨</span>
        <span className="mk-sparkle tr">✨</span>
        <span className="mk-sparkle bl">✨</span>
        <span className="mk-sparkle br">✨</span>
      </div>
    </div>
  )
}
