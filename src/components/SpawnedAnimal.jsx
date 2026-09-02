import { useEffect, useState, useRef } from 'react'
import './SpawnedAnimal.css'

const LIFETIME_MS = 2000   // 2 seconds visible
const POP_IN_MS   = 350    // pop-in animation duration

export default function SpawnedAnimal({ animal, position, onCatch, onExpire, isNightMode, isInTorch }) {
  const [phase, setPhase] = useState('popping')
  const [timeLeft, setTimeLeft] = useState(1)   // 1 → 0 fraction for ring
  const catchedRef = useRef(false)

  // ── One-shot lifecycle ──────────────────────────────
  useEffect(() => {
    catchedRef.current = false

    // 1. Pop-in → alive after POP_IN_MS
    const popTimer = setTimeout(() => setPhase('alive'), POP_IN_MS)

    // 2. Start countdown ring immediately (runs for full LIFETIME_MS)
    const startedAt = Date.now()
    let rafId
    const tick = () => {
      const elapsed = Date.now() - startedAt
      const fraction = Math.max(0, 1 - elapsed / LIFETIME_MS)
      setTimeLeft(fraction)
      if (fraction > 0) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)

    // 3. After LIFETIME_MS, if not caught → expire animation then notify parent
    const expireTimer = setTimeout(() => {
      if (catchedRef.current) return
      setPhase('expiring')
      setTimeout(() => {
        if (!catchedRef.current) onExpire()
      }, 350)
    }, LIFETIME_MS)

    return () => {
      clearTimeout(popTimer)
      clearTimeout(expireTimer)
      cancelAnimationFrame(rafId)
    }
  }, []) // ← EMPTY deps — runs exactly once per mount. onExpire handled via ref below.

  // Keep onExpire up to date via ref so stale-closure isn't an issue
  const onExpireRef = useRef(onExpire)
  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  const handleClick = (e) => {
    e.stopPropagation()
    if (catchedRef.current || phase === 'expiring') return
    if (isNightMode && !isInTorch) return  // can't catch in dark outside torch
    catchedRef.current = true
    setPhase('caught')
    onCatch()
  }

  const visibility = isNightMode && !isInTorch ? 'hidden' : 'visible'
  const circumference = 2 * Math.PI * 28

  return (
    <div
      className={`spawned-animal phase-${phase}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        '--animal-color': animal.color,
        '--animal-glow': animal.glow,
        visibility,
        zIndex: isNightMode ? 600 : 30
      }}
      onClick={handleClick}
    >
      {/* Countdown Ring */}
      {phase !== 'caught' && phase !== 'expiring' && (
        <svg className="countdown-ring" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          <circle
            cx="35" cy="35" r="28"
            fill="none"
            stroke={animal.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - timeLeft)}
            transform="rotate(-90 35 35)"
            style={{ filter: `drop-shadow(0 0 6px ${animal.glow})` }}
          />
        </svg>
      )}

      {/* Animal Card */}
      <div className="sa-card">
        <div className="sa-aura" />
        {isNightMode && isInTorch && <div className="sa-torch-glow" />}
        <span className="sa-emoji">{animal.emoji}</span>
        <div className="sa-label">
          <span className="sa-name">{animal.name}</span>
          <span className="sa-letter" style={{ color: animal.color }}>{animal.letter}</span>
        </div>
        {(!isNightMode || isInTorch) && (
          <div className="sa-catch-hint">{isNightMode ? '🔦 CLICK!' : 'TAP TO CATCH!'}</div>
        )}
      </div>
    </div>
  )
}
