import { useEffect, useState } from 'react'
import './CompletionScreen.css'

export default function CompletionScreen({ stats, onRestart }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`completion-root ${visible ? 'show' : ''}`}>
      {/* Photorealistic Grassland Forest Background Layer */}
      <div
        className="comp-grassland-photo"
        style={{ backgroundImage: `url('/grassland_bg.jpg')` }}
      />

      {/* Sunbeams & Ambient Lighting Overlay */}
      <div className="comp-sun-rays" />
      <div className="comp-vignette" />

      {/* Floating Meadow Sparkles & Dandelion Seeds */}
      <div className="comp-meadow-particles">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className={`m-particle p-${i % 5}`}>🌿</span>
        ))}
      </div>

      <div className="completion-card">
        <div className="comp-badge">🌲</div>
        <h1 className="comp-title">SANCTUARY PRESERVED</h1>
        <p className="comp-sub">60 SECONDS COMPLETE • ANCIENT HARMONY RESTORED</p>

        <div className="comp-divider" />

        <div className="comp-stats">
          <div className="comp-stat">
            <span className="cs-value">{stats.catches ?? stats.hits ?? 5}</span>
            <span className="cs-label">CATCHES</span>
          </div>
          <div className="comp-stat">
            <span className="cs-value">{stats.animalsRescued ?? 5}/5</span>
            <span className="cs-label">ANIMALS RESCUED</span>
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
          <div className="comp-secret">✨ ANCIENT FOREST GUARDIAN CLEARANCE ACHIEVED ✨</div>
        )}

        <div className="comp-divider" />

        <button className="comp-btn" onClick={onRestart}>
          <span>🌿 ENTER FOREST SANCTUARY 🌿</span>
          <div className="btn-glow" />
        </button>
      </div>
    </div>
  )
}
