import './LeftPanel.css'

export default function LeftPanel({
  collectedAnimals,
  typedCode,
  onType,
  easterEggFound,
  onLogoClick,
  activeEasterEggs = []
}) {
  const correctCode = collectedAnimals.map(a => a.letter).join('')
  const isCorrect = typedCode.length > 0 && typedCode === correctCode && correctCode.length >= 3

  return (
    <aside className="left-panel">
      {/* 1. Website Name: CODE MONKEY */}
      <div className="lp-brand" onClick={onLogoClick} title="🐵 Click for a royal surprise!" style={{ cursor: 'pointer' }}>
        <div className="lp-monkey">🐒</div>
        <div className="lp-brand-text">
          <h1 className="lp-name">CODE MONKEY</h1>
          <div className="lp-tagline">ANCIENT FOREST RESCUE</div>
        </div>
      </div>

      <div className="lp-divider" />

      {/* 2. 2 - 3 lines description of the website and the game */}
      <div className="lp-description-box">
        <p className="lp-desc">
          Welcome to <strong>Code Monkey</strong>! Magical woodland animals are tumbling out of the giant timeless hourglass.
          Use your enchanted catching net to rescue all 5 wild animals before the 60-second timer runs out.
          Once rescued, their color runes will illuminate on your sanctuary shelf — enter the first letter of each color in the text box below to unlock the forest secret!
        </p>
      </div>

      <div className="lp-divider" />

      {/* 3. Text Box below description with color / animal clues */}
      <div className="lp-section">
        <div className="lp-section-header">
          <span className="lp-section-label">SECRET COLOR CODE</span>
          <span className="lp-badge-live">{collectedAnimals.length}/5 RESCUED</span>
        </div>

        {/* Color Sequence Visual Indicator */}
        <div className="lp-color-sequence">
          {collectedAnimals.length === 0 ? (
            <span className="lp-empty-hint">Catch animals from the hourglass to reveal colors…</span>
          ) : (
            collectedAnimals.map((animal, i) => (
              <div
                key={animal.id || i}
                className="color-pip-node"
                style={{
                  background: animal.color,
                  boxShadow: `0 0 12px ${animal.glow}`
                }}
                title={`${animal.name} (${animal.colorName}) - Letter: ${animal.letter}`}
              >
                <span className="pip-emoji">{animal.emoji}</span>
                <span className="pip-char">{animal.letter}</span>
              </div>
            ))
          )}
        </div>

        {/* Text Input */}
        <div className="lp-input-container">
          <label className="lp-input-guide">
            Type the first letter of each color above:
          </label>
          <div className="lp-input-wrapper">
            <input
              className={`lp-code-input ${isCorrect ? 'cracked-success' : ''}`}
              type="text"
              value={typedCode}
              onChange={(e) => onType(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
              placeholder={collectedAnimals.length > 0 ? 'e.g.  R  G  B …' : 'Catch an animal first…'}
              maxLength={Math.max(correctCode.length || 1, 1)}
              disabled={collectedAnimals.length === 0}
              autoComplete="off"
              spellCheck={false}
            />
            {isCorrect && <div className="success-badge-mark">✓</div>}
          </div>
        </div>

        {/* Real-time Letter Validation Feedback */}
        {typedCode.length > 0 && (
          <div className="lp-letter-feedback-row">
            {typedCode.split('').map((char, idx) => {
              const isMatch = correctCode[idx] === char
              return (
                <span
                  key={idx}
                  className={`feedback-token ${isMatch ? 'match' : 'mismatch'}`}
                >
                  {char}
                </span>
              )
            })}
          </div>
        )}

        {/* Success Message Banner */}
        {isCorrect && (
          <div className="lp-victory-banner">
            <span className="victory-icon">🏆</span>
            <div>
              <div className="victory-title">FOREST CODE CRACKED!</div>
              <div className="victory-sub">You rescued the ancient animals!</div>
            </div>
          </div>
        )}
      </div>

      <div className="lp-divider" />

      {/* Easter Egg Tracker */}
      <div className="lp-easter-eggs-section">
        <div className="lp-easter-title">
          <span>✨ HIDDEN EASTER EGGS</span>
        </div>
        <div className="lp-easter-list">
          <div className={`easter-item ${activeEasterEggs.includes('monkey') ? 'unlocked' : ''}`}>
            <span>🐵 Monkey Fever</span>
            <span className="easter-status">{activeEasterEggs.includes('monkey') ? '✅ FOUND' : 'Click the logo'}</span>
          </div>
          <div className={`easter-item ${activeEasterEggs.includes('sunmoon') ? 'unlocked' : ''}`}>
            <span>☀️ Sun Moon Founder</span>
            <span className="easter-status">{activeEasterEggs.includes('sunmoon') ? '✅ FOUND' : 'Click the sun'}</span>
          </div>
          <div className={`easter-item koi-egg-item ${activeEasterEggs.includes('koi') ? 'unlocked koi-found' : ''}`}>
            <span>🐟 Golden Koi</span>
            {activeEasterEggs.includes('koi') ? (
              <span className="easter-status koi-tick">
                <span className="green-tick">✅</span> FOUND!
              </span>
            ) : (
              <span className="easter-status koi-hint">Find it in the water 👁</span>
            )}
          </div>

        </div>
      </div>

      {/* Secret Omega protocol if discovered */}
      {easterEggFound && (
        <div className="lp-omega-secret">
          👁 OMEGA RANGER CLEARANCE UNLOCKED
        </div>
      )}

      <div className="lp-footer">CODE MONKEY • FOREST GUARDIAN v3.0</div>
    </aside>
  )
}
