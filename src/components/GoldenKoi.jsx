import { useState } from 'react'
import './GoldenKoi.css'

export default function GoldenKoi({ onCatch }) {
  const [jumping, setJumping] = useState(false)

  const handleClick = (e) => {
    e.stopPropagation()
    if (jumping) return
    setJumping(true)
    onCatch?.()
    setTimeout(() => setJumping(false), 2400)
  }

  return (
    <div
      className={`golden-koi-wrapper ${jumping ? 'koi-jumping' : ''}`}
      onClick={handleClick}
      title="🐟 Secret Golden Koi — Click to catch!"
    >
      {/* Golden Aura Glow */}
      <div className="koi-glow-aura" />

      {/* Ripple Rings */}
      <div className="koi-water-ripple ripple-1" />
      <div className="koi-water-ripple ripple-2" />

      {/* Koi Body SVG */}
      <div className="koi-fish-body">
        <svg
          viewBox="0 0 100 44"
          className="koi-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="koiGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="75%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <radialGradient id="koiEyeGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            <linearGradient id="finGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Tail Fin */}
          <path
            d="M 16,22 C 8,10 0,6 2,14 C 4,20 10,22 10,22 C 10,22 4,24 2,30 C 0,38 8,34 16,22 Z"
            fill="url(#finGrad)"
            className="koi-tail"
          />

          {/* Dorsal Fin */}
          <path
            d="M 40,12 C 48,2 62,4 66,12 Z"
            fill="url(#finGrad)"
            className="koi-dorsal"
          />

          {/* Pectoral Fins */}
          <path
            d="M 64,26 C 68,36 78,38 72,28 Z"
            fill="url(#finGrad)"
            className="koi-pec-fin"
          />

          {/* Main Fish Body */}
          <path
            d="M 14,22 C 22,12 45,9 72,13 C 86,15 94,20 94,22 C 94,24 86,29 72,31 C 45,35 22,32 14,22 Z"
            fill="url(#koiGoldGrad)"
            stroke="#fef08a"
            strokeWidth="0.8"
          />

          {/* Orange/Red Royal Koi Patterns */}
          <path
            d="M 50,12 C 56,10 65,11 68,16 C 64,22 52,20 50,12 Z"
            fill="#dc2626"
            opacity="0.85"
          />
          <path
            d="M 30,17 C 36,15 42,16 44,23 C 38,28 31,25 30,17 Z"
            fill="#ea580c"
            opacity="0.9"
          />
          <path
            d="M 72,16 C 76,14 82,16 83,20 C 80,24 74,23 72,16 Z"
            fill="#f97316"
            opacity="0.85"
          />

          {/* Shiny Scale Arcs */}
          <path d="M 38,18 Q 42,22 38,26" stroke="#fef08a" strokeWidth="0.75" fill="none" opacity="0.7" />
          <path d="M 46,17 Q 50,22 46,27" stroke="#fef08a" strokeWidth="0.75" fill="none" opacity="0.7" />
          <path d="M 54,16 Q 58,22 54,28" stroke="#fef08a" strokeWidth="0.75" fill="none" opacity="0.7" />
          <path d="M 62,17 Q 66,22 62,27" stroke="#fef08a" strokeWidth="0.75" fill="none" opacity="0.7" />

          {/* Eye */}
          <circle cx="84" cy="19" r="2.8" fill="url(#koiEyeGrad)" />
          <circle cx="85" cy="18" r="0.9" fill="#ffffff" />

          {/* Whiskers */}
          <path d="M 92,20 Q 98,18 100,16" stroke="#fbbf24" strokeWidth="0.7" fill="none" />
          <path d="M 92,24 Q 98,26 100,28" stroke="#fbbf24" strokeWidth="0.7" fill="none" />
        </svg>
      </div>

      {/* Interactive Floating Label on Hover */}
      <span className="koi-hover-tag">✨ Golden Koi</span>

      {/* Water splash when jumping */}
      {jumping && <div className="koi-leap-splash" />}
    </div>
  )
}
