import { useEffect, useRef } from 'react'
import './Rock.css'

const CRACK_STAGES = ['', 'crack-1', 'crack-2', 'crack-3', 'crack-4', 'crack-5', 'crack-6', 'broken']

export default function Rock({ rock, onHit }) {
  const stageIndex = Math.min(
    Math.floor((rock.damage / 100) * (CRACK_STAGES.length - 1)),
    CRACK_STAGES.length - 1
  )
  const stage = CRACK_STAGES[stageIndex]
  const isBreaking = rock.breaking

  // Inline color styles for this rock
  const surfaceStyle = {
    background: `radial-gradient(ellipse at 35% 32%, ${rock.color}cc 0%, ${rock.color}88 38%, ${rock.color}44 65%, #1a1f2e 100%)`,
    boxShadow: `
      inset -10px -10px 24px rgba(0,0,0,0.55),
      inset 5px 5px 14px rgba(255,255,255,0.08),
      0 10px 36px rgba(0,0,0,0.65),
      0 0 22px ${rock.glow}55,
      0 0 0 1px ${rock.color}33
    `,
  }

  return (
    <div
      className={`rock-wrap ${stage} ${isBreaking ? 'fly-to-shelf' : 'fall-in'}`}
      onClick={!isBreaking ? onHit : undefined}
    >
      <div className="rock-body">
        <div className="rock-surface" style={surfaceStyle} />
        <div className="rock-highlight" />
        <div className="rock-shadow" />

        {/* Color name badge */}
        <div className="rock-color-badge" style={{ color: rock.color, textShadow: `0 0 8px ${rock.glow}` }}>
          {rock.letter}
        </div>

        {/* SVG Cracks */}
        {stageIndex >= 1 && (
          <svg className="crack-svg" viewBox="0 0 120 100" fill="none">
            {stageIndex >= 1 && <path d="M60 10 L45 38 L55 38 L35 75" stroke="rgba(0,0,0,0.75)" strokeWidth="1.8"/>}
            {stageIndex >= 2 && <path d="M62 10 L76 42 L65 42 L84 79" stroke="rgba(0,0,0,0.65)" strokeWidth="1.6"/>}
            {stageIndex >= 3 && <path d="M30 28 L50 50 L39 56 L57 82" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2"/>}
            {stageIndex >= 4 && <path d="M82 18 L64 50 L75 55 L60 86" stroke="rgba(0,0,0,0.65)" strokeWidth="1.4"/>}
            {stageIndex >= 5 && <path d="M18 50 L44 52 L50 72 L72 52 L97 50" stroke="rgba(0,0,0,0.5)" strokeWidth="1.1"/>}
            {stageIndex >= 6 && (
              <>
                <path d="M38 14 L55 36 M66 18 L77 46 M28 62 L56 66 M70 62 L92 72"
                  stroke={`${rock.color}88`} strokeWidth="1"/>
                <path d="M55 10 L60 32 L50 32 L60 60"
                  stroke="rgba(255,200,100,0.5)" strokeWidth="0.9"/>
              </>
            )}
          </svg>
        )}
      </div>

      {/* Rock name */}
      <div className="rock-label" style={{ color: `${rock.color}aa` }}>{rock.name}</div>

      {/* HP bar */}
      <div className="rock-hp">
        <div
          className="rock-hp-bar"
          style={{
            width: `${Math.max(0, 100 - rock.damage)}%`,
            background: `linear-gradient(90deg, ${rock.glow}, ${rock.color})`,
            boxShadow: `0 0 8px ${rock.glow}88`,
          }}
        />
      </div>

      {/* "CLICK TO BREAK" hint on first appear */}
      {stageIndex === 0 && !isBreaking && (
        <div className="rock-click-hint">CLICK TO BREAK</div>
      )}
    </div>
  )
}
