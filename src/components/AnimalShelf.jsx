import './AnimalShelf.css'

export default function AnimalShelf({ collectedAnimals, totalAnimals = 5 }) {
  return (
    <aside className="animal-shelf-container">
      <div className="shelf-header">
        <div className="shelf-badge-icon">🌲</div>
        <div className="shelf-title-text">ANIMAL SANCTUARY</div>
        <div className="shelf-subtitle">RESCUED FROM TIME</div>
      </div>

      <div className="shelf-boxes-grid">
        {Array.from({ length: totalAnimals }).map((_, i) => {
          const animal = collectedAnimals[i]
          return (
            <div
              key={i}
              className={`animal-shelf-box ${animal ? 'occupied' : 'unrescued'}`}
              style={animal ? { '--box-color': animal.color, '--box-glow': animal.glow } : {}}
            >
              {animal ? (
                <div className="box-content-active">
                  {/* Animal Cute Face & Glow */}
                  <div className="shelf-animal-avatar">
                    <span className="shelf-emoji">{animal.emoji}</span>
                    <div className="face-halo" />
                  </div>

                  {/* Animal Details */}
                  <div className="shelf-animal-meta">
                    <span className="shelf-animal-name">{animal.name}</span>
                    <span className="shelf-letter-pill">{animal.letter}</span>
                  </div>

                  {/* Rarity & Star Badge */}
                  <div className="shelf-status-tag">
                    <span className="check-star">★ RESCUED</span>
                  </div>
                </div>
              ) : (
                <div className="box-content-empty">
                  <div className="mystery-silhouette">?</div>
                  <span className="slot-index-label">SLOT 0{i + 1}</span>
                  <span className="slot-hint">Awaiting rescue…</span>
                </div>
              )}

              {/* Wooden frame trim */}
              <div className="box-wood-trim" />
            </div>
          )
        })}
      </div>

      {/* Progress counter */}
      <div className="shelf-progress-footer">
        <div className="counter-large">
          <span className="num-active">{collectedAnimals.length}</span>
          <span className="num-slash">/</span>
          <span className="num-total">{totalAnimals}</span>
        </div>
        <div className="counter-label">ANIMALS RESCUED</div>

        {/* Rescued Sequence preview */}
        {collectedAnimals.length > 0 && (
          <div className="rescued-letters-strip">
            {collectedAnimals.map((a, idx) => (
              <span
                key={a.id || idx}
                className="letter-token"
                style={{ color: a.color, textShadow: `0 0 10px ${a.glow}` }}
                title={`${a.name} (${a.letter})`}
              >
                {a.letter}
              </span>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
