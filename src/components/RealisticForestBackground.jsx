import { useEffect, useRef } from 'react'
import './RealisticForestBackground.css'

export default function RealisticForestBackground() {
  const canvasRef = useRef(null)

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

      // 5. Water Shimmer on the bottom stream
      const streamY = H * 0.76
      const streamH = H * 0.22
      for (let s = 0; s < 12; s++) {
        const sx = ((s * (W / 8) + t * 40) % (W + 120)) - 60
        const sy = streamY + (s % 4) * (streamH / 4) + Math.sin(t * 2 + s) * 4
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(sx, sy, 35 + (s % 3) * 10, 2.5, 0, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(160, 240, 200, ${0.14 + Math.sin(t * 3 + s) * 0.07})`
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="realistic-forest-wrap">
      {/* High-definition photorealistic forest background layer */}
      <div className="forest-photo-layer" style={{ backgroundImage: `url('/forest_bg.jpg')` }} />

      {/* Dynamic Canvas with God rays, Fireflies, Mist & River Shimmer */}
      <canvas ref={canvasRef} className="forest-canvas-overlay" />

      {/* Dark Ambient Vignette for cinematic focus */}
      <div className="forest-vignette" />
    </div>
  )
}
