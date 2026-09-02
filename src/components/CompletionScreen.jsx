import { useEffect, useState } from 'react'
import './CompletionScreen.css'

export default function CompletionScreen({ stats, onRestart }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`completion-root ${visible ? 'show' : ''}`}>
      {/* Particle burst - CSS-only */}
      <div className="burst-ring ring1" />
      <div className="burst-ring ring2" />
      <div className="burst-ring ring3" />

      <div className="completion-card">
        <div className="comp-badge">✦</div>
        <h1 className="comp-title">SYSTEM READY</h1>
        <p className="comp-sub">60 SECONDS COMPLETE</p>

        <div className="comp-divider" />

        <div className="comp-stats">
          <div className="comp-stat">
            <span className="cs-value">{stats.catches ?? stats.hits ?? 5}</span>
            <span className="cs-label">CATCHES</span>
          </div>
          <div className="comp-stat">
            <span className="cs-value">{stats.animalsRescued ?? stats.rocksCollected ?? 5}/5</span>
            <span className="cs-label">ANIMALS</span>
          </div>
          <div className="comp-stat">
            <span className="cs-value">×{stats.bestCombo || 1}</span>
            <span className="cs-label">BEST COMBO</span>
          </div>
          <div className="comp-stat">
            <span className="cs-value">{stats.easterEgg ? '✓' : '✗'}</span>
            <span className="cs-label">SECRETS</span>
          </div>
        </div>

        {stats.easterEgg && (
          <div className="comp-secret">⚡ OMEGA CLEARANCE ACHIEVED</div>
        )}

        <div className="comp-divider" />

        <button className="comp-btn" onClick={onRestart}>
          <span>ENTER EXPERIENCE</span>
          <div className="btn-glow" />
        </button>
      </div>
    </div>
  )
}
