import './RockShelf.css'

export default function RockShelf({ collectedRocks }) {
  const MAX = 6
  return (
    <aside className="rock-shelf">
      <div className="shelf-title">SHELF</div>
      <div className="shelf-board">
        <div className="shelf-slots">
          {Array.from({ length: MAX }).map((_, i) => {
            const rock = collectedRocks[i]
            return (
              <div key={i} className={`shelf-slot ${rock ? 'filled' : 'empty'}`}>
                {rock ? (
                  <div
                    className="shelf-rock"
                    style={{
                      background: `radial-gradient(ellipse at 35% 30%, ${rock.color}ee, ${rock.color}88 55%, ${rock.color}33 100%)`,
                      boxShadow: `0 0 14px ${rock.glow}99, inset 0 2px 8px rgba(255,255,255,0.2), inset 0 -4px 8px rgba(0,0,0,0.3)`,
                      borderColor: `${rock.color}55`,
                    }}
                  >
                    <span className="shelf-rock-letter">{rock.letter}</span>
                    <div className="shelf-rock-shine" />
                  </div>
                ) : (
                  <div className="slot-num">{i + 1}</div>
                )}
              </div>
            )
          })}
        </div>
        {/* Wooden plank */}
        <div className="shelf-plank">
          <div className="plank-edge" />
          <div className="plank-top" />
        </div>
      </div>

      <div className="shelf-count">
        <span className="sc-num">{collectedRocks.length}</span>
        <span className="sc-sep">/</span>
        <span className="sc-max">{MAX}</span>
      </div>
      <div className="shelf-label">COLLECTED</div>

      {collectedRocks.length > 0 && (
        <div className="shelf-code-preview">
          {collectedRocks.map((r, i) => (
            <span key={r.id} className="code-char" style={{ color: r.color, textShadow: `0 0 8px ${r.glow}` }}>
              {r.letter}
            </span>
          ))}
        </div>
      )}
    </aside>
  )
}
