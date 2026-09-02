import { useEffect, useRef } from 'react'

// ── Leaf colours ─────────────────────────────────────────────────────────────
const LEAF_COLORS = ['#2d6a2d', '#1a4a1a', '#3d7a1a', '#4a6a2d', '#8B4513', '#5c8a1a', '#234d0e']

function makeLeavesRef(W, H) {
  return Array.from({ length: 38 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.85,
    size: 3 + Math.random() * 7,
    speed: 0.4 + Math.random() * 1.2,
    vx: (Math.random() - 0.5) * 0.6,
    swing: Math.random() * Math.PI * 2,
    swingSpeed: 0.4 + Math.random() * 0.9,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.08,
    color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
    opacity: 0.55 + Math.random() * 0.45,
  }))
}

function makeFishRef(H) {
  const riverY = H * 0.78
  const riverH = H * 0.16
  return Array.from({ length: 7 }, (_, i) => ({
    x: Math.random() * 1400,
    y: riverY + riverH * (0.25 + Math.random() * 0.55),
    speed: (0.4 + Math.random() * 0.9) * (Math.random() > 0.4 ? 1 : -1),
    size: 7 + Math.random() * 9,
    color: ['rgba(100,200,120,0.65)', 'rgba(80,170,100,0.6)', 'rgba(60,140,180,0.6)', 'rgba(200,180,80,0.55)'][i % 4],
    bob: Math.random() * Math.PI * 2,
    bobSpeed: 0.8 + Math.random() * 0.7,
  }))
}

// ── Draw a conical pine tree ──────────────────────────────────────────────────
function drawPine(ctx, cx, baseY, h, col) {
  // Trunk
  ctx.fillStyle = '#1a0a04'
  ctx.fillRect(cx - h * 0.045, baseY - h * 0.22, h * 0.09, h * 0.22)

  // 3 foliage tiers
  for (let t = 0; t < 3; t++) {
    const ly = baseY - h * (0.18 + t * 0.28)
    const lw = h * (0.42 - t * 0.1)
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.moveTo(cx, ly - h * 0.3)
    ctx.lineTo(cx + lw, ly + 4)
    ctx.lineTo(cx - lw, ly + 4)
    ctx.closePath()
    ctx.fill()
  }
}

// ── Draw a rounded deciduous tree ─────────────────────────────────────────────
function drawDeciduous(ctx, cx, baseY, h, col) {
  // Trunk
  ctx.fillStyle = '#1a0a04'
  ctx.fillRect(cx - h * 0.055, baseY - h * 0.25, h * 0.11, h * 0.25)

  // Canopy
  ctx.fillStyle = col
  ctx.beginPath()
  ctx.arc(cx, baseY - h * 0.58, h * 0.38, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx - h * 0.18, baseY - h * 0.45, h * 0.28, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + h * 0.18, baseY - h * 0.45, h * 0.28, 0, Math.PI * 2)
  ctx.fill()
}

function drawTreeLayer(ctx, W, H, offset, count, yFrac, colFn, altTrees) {
  const baseY = H * yFrac
  for (let i = 0; i < count; i++) {
    const spacing = W / (count - 1)
    const rawX = i * spacing + offset
    const x = ((rawX % (W + 300)) + W + 300) % (W + 300) - 150
    const h = H * 0.28 * (0.7 + (i % 3) * 0.15)
    if (altTrees && i % 3 === 1) {
      drawDeciduous(ctx, x, baseY, h, colFn(i))
    } else {
      drawPine(ctx, x, baseY, h, colFn(i))
    }
  }
}

export default function ForestBackground({ progress }) {
  const canvasRef = useRef(null)
  const leavesRef = useRef(null)
  const fishRef   = useRef(null)
  const rafRef    = useRef(null)
  const startRef  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      leavesRef.current = makeLeavesRef(canvas.width, canvas.height)
      fishRef.current   = makeFishRef(canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts
      const t = (ts - startRef.current) / 1000
      const W = canvas.width
      const H = canvas.height
      const riverY = H * 0.78
      const riverH = H * 0.16

      ctx.clearRect(0, 0, W, H)

      // ── Sky gradient ───────────────────────────────────────────────────────
      const sky = ctx.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0,   '#06100a')
      sky.addColorStop(0.3, '#0b1f10')
      sky.addColorStop(0.65,'#122a14')
      sky.addColorStop(1,   '#0a1a09')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, H)

      // ── God rays ──────────────────────────────────────────────────────────
      ctx.save()
      for (let r = 0; r < 5; r++) {
        const angle = -0.45 + r * 0.12
        const intensity = (Math.sin(t * 0.4 + r) + 1) * 0.018 + 0.008
        const grd = ctx.createLinearGradient(0, 0, Math.cos(angle) * W * 1.2, Math.sin(angle) * H * 1.2)
        grd.addColorStop(0,   `rgba(80,200,100,${intensity})`)
        grd.addColorStop(0.5, `rgba(60,160,80,${intensity * 0.5})`)
        grd.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, W, H)
      }
      ctx.restore()

      // ── Tree layers (parallax) ────────────────────────────────────────────
      const s1 = t * 12 // far slow
      const s2 = t * 22 // mid
      const s3 = t * 38 // near fast

      // Far trees
      drawTreeLayer(ctx, W, H, s1, 12, 0.60, () => '#071408', false)
      // Mid trees
      drawTreeLayer(ctx, W, H, s2, 9,  0.68, i => i%2===0 ? '#0a1e0b' : '#0c2210', true)
      // Near trees
      drawTreeLayer(ctx, W, H, s3, 7,  0.78, i => i%2===0 ? '#0f2a10' : '#122e14', true)

      // ── Ground mist ────────────────────────────────────────────────────────
      const mist = ctx.createLinearGradient(0, riverY - 60, 0, riverY)
      mist.addColorStop(0, 'rgba(10,30,12,0)')
      mist.addColorStop(1, 'rgba(30,80,35,0.18)')
      ctx.fillStyle = mist
      ctx.fillRect(0, riverY - 60, W, 60)

      // ── River ──────────────────────────────────────────────────────────────
      // Base water
      const water = ctx.createLinearGradient(0, riverY, 0, riverY + riverH)
      water.addColorStop(0,   'rgba(15,60,40,0.97)')
      water.addColorStop(0.4, 'rgba(12,50,32,0.98)')
      water.addColorStop(1,   'rgba(8,35,22,1)')
      ctx.fillStyle = water
      ctx.fillRect(0, riverY, W, riverH)

      // River shimmer waves
      for (let w = 0; w < 12; w++) {
        const wx = ((w * W / 9 + t * 55) % (W + 100)) - 50
        const wy = riverY + riverH * (0.25 + (w % 3) * 0.25)
        ctx.beginPath()
        ctx.ellipse(wx, wy, 28 + w * 3, 3, 0, 0, Math.PI)
        ctx.strokeStyle = `rgba(60,160,100,${0.06 + (w % 4) * 0.03})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Fish
      fishRef.current.forEach(fish => {
        fish.x += fish.speed
        fish.bob += fish.bobSpeed * 0.02
        const bobY = fish.y + Math.sin(fish.bob) * 3

        if (fish.speed > 0 && fish.x > W + 40)  fish.x = -40
        if (fish.speed < 0 && fish.x < -40)      fish.x = W + 40

        const dir = fish.speed > 0 ? 1 : -1
        ctx.save()
        ctx.translate(fish.x, bobY)
        if (dir < 0) ctx.scale(-1, 1)

        // Body
        ctx.beginPath()
        ctx.ellipse(0, 0, fish.size * 1.6, fish.size * 0.65, 0, 0, Math.PI * 2)
        ctx.fillStyle = fish.color
        ctx.fill()

        // Tail fin
        ctx.beginPath()
        ctx.moveTo(-fish.size * 1.5, 0)
        ctx.lineTo(-fish.size * 2.5, -fish.size * 0.8)
        ctx.lineTo(-fish.size * 2.5,  fish.size * 0.8)
        ctx.closePath()
        ctx.fillStyle = fish.color
        ctx.fill()

        // Eye
        ctx.beginPath()
        ctx.arc(fish.size * 0.8, -fish.size * 0.1, fish.size * 0.18, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,0,0,0.8)'
        ctx.fill()

        ctx.restore()
      })

      // River bank overlays (blend edges)
      const topBank = ctx.createLinearGradient(0, riverY - 6, 0, riverY + 20)
      topBank.addColorStop(0, 'rgba(8,20,8,1)')
      topBank.addColorStop(1, 'rgba(8,20,8,0)')
      ctx.fillStyle = topBank
      ctx.fillRect(0, riverY - 6, W, 26)

      // ── Foreground ground ─────────────────────────────────────────────────
      const ground = ctx.createLinearGradient(0, riverY + riverH, 0, H)
      ground.addColorStop(0,   '#0a1a08')
      ground.addColorStop(0.3, '#091508')
      ground.addColorStop(1,   '#060f06')
      ctx.fillStyle = ground
      ctx.fillRect(0, riverY + riverH, W, H - riverY - riverH)

      // ── Falling leaves ────────────────────────────────────────────────────
      leavesRef.current.forEach(lf => {
        lf.y += lf.speed
        lf.x += Math.sin(t * lf.swingSpeed + lf.swing) * 1.4 + lf.vx
        lf.rot += lf.rotSpeed

        if (lf.y > H + 20) {
          lf.y = -20
          lf.x = Math.random() * W
        }

        ctx.save()
        ctx.translate(lf.x, lf.y)
        ctx.rotate(lf.rot)
        ctx.globalAlpha = lf.opacity
        ctx.fillStyle = lf.color

        // Leaf shape: ellipse + pointed tip
        ctx.beginPath()
        ctx.ellipse(0, 0, lf.size, lf.size * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      })

      // ── Atmospheric vignette ───────────────────────────────────────────────
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.1, W/2, H/2, H*0.8)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,5,0,0.7)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, W, H)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [progress])

  return <canvas ref={canvasRef} className="forest-bg-canvas" />
}
