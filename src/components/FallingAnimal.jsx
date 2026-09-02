import { useEffect, useState } from 'react'
import './FallingAnimal.css'

export default function FallingAnimal({ animal, onCatch, isCaught }) {
  const [bouncyBalls, setBouncyBalls] = useState([])

  // Generate bouncy magical balls when animal emerges from hourglass
  useEffect(() => {
    if (!animal) return
    const colors = [animal.color, '#38bdf8', '#fbbf24', '#4ade80', '#c084fc', '#f43f5e']
    const balls = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 160,
      y: Math.random() * 60 + 20,
      size: Math.random() * 12 + 10,
      color: colors[i % colors.length],
      delay: i * 0.08,
      duration: 1.2 + Math.random() * 0.6
    }))
    setBouncyBalls(balls)
  }, [animal?.id])

  if (!animal) return null

  return (
    <div className={`falling-animal-container ${isCaught ? 'caught-fly' : 'tumbling-in'}`}>
      {/* Bouncy Orbs emerging with the animal from the hourglass */}
      {!isCaught && bouncyBalls.map((ball) => (
        <div
          key={ball.id}
          className="bouncy-orb"
          style={{
            '--tx': `${ball.x}px`,
            '--ty': `${ball.y}px`,
            '--ball-color': ball.color,
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            animationDelay: `${ball.delay}s`,
            animationDuration: `${ball.duration}s`
          }}
        />
      ))}

      {/* Main Falling Animal Body */}
      <div
        className="animal-card-interactive"
        onClick={onCatch}
        style={{ '--animal-color': animal.color, '--animal-glow': animal.glow }}
      >
        {/* Glow Aura */}
        <div className="animal-aura" />

        {/* Animal Face Container */}
        <div className="animal-face-display">
          <span className="animal-emoji">{animal.emoji}</span>
          <div className="animal-shine" />
        </div>

        {/* Species & Letter Tag */}
        <div className="animal-info-tag">
          <span className="animal-letter-badge">{animal.letter}</span>
          <span className="animal-name-label">{animal.name}</span>
        </div>

        {/* Catch prompt / HP meter */}
        <div className="catch-prompt-pill">
          <span className="net-icon">🕸️</span>
          <span>SWIPE OR CLICK TO CATCH</span>
        </div>
      </div>
    </div>
  )
}
