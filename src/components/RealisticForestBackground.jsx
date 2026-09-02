import { useEffect, useRef, useState } from 'react'
import './RealisticForestBackground.css'

export default function RealisticForestBackground({ progress, isNightMode, onEasterEggTrigger }) {
  const canvasRef = useRef(null)
  const [koiJumping, setKoiJumping] = useState(false)
  const [spiritVisible, setSpiritVisible] = useState(false)
  const [koiPos, setKoiPos] = useState({ x: 0.4, y: 0.82 })  // fraction of W,H
  const koiPosRef = useRef({ x: 0.4, y: 0.82 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    let startTime = null

    // Firefly particles
    const fireflies = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.85,
      radius: Math.random() * 2.5 + 1.2,
      baseAlpha: Math.random() * 0.7 + 0.3,
      alphaSpeed: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.4 - 0.1,
      hue: Math.random() > 0.3 ? 85 : 50, // Golden-green or warm amber
      phase: Math.random() * Math.PI * 2
    }))

    // Falling leaves
    const leaves = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 4,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      swing: Math.random() * Math.PI * 2,
      color: ['#4ade80', '#22c55e', '#15803d', '#ca8a04', '#b45309'][Math.floor(Math.random() * 5)],
      opacity: Math.random() * 0.6 + 0.4
    }))

    // Mist clouds
    const mistClouds = Array.from({ length: 6 }, (_, i) => ({
      x: (i * window.innerWidth) / 4,
      y: window.innerHeight * (0.65 + Math.random() * 0.2),
      width: Math.random() * 400 + 350,
      height: Math.random() * 100 + 80,
      speed: 0.2 + Math.random() * 0.25,
      opacity: 0.15 + Math.random() * 0.15
    }))

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const render = (ts) => {
      if (!startTime) startTime = ts
      const t = (ts - startTime) / 1000
      const W = canvas.width
      const H = canvas.height

      ctx.clearRect(0, 0, W, H)

      // 1. Drifting Mist above the forest floor & stream
      mistClouds.forEach((cloud) => {
        cloud.x += cloud.speed
        if (cloud.x > W + 200) cloud.x = -cloud.width

        const grad = ctx.createRadialGradient(
          cloud.x + cloud.width / 2,
          cloud.y,
          10,
          cloud.x + cloud.width / 2,
          cloud.y,
          cloud.width / 2
        )
        grad.addColorStop(0, `rgba(180, 230, 200, ${cloud.opacity})`)
        grad.addColorStop(0.6, `rgba(120, 180, 150, ${cloud.opacity * 0.4})`)
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.ellipse(cloud.x + cloud.width / 2, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2)
        ctx.fill()
      })

      // 2. Animated God Rays (Sunlight filtering through canopy)
      ctx.save()
      for (let i = 0; i < 4; i++) {
        const rayX = W * 0.15 + i * (W * 0.25)
        const rayAngle = -0.35 + i * 0.08
        const pulse = Math.sin(t * 0.6 + i * 1.5) * 0.04 + 0.06
        const rayGrad = ctx.createLinearGradient(rayX, 0, rayX + Math.sin(rayAngle) * H, H)
        rayGrad.addColorStop(0, `rgba(210, 255, 170, ${pulse * 1.5})`)
        rayGrad.addColorStop(0.4, `rgba(180, 240, 140, ${pulse * 0.8})`)
        rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = rayGrad
        ctx.beginPath()
        ctx.moveTo(rayX - 30, 0)
        ctx.lineTo(rayX + 60, 0)
        ctx.lineTo(rayX + 180 + Math.sin(rayAngle) * H, H)
        ctx.lineTo(rayX - 100 + Math.sin(rayAngle) * H, H)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      // 3. Falling Leaves
      leaves.forEach((leaf) => {
        leaf.y += leaf.speedY
        leaf.x += Math.sin(t * 1.5 + leaf.swing) * 1.2 + leaf.speedX
        leaf.rotation += leaf.rotSpeed

        if (leaf.y > H + 20) {
          leaf.y = -20
          leaf.x = Math.random() * W
        }

        ctx.save()
        ctx.translate(leaf.x, leaf.y)
        ctx.rotate(leaf.rotation)
        ctx.globalAlpha = leaf.opacity
        ctx.fillStyle = leaf.color

        ctx.beginPath()
        ctx.ellipse(0, 0, leaf.size, leaf.size * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()

        // Leaf vein
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(-leaf.size * 0.8, 0)
        ctx.lineTo(leaf.size * 0.8, 0)
        ctx.stroke()

        ctx.restore()
      })

      // 4. Glowing Fireflies (with pulsing light corona)
      fireflies.forEach((ff) => {
        ff.x += ff.vx + Math.sin(t * 1.2 + ff.phase) * 0.4
        ff.y += ff.vy + Math.cos(t * 0.9 + ff.phase) * 0.3

        if (ff.x < -20) ff.x = W + 20
        if (ff.x > W + 20) ff.x = -20
        if (ff.y < 0) ff.y = H * 0.85
        if (ff.y > H * 0.88) ff.y = H * 0.2

        const currentAlpha = (Math.sin(t * ff.alphaSpeed + ff.phase) * 0.5 + 0.5) * ff.baseAlpha

        // Outer glow
        const glow = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.radius * 6)
        glow.addColorStop(0, `hsla(${ff.hue}, 95%, 65%, ${currentAlpha * 0.8})`)
        glow.addColorStop(0.5, `hsla(${ff.hue}, 90%, 50%, ${currentAlpha * 0.3})`)
        glow.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(ff.x, ff.y, ff.radius * 6, 0, Math.PI * 2)
        ctx.fill()

        // Bright core
        ctx.fillStyle = `rgba(255, 255, 220, ${currentAlpha})`
        ctx.beginPath()
        ctx.arc(ff.x, ff.y, ff.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // 5. Water Shimmer on the bottom stream (rendered BEFORE the fish)
      const streamY = H * 0.76
      const streamH = H * 0.22
      for (let s = 0; s < 10; s++) {
        const sx = ((s * (W / 8) + t * 40) % (W + 120)) - 60
        const sy = streamY + (s % 4) * (streamH / 4) + Math.sin(t * 2 + s) * 4
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(sx, sy, 35 + (s % 3) * 10, 2.5, 0, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(160, 240, 200, ${0.14 + Math.sin(t * 3 + s) * 0.07})`
        ctx.fill()
        ctx.restore()
      }

      // 6. Golden Koi — visible in the water, swims lazily
      const koiX = W * 0.32 + Math.sin(t * 0.28) * W * 0.22
      const koiY = streamY + streamH * 0.38 + Math.cos(t * 0.45) * streamH * 0.20
      const koiAngle = Math.atan2(
        Math.cos(t * 0.45) * streamH * 0.20 * 0.45,
        Math.cos(t * 0.28) * W * 0.22 * 0.28
      )

      // Update shared ref for click hitzone
      koiPosRef.current = { x: koiX / W, y: koiY / H, angle: koiAngle }

      ctx.save()
      ctx.translate(koiX, koiY)
      ctx.rotate(koiAngle)

      // Golden glow aura behind the fish
      const glowR = ctx.createRadialGradient(0, 0, 5, 0, 0, 55)
      glowR.addColorStop(0,   `rgba(255, 200, 30, ${0.45 + Math.sin(t * 1.8) * 0.12})`)
      glowR.addColorStop(0.5, `rgba(220, 150, 10, ${0.20 + Math.sin(t * 1.8) * 0.06})`)
      glowR.addColorStop(1,   'rgba(180, 100, 0, 0.0)')
      ctx.beginPath()
      ctx.ellipse(0, 0, 55, 22, 0, 0, Math.PI * 2)
      ctx.fillStyle = glowR
      ctx.fill()

      // Body — bright golden
      ctx.globalAlpha = 0.82 + Math.sin(t * 1.2) * 0.06
      const bodyGrd = ctx.createLinearGradient(-40, 0, 40, 0)
      bodyGrd.addColorStop(0,    'rgba(180,110, 5, 0.0)')
      bodyGrd.addColorStop(0.12, 'rgba(255,190,20, 1.0)')
      bodyGrd.addColorStop(0.45, 'rgba(255,220,60, 1.0)')
      bodyGrd.addColorStop(0.78, 'rgba(240,170,15, 1.0)')
      bodyGrd.addColorStop(1,    'rgba(160, 90, 5, 0.0)')
      ctx.beginPath()
      ctx.ellipse(0, 0, 40, 14, 0, 0, Math.PI * 2)
      ctx.fillStyle = bodyGrd
      ctx.fill()

      // Scale arcs
      ctx.strokeStyle = 'rgba(160, 80, 0, 0.5)'
      ctx.lineWidth = 1
      for (let sc = -4; sc <= 4; sc++) {
        ctx.beginPath()
        ctx.arc(sc * 8, 0, 7, 0, Math.PI)
        ctx.stroke()
      }

      // Orange blotch
      ctx.beginPath()
      ctx.ellipse(6, -4, 14, 6, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(220, 70, 10, 0.55)'
      ctx.fill()

      // Dorsal fin
      ctx.beginPath()
      ctx.moveTo(-10, -14)
      ctx.quadraticCurveTo(4, -26, 18, -16)
      ctx.strokeStyle = 'rgba(255, 180, 20, 0.75)'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()

      // Tail fin (forked)
      ctx.beginPath()
      ctx.moveTo(-36, 0)
      ctx.quadraticCurveTo(-52, -10, -58, -18)
      ctx.moveTo(-36, 0)
      ctx.quadraticCurveTo(-52, 10, -58, 18)
      ctx.strokeStyle = 'rgba(255, 170, 10, 0.8)'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Whiskers
      ctx.beginPath()
      ctx.moveTo(36, -4)
      ctx.quadraticCurveTo(48, -10, 54, -8)
      ctx.moveTo(36, 4)
      ctx.quadraticCurveTo(48, 10, 54, 8)
      ctx.strokeStyle = 'rgba(200, 140, 0, 0.65)'
      ctx.lineWidth = 1.2
      ctx.stroke()

      // Eye
      ctx.beginPath()
      ctx.arc(30, -5, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#111'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(31, -6, 1.2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.fill()

      ctx.globalAlpha = 1
      ctx.restore()

      // Ripple ring around the fish (pulses so player notices it)
      const rippleAlpha = (Math.sin(t * 2.5) * 0.5 + 0.5) * 0.5
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(koiX, koiY, 60 + Math.sin(t * 2.5) * 6, 24 + Math.sin(t * 2.5) * 3, koiAngle, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(255, 210, 50, ${rippleAlpha})`
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    // Add direct canvas click listener — properly scales CSS display coords
    // to internal canvas resolution coords
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      // Scale factor: canvas internal size vs CSS displayed size
      const scaleX = canvas.width  / rect.width
      const scaleY = canvas.height / rect.height
      const mx = (e.clientX - rect.left) * scaleX
      const my = (e.clientY - rect.top)  * scaleY
      const kx = koiPosRef.current.x * canvas.width
      const ky = koiPosRef.current.y * canvas.height
      const dist = Math.sqrt((mx - kx) ** 2 + (my - ky) ** 2)

      if (dist < 70) {  // 70px hit radius in canvas space
        setKoiJumping(true)
        onEasterEggTrigger?.('koi')
        setTimeout(() => setKoiJumping(false), 3000)
      }
    }
    canvas.style.pointerEvents = 'auto'
    canvas.addEventListener('click', handleCanvasClick)

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      canvas.removeEventListener('click', handleCanvasClick)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Trigger tree spirit easter egg
  const handleTreeClick = () => {
    if (!spiritVisible) {
      setSpiritVisible(true)
      onEasterEggTrigger?.('spirit')
      setTimeout(() => setSpiritVisible(false), 3500)
    }
  }

  return (
    <div className="realistic-forest-wrap">
      {/* High-definition photorealistic forest background layer with camera drift */}
      <div className="forest-photo-layer" style={{ backgroundImage: `url('/forest_bg.jpg')` }} />

      {/* Interactive Easter Egg Hotspot: Ancient Tree Hollow — Tree Guardian */}
      <div
        className="easter-egg-hotspot tree-hollow"
        onClick={(e) => {
          e.stopPropagation()
          handleTreeClick()
        }}
        title="🌲 Ancient Tree Hollow — something stirs inside…"
      >
        <span className="hollow-sparkle">🌲</span>
        <span className="hollow-label">TREE GUARDIAN</span>
      </div>

      {/* Animated Forest Spirit Easter Egg Reveal */}
      {spiritVisible && (
        <div className="forest-spirit-reveal">
          <div className="spirit-avatar">🦌✨</div>
          <div className="spirit-text">MYSTIC FOREST GUARDIAN AWAKENED!</div>
          <div className="spirit-sub">Secret Ancient Blessing Unlocked</div>
        </div>
      )}

      {/* Animated Golden Koi Leap Easter Egg */}
      {koiJumping && (
        <div className="koi-leap-animation">
          <div className="koi-body">🐟✨</div>
          <div className="koi-splash" />
        </div>
      )}

      {/* Dynamic Canvas with God rays, Fireflies, Mist & River Shimmer */}
      <canvas ref={canvasRef} className="forest-canvas-overlay" />

      {/* Dark Ambient Vignette for cinematic focus */}
      <div className="forest-vignette" />
    </div>
  )
}
