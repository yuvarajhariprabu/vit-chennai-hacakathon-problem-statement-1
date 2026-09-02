import { useState, useEffect, useCallback, useRef } from 'react'
import { useTimer } from '../hooks/useTimer'
import RealisticForestBackground from './RealisticForestBackground'
import Hourglass from './Hourglass'
import SpawnedAnimal from './SpawnedAnimal'
import CatchingNet from './CatchingNet'
import LeftPanel from './LeftPanel'
import AnimalShelf from './AnimalShelf'
import MonkeyKingPopup from './MonkeyKingPopup'
import GoldenKoiPopup from './GoldenKoiPopup'
import StatusMessage from './StatusMessage'
import './LoadingExperience.css'

const FOREST_ANIMALS = [
  { id: 0, name: 'Rusty Fox',   emoji: '🦊', colorName: 'Red',    letter: 'R', color: '#ef4444', glow: '#dc2626' },
  { id: 1, name: 'Elder Owl',   emoji: '🦉', colorName: 'Orange', letter: 'O', color: '#f97316', glow: '#ea580c' },
  { id: 2, name: 'Sun Rabbit',  emoji: '🐰', colorName: 'Yellow', letter: 'Y', color: '#eab308', glow: '#ca8a04' },
  { id: 3, name: 'Moss Frog',   emoji: '🐸', colorName: 'Green',  letter: 'G', color: '#22c55e', glow: '#16a34a' },
  { id: 4, name: 'Mystic Stag', emoji: '🦌', colorName: 'Blue',   letter: 'B', color: '#3b82f6', glow: '#2563eb' }
]



const MESSAGES = [
  'ANCIENT FOREST AWAKENS…',
  'ANIMALS POP IN AND VANISH — BE QUICK!',
  'CLICK BEFORE THEY TELEPORT AWAY…',
  'RESCUE ALL 5 INTO THE SANCTUARY…',
  'DECODE THE SECRET COLOR RUNES…',
  'ENTER THE FIRST LETTER OF EACH COLOR…',
  'FOREST HARMONY GROWS STRONGER…',
  'HURRY — FINAL MOMENTS REMAIN…',
  'ONE LAST CHANCE!',
  'HARMONY ACHIEVED!'
]

const TORCH_RADIUS = 145 // px around mouse that lights up in night mode
const LEFT_PANEL_W = 290
const RIGHT_COL_W  = 230

// Pick a random position inside the center game area
function randomPosition() {
  return { x: 12 + Math.random() * 76, y: 14 + Math.random() * 68 }
}

// Pick a position that doesn't visually overlap any already-placed animal.
// Each animal card is ~90px; we work in %-coords and keep a comfortable gap.
const MIN_GAP_X = 16  // percent
const MIN_GAP_Y = 20  // percent

function randomPositionNoOverlap(existing = [], attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    const candidate = randomPosition()
    const tooClose = existing.some(
      p => Math.abs(p.x - candidate.x) < MIN_GAP_X &&
           Math.abs(p.y - candidate.y) < MIN_GAP_Y
    )
    if (!tooClose) return candidate
  }
  // All attempts failed (very crowded) — just return any position
  return randomPosition()
}

// Is an animal (in %-coords inside center area) within the torch radius?
function calcIsInTorch(pos, mousePos) {
  const centerW = window.innerWidth - LEFT_PANEL_W - RIGHT_COL_W
  const screenX = LEFT_PANEL_W + (pos.x / 100) * centerW
  const screenY = (pos.y / 100) * window.innerHeight
  const dx = screenX - mousePos.x
  const dy = screenY - mousePos.y
  return Math.sqrt(dx * dx + dy * dy) <= TORCH_RADIUS
}

export default function LoadingExperience({ onComplete }) {
  const { progress, remaining, isComplete, start } = useTimer()

  const [mousePos, setMousePos] = useState({ x: -999, y: -999 })
  const [isSwinging, setIsSwinging] = useState(false)

  const [screenAnimals, setScreenAnimals] = useState([])
  const [collectedAnimals, setCollectedAnimals] = useState([])

  const [typedCode, setTypedCode] = useState('')

  // Track pending respawn timers so we can cancel them on double-calls
  const respawnTimers = useRef({})

  // Stats
  const [catches, setCatches] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [catchLabel, setCatchLabel] = useState(null)
  const catchLabelTimer = useRef(null)
  const comboTimer = useRef(null)

  // Night mode (sun→moon torch)
  const [isNightMode, setIsNightMode] = useState(false)
  const [sunPhase, setSunPhase] = useState('sun') // 'sun' | 'transitioning' | 'moon'

  // Easter eggs
  const [showMonkeyKing, setShowMonkeyKing] = useState(false)
  const [showKoiPopup,   setShowKoiPopup]   = useState(false)
  const [easterEggFound, setEasterEggFound] = useState(false)
  const [activeEasterEggs, setActiveEasterEggs] = useState([])

  // Spirit easter egg popup
  const [spiritMessage, setSpiritMessage] = useState(false)

  useEffect(() => { start() }, [start])

  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [])

  // Spawn ALL 5 animals on start with random delays (0–4 seconds each)
  useEffect(() => {
    const timers = FOREST_ANIMALS.map(animal => {
      const delay = Math.random() * 4000  // 0 to 4 seconds
      return setTimeout(() => {
        setScreenAnimals(prev => {
          if (prev.some(a => a.animal.id === animal.id)) return prev  // guard
          const existingPositions = prev.map(a => a.position)
          return [...prev, {
            instanceId: `${animal.id}-${Date.now()}`,
            animal,
            position: randomPositionNoOverlap(existingPositions)
          }]
        })
      }, delay)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        onComplete({ catches, bestCombo, animalsRescued: collectedAnimals.length, easterEgg: easterEggFound })
      }, 1500)
    }
  }, [isComplete, catches, bestCombo, collectedAnimals.length, easterEggFound, onComplete])

  // Catch animal
  const handleCatch = useCallback((instanceId, animal) => {
    setScreenAnimals(prev => prev.filter(a => a.instanceId !== instanceId))
    const nc = catches + 1; const nb = combo + 1
    setCatches(nc); setCombo(nb)
    if (nb > bestCombo) setBestCombo(nb)
    const label = nb >= 3 ? `🔥 COMBO ×${nb}!` : `✨ ${animal.emoji} ${animal.name.toUpperCase()} RESCUED!`
    clearTimeout(catchLabelTimer.current)
    setCatchLabel(label)
    catchLabelTimer.current = setTimeout(() => setCatchLabel(null), 1200)
    clearTimeout(comboTimer.current)
    comboTimer.current = setTimeout(() => setCombo(0), 2200)
    setCollectedAnimals(prev => [...prev, animal])
    setIsSwinging(true); setTimeout(() => setIsSwinging(false), 350)
  }, [catches, combo, bestCombo])

  // Animal expired — vanish, then reappear at a new random spot after 1.2s
  const handleExpire = useCallback((instanceId) => {
    setCombo(0)

    // Cancel any existing pending respawn for this slot (prevents double-adds)
    clearTimeout(respawnTimers.current[instanceId])

    // Find the animal record BEFORE removing from state
    setScreenAnimals(prev => {
      const found = prev.find(a => a.instanceId === instanceId)
      if (!found) return prev  // already gone (guard against double-call)

      // Schedule respawn OUTSIDE the state updater to avoid double-invocation
      const animalData = found.animal
      respawnTimers.current[instanceId] = setTimeout(() => {
        const newId = `${animalData.id}-${Date.now()}`
        setScreenAnimals(curr => {
          // Guard: never add if this animal is already visible on screen
          const alreadyVisible = curr.some(a => a.animal.id === animalData.id)
          if (alreadyVisible) return curr
          const existingPositions = curr.map(a => a.position)
          return [...curr, {
            instanceId: newId,
            animal: animalData,
            position: randomPositionNoOverlap(existingPositions)
          }]
        })
      }, 1200)

      return prev.filter(a => a.instanceId !== instanceId)
    })
  }, [])

  // Sun → Moon toggle
  const handleSunClick = () => {
    if (sunPhase !== 'sun') return
    setSunPhase('transitioning')
    setTimeout(() => {
      setSunPhase('moon')
      setIsNightMode(true)
    }, 600)
  }

  const handleMoonClick = () => {
    setSunPhase('sun')
    setIsNightMode(false)
  }

  // Easter eggs
  const handleEasterEggTrigger = useCallback((type) => {
    setActiveEasterEggs(prev => prev.includes(type) ? prev : [...prev, type])
    setEasterEggFound(true)

    if (type === 'koi')    setShowKoiPopup(true)
    if (type === 'spirit') { setSpiritMessage(true); setTimeout(() => setSpiritMessage(false), 4500) }
  }, [])

  const handleLogoClick = useCallback(() => {
    setShowMonkeyKing(true)
    handleEasterEggTrigger('monkey')
  }, [handleEasterEggTrigger])

  const msgIndex = Math.min(Math.floor(progress * MESSAGES.length), MESSAGES.length - 1)

  return (
    <div className="loading-root">
      <RealisticForestBackground
        progress={progress}
        isNightMode={isNightMode}
        onEasterEggTrigger={handleEasterEggTrigger}
      />

      <LeftPanel
        collectedAnimals={collectedAnimals}
        typedCode={typedCode}
        onType={setTypedCode}
        easterEggFound={easterEggFound}
        onLogoClick={handleLogoClick}
        activeEasterEggs={activeEasterEggs}
      />

      {/* Center Game Area */}
      <div className="center-area" onClick={() => { setIsSwinging(true); setTimeout(() => setIsSwinging(false), 300) }}>

        {/* HUD */}
        <div className="hud">
          <div className="hud-item">RESCUED <span>{collectedAnimals.length}/5</span></div>
          <div className="hud-item">COMBO <span>×{combo}</span></div>
          <div className="hud-item">STREAK <span>{catches}</span></div>
        </div>

        {/* ☀️ Sun / 🌙 Moon toggle button */}
        <div
          className={`sun-moon-btn phase-${sunPhase}`}
          onClick={sunPhase === 'sun' ? handleSunClick : handleMoonClick}
          title={sunPhase === 'sun' ? 'Touch the Sun…' : 'Restore Daylight'}
        >
          {sunPhase === 'sun' ? '☀️' : sunPhase === 'transitioning' ? '🌅' : '🌙'}
        </div>

        {/* Night mode hint */}
        {isNightMode && (
          <div className="night-hint">🔦 Move mouse to light the forest — find the animals!</div>
        )}

        {/* Randomly placed animals */}
        {screenAnimals.map(({ instanceId, animal, position }) => (
          <SpawnedAnimal
            key={instanceId}
            animal={animal}
            position={position}
            onCatch={() => handleCatch(instanceId, animal)}
            onExpire={() => handleExpire(instanceId)}
            isNightMode={isNightMode}
            isInTorch={isNightMode ? calcIsInTorch(position, mousePos) : true}
          />
        ))}

        {screenAnimals.length === 0 && collectedAnimals.length < 5 && (
          <div className="center-idle-hint">👁 Watch for animals popping out of the hourglass…</div>
        )}

        {collectedAnimals.length >= 5 && (
          <div className="all-rescued-banner">🏆 ALL 5 FOREST ANIMALS RESCUED!</div>
        )}

        {/* Floating catch label */}
        {catchLabel && (
          <div className="hit-label" style={{ left: mousePos.x, top: mousePos.y - 60 }}>{catchLabel}</div>
        )}

        <div className="status-bar">
          <StatusMessage message={MESSAGES[msgIndex]} remaining={remaining} />
        </div>
      </div>

      {/* Night mode torch overlay — darkens everything outside the torch radius */}
      {isNightMode && (
        <div
          className="torch-overlay"
          style={{ '--mx': `${mousePos.x}px`, '--my': `${mousePos.y}px` }}
        />
      )}

      {/* Right Column: compact Hourglass + Sanctuary */}
      <div className="right-column">
        <div className="hourglass-compact-panel">
          <Hourglass progress={progress} remaining={remaining} compact />
        </div>
        <AnimalShelf collectedAnimals={collectedAnimals} totalAnimals={5} />
      </div>

      {/* Catching net cursor */}
      <CatchingNet mousePos={mousePos} isSwinging={isSwinging} />

      {/* ─── Easter Egg Popups ──────────────────────────── */}
      <MonkeyKingPopup show={showMonkeyKing} onClose={() => setShowMonkeyKing(false)} />
      <GoldenKoiPopup  show={showKoiPopup}   onClose={() => setShowKoiPopup(false)} />

      {/* Tree Guardian Spirit popup */}
      {spiritMessage && (
        <div className="easter-popup spirit-popup">
          <div className="ep-fish">🦌🌲✨</div>
          <div className="ep-title">TREE GUARDIAN AWAKENED!</div>
          <div className="ep-sub">The ancient spirit of the forest reveals itself.<br/>The trees bow as the Guardian blesses your quest!</div>
        </div>
      )}
    </div>
  )
}
