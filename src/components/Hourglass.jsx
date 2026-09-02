import { useEffect, useRef } from 'react'
import './Hourglass.css'

// ── Leaf particle factory ───────────────────────────────────────────────
const LEAF_COLORS = ['#4ade80','#22c55e','#16a34a','#ca8a04','#eab308',
                     '#f97316','#dc2626','#a3e635','#65a30d','#d97706']

function makeLeaf(cx, neckY, neckR) {
  return {
    x:         cx + (Math.random() - 0.5) * neckR * 0.8,
    y:         neckY - Math.random() * 60,   // stagger heights so they don't all start together
    vy:        0.25 + Math.random() * 0.35,  // SLOW — real leaf drift
    vx:        (Math.random() - 0.5) * 0.2,
    rot:       Math.random() * Math.PI * 2,
    rotV:      (Math.random() - 0.5) * 0.025,  // very slow tumble
    size:      5 + Math.random() * 6,
    color:     LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
    opacity:   0.72 + Math.random() * 0.28,
    swing:     Math.random() * Math.PI * 2,
    swingSpd:  0.015 + Math.random() * 0.015, // gentle sway
  }
}

export default function Hourglass({ progress, remaining, compact = false }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const leavesRef = useRef(null)       // persist leaves across re-renders

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const sc = compact ? 0.55 : 1
    const W  = (canvas.width  = Math.round(360 * sc))
    const H  = (canvas.height = Math.round(450 * sc))

    const cx    = W / 2
    const topY  = Math.round(52 * sc)
    const botY  = H - Math.round(52 * sc)
    const neckY = H / 2
    const topR  = Math.round(114 * sc)
    const botR  = Math.round(114 * sc)
    const neckR = Math.round(13  * sc)
    const capH  = Math.round(20  * sc)

    // Initialise leaves only once (ref persists)
    if (!leavesRef.current) {
      leavesRef.current = Array.from({ length: 28 }, () => makeLeaf(cx, neckY, neckR))
    }
    const leaves = leavesRef.current

    // ── GLASS SHAPE PATH (smooth bezier curves) ─────────────────────────
    // Uses cubic bezier for the classic pinched waist
    const glassPath = () => {
      const bulge = 0.55 * sc  // control-point x offset fraction
      ctx.beginPath()
      // top edge →
      ctx.moveTo(cx - topR, topY)
      ctx.lineTo(cx + topR, topY)
      // right side top → neck
      ctx.bezierCurveTo(
        cx + topR  * 0.9, topY  + (neckY - topY) * 0.55,
        cx + neckR * 2.2, neckY - (neckY - topY) * 0.12,
        cx + neckR, neckY
      )
      // right side neck → bot
      ctx.bezierCurveTo(
        cx + neckR * 2.2, neckY + (botY - neckY) * 0.12,
        cx + botR  * 0.9, botY  - (botY - neckY) * 0.55,
        cx + botR, botY
      )
      // bottom edge ←
      ctx.lineTo(cx - botR, botY)
      // left side bot → neck
      ctx.bezierCurveTo(
        cx - botR  * 0.9, botY  - (botY - neckY) * 0.55,
        cx - neckR * 2.2, neckY + (botY - neckY) * 0.12,
        cx - neckR, neckY
      )
      // left side neck → top
      ctx.bezierCurveTo(
        cx - neckR * 2.2, neckY - (neckY - topY) * 0.12,
        cx - topR  * 0.9, topY  + (neckY - topY) * 0.55,
        cx - topR, topY
      )
      ctx.closePath()
    }

    // top-half clip (for leaf pile)
    const topHalfPath = () => {
      ctx.beginPath()
      ctx.moveTo(cx - topR, topY)
      ctx.lineTo(cx + topR, topY)
      ctx.bezierCurveTo(
        cx + topR * 0.9, topY + (neckY - topY) * 0.55,
        cx + neckR * 2.2, neckY - (neckY - topY) * 0.12,
        cx + neckR, neckY
      )
      ctx.lineTo(cx - neckR, neckY)
      ctx.bezierCurveTo(
        cx - neckR * 2.2, neckY - (neckY - topY) * 0.12,
        cx - topR * 0.9, topY + (neckY - topY) * 0.55,
        cx - topR, topY
      )
      ctx.closePath()
    }

    const botHalfPath = () => {
      ctx.beginPath()
      ctx.moveTo(cx - neckR, neckY)
      ctx.lineTo(cx + neckR, neckY)
      ctx.bezierCurveTo(
        cx + neckR * 2.2, neckY + (botY - neckY) * 0.12,
        cx + botR * 0.9, botY - (botY - neckY) * 0.55,
        cx + botR, botY
      )
      ctx.lineTo(cx - botR, botY)
      ctx.bezierCurveTo(
        cx - botR * 0.9, botY - (botY - neckY) * 0.55,
        cx - neckR * 2.2, neckY + (botY - neckY) * 0.12,
        cx - neckR, neckY
      )
      ctx.closePath()
    }

    // ── Wood grain gradient ─────────────────────────────────────────────
    const woodG = (x0, y0, x1, y1) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1)
      g.addColorStop(0,    '#1c0e04')
      g.addColorStop(0.12, '#3d2209')
      g.addColorStop(0.28, '#2e1a07')
      g.addColorStop(0.44, '#4a2c12')
      g.addColorStop(0.58, '#351808')
      g.addColorStop(0.72, '#5a3318')
      g.addColorStop(0.86, '#3a2008')
      g.addColorStop(1,    '#1e1004')
      return g
    }

    // ── Draw leaf shape ─────────────────────────────────────────────────
    const drawLeaf = (lf) => {
      ctx.save()
      ctx.translate(lf.x, lf.y)
      ctx.rotate(lf.rot)
      ctx.globalAlpha = lf.opacity

      // Main oval body
      ctx.beginPath()
      ctx.ellipse(0, 0, lf.size * 0.45, lf.size, 0, 0, Math.PI * 2)
      ctx.fillStyle = lf.color
      ctx.fill()

      // Midrib vein
      ctx.beginPath()
      ctx.moveTo(0, -lf.size * 0.9)
      ctx.lineTo(0,  lf.size * 0.9)
      ctx.strokeStyle = 'rgba(0,0,0,0.3)'
      ctx.lineWidth = 0.7
      ctx.stroke()

      // Two side veins
      for (const sy of [-0.3, 0.15]) {
        ctx.beginPath()
        ctx.moveTo(0, lf.size * sy)
        ctx.lineTo(lf.size * 0.38, lf.size * (sy - 0.18))
        ctx.moveTo(0, lf.size * sy)
        ctx.lineTo(-lf.size * 0.38, lf.size * (sy - 0.18))
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      ctx.restore()
    }

    // ── Tree-bark branch pillar ─────────────────────────────────────────
    const drawBranchPillar = (side) => {
      const sign = side === 'left' ? -1 : 1
      const bx   = cx + sign * (topR + 9 * sc)
      const pw   = Math.round(24 * sc)
      const fullTop = topY - capH - 2
      const fullBot = botY + capH + 2

      ctx.save()

      // ── Pillar silhouette (slightly irregular / organic) ──
      ctx.beginPath()
      ctx.moveTo(bx - pw * 0.5, fullTop)
      // left edge with subtle organic bumps
      for (let i = 0; i <= 10; i++) {
        const t  = i / 10
        const py = fullTop + t * (fullBot - fullTop)
        const dx = Math.sin(t * Math.PI * 4.2 + (side === 'left' ? 0 : 1.1)) * 2.5 * sc
        ctx.lineTo(bx - pw * 0.5 + dx, py)
      }
      ctx.lineTo(bx + pw * 0.5, fullBot)
      // right edge
      for (let i = 10; i >= 0; i--) {
        const t  = i / 10
        const py = fullTop + t * (fullBot - fullTop)
        const dx = Math.sin(t * Math.PI * 3.7 + (side === 'left' ? 2 : 0.5)) * 2.5 * sc
        ctx.lineTo(bx + pw * 0.5 + dx, py)
      }
      ctx.closePath()
      ctx.fillStyle = woodG(bx - pw, fullTop, bx + pw, fullBot)
      ctx.fill()

      // ── Bark grain lines ──
      ctx.save()
      ctx.clip()  // clip grain to pillar shape
      ctx.lineWidth = 0.75
      for (let g = 0; g < 6; g++) {
        const gx = bx - pw * 0.45 + g * (pw / 5.5)
        ctx.beginPath()
        ctx.moveTo(gx, fullTop + 4)
        for (let s = 0; s <= 18; s++) {
          const t  = s / 18
          const py = fullTop + 4 + t * (fullBot - fullTop - 8)
          const jx = Math.sin(s * 1.4 + g * 2.7) * 1.2 * sc
          ctx.lineTo(gx + jx, py)
        }
        ctx.strokeStyle = `rgba(0,0,0,${0.15 + g * 0.03})`
        ctx.stroke()
      }
      ctx.restore()

      // ── Knot / scar ──
      const knotFrac = side === 'left' ? 0.28 : 0.68
      const ky = fullTop + (fullBot - fullTop) * knotFrac
      const kr = 9 * sc
      ctx.beginPath()
      ctx.ellipse(bx, ky, kr * 1.6, kr * 0.85, 0, 0, Math.PI * 2)
      ctx.fillStyle = woodG(bx - kr * 2, ky - kr, bx + kr * 2, ky + kr)
      ctx.fill()
      ctx.strokeStyle = '#1a0c04'
      ctx.lineWidth = 1.2
      ctx.stroke()
      // inner dark hole
      ctx.beginPath()
      ctx.ellipse(bx, ky, kr * 0.65, kr * 0.38, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#0e0703'
      ctx.fill()

      // ── Shallow highlight line ──
      ctx.beginPath()
      ctx.moveTo(bx - pw * 0.25, fullTop + 8)
      ctx.lineTo(bx - pw * 0.25, fullBot - 8)
      ctx.strokeStyle = 'rgba(255,200,140,0.08)'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.restore()
    }

    // ── Carved root cap ─────────────────────────────────────────────────
    const drawRootCap = (y, isBottom) => {
      const capW = topR + 20 * sc
      const dir  = isBottom ? 1 : -1

      ctx.save()

      // Main cap slab
      const capGrd = ctx.createLinearGradient(cx - capW, y - capH, cx + capW, y + capH)
      capGrd.addColorStop(0,   '#4a2c12')
      capGrd.addColorStop(0.3, '#6b3d18')
      capGrd.addColorStop(0.6, '#3d2209')
      capGrd.addColorStop(1,   '#2c1608')

      ctx.beginPath()
      ctx.ellipse(cx, y, capW, capH * 0.65, 0, 0, Math.PI * 2)
      ctx.fillStyle = capGrd
      ctx.fill()

      // Concentric bark rings
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(cx, y, capW, capH * 0.65, 0, 0, Math.PI * 2)
      ctx.clip()
      for (let r = 1; r <= 7; r++) {
        ctx.beginPath()
        ctx.ellipse(cx, y, capW * r / 8, capH * 0.65 * r / 8, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,0,0,${0.18 + r * 0.02})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
      ctx.restore()

      // Outer carved edge
      ctx.beginPath()
      ctx.ellipse(cx, y, capW + 3 * sc, capH * 0.75, 0, 0, Math.PI * 2)
      ctx.strokeStyle = '#7a4a1e'
      ctx.lineWidth = 2
      ctx.stroke()

      // Root tendrils spreading outward
      const roots = 7
      for (let r = 0; r < roots; r++) {
        const t  = r / (roots - 1)
        const rx = cx - capW + t * capW * 2
        const ry = y + dir * capH * 0.6
        const cx2 = rx + (t - 0.5) * 22 * sc
        const cy2 = ry + dir * 14 * sc
        const cx3 = rx + (t - 0.5) * 32 * sc
        const cy3 = ry + dir * 24 * sc
        ctx.beginPath()
        ctx.moveTo(rx, ry)
        ctx.bezierCurveTo(cx2, cy2, cx3, cy3, cx3 + (t - 0.5) * 5 * sc, cy3 + dir * 4 * sc)
        ctx.strokeStyle = 'rgba(58, 32, 8, 0.65)'
        ctx.lineWidth = 1.5 + (1 - Math.abs(t - 0.5) * 2) * 1.5
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      ctx.restore()
    }

    // ── Realistic glass effect helpers ──────────────────────────────────
    const drawGlassBase = () => {
      // 1. Very slight green tint fill (real glass has colour)
      glassPath()
      const innerG = ctx.createRadialGradient(cx, neckY, 10, cx, neckY, topR)
      innerG.addColorStop(0,   'rgba(20, 80, 30, 0.04)')
      innerG.addColorStop(0.6, 'rgba(10, 50, 20, 0.08)')
      innerG.addColorStop(1,   'rgba(5,  30, 10, 0.15)')
      ctx.fillStyle = innerG
      ctx.fill()
    }

    const drawGlassReflections = () => {
      ctx.save()
      glassPath()
      ctx.clip()

      // Left primary highlight (bright streak)
      const hx = cx - topR * 0.72
      const grad1 = ctx.createLinearGradient(hx - 12, topY, hx + 12, topY)
      grad1.addColorStop(0,   'rgba(255,255,255,0)')
      grad1.addColorStop(0.4, 'rgba(255,255,255,0.22)')
      grad1.addColorStop(0.6, 'rgba(220,255,230,0.14)')
      grad1.addColorStop(1,   'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.moveTo(hx - 8, topY + 6)
      ctx.bezierCurveTo(hx - 10, neckY - 30 * sc, hx - 2, neckY + 20 * sc, hx, neckY + 50 * sc)
      ctx.lineWidth = 18
      ctx.strokeStyle = grad1
      ctx.lineCap = 'round'
      ctx.stroke()

      // Right dim secondary highlight
      const grad2 = ctx.createLinearGradient(cx + topR * 0.55, topY, cx + topR * 0.65, topY)
      grad2.addColorStop(0, 'rgba(200,255,210,0)')
      grad2.addColorStop(0.5,'rgba(200,255,210,0.09)')
      grad2.addColorStop(1, 'rgba(200,255,210,0)')
      ctx.beginPath()
      ctx.moveTo(cx + topR * 0.58, topY + 10)
      ctx.bezierCurveTo(cx + topR * 0.62, neckY - 25 * sc, cx + neckR * 1.5, neckY + 30 * sc, cx + neckR + 5, neckY + 60 * sc)
      ctx.lineWidth = 12
      ctx.strokeStyle = grad2
      ctx.stroke()

      // Bottom half reflections mirrored
      ctx.beginPath()
      ctx.moveTo(hx - 8, botY - 6)
      ctx.bezierCurveTo(hx - 10, neckY + 30 * sc, hx - 2, neckY - 20 * sc, hx, neckY - 50 * sc)
      ctx.lineWidth = 14
      ctx.strokeStyle = grad1
      ctx.stroke()

      // Subtle edge caustic glow (light bending at glass edge)
      const edgeG = ctx.createLinearGradient(cx - topR, topY, cx - topR + 8, topY)
      edgeG.addColorStop(0, 'rgba(100,255,150,0.18)')
      edgeG.addColorStop(1, 'rgba(100,255,150,0)')
      glassPath()
      ctx.strokeStyle = edgeG
      ctx.lineWidth = 6
      ctx.stroke()

      ctx.restore()
    }

    const drawGlassOutline = () => {
      glassPath()
      // Outer dark shadow
      ctx.strokeStyle = 'rgba(0, 20, 5, 0.55)'
      ctx.lineWidth = 3.5
      ctx.stroke()
      // Inner bright line (refraction edge)
      glassPath()
      ctx.strokeStyle = 'rgba(140, 230, 160, 0.42)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // ── Main render ─────────────────────────────────────────────────────
    const drawAll = () => {
      ctx.clearRect(0, 0, W, H)

      const topFill = Math.max(0, Math.min(1, 1 - progress))
      const topLeafY = topY  + (neckY - topY) * (1 - topFill)
      const botLeafY = botY  - (botY  - neckY) * progress

      // ── Base glass tint ──
      drawGlassBase()

      // ── Top leaf pile ──
      ctx.save()
      topHalfPath(); ctx.clip()
      const tGrd = ctx.createLinearGradient(cx, topLeafY, cx, neckY)
      tGrd.addColorStop(0,   '#166534')
      tGrd.addColorStop(0.5, '#15803d')
      tGrd.addColorStop(1,   '#052e16')
      ctx.fillStyle = tGrd
      ctx.fillRect(cx - topR, topLeafY, topR * 2, neckY - topLeafY + 12)

      // Leaf speckles on top surface
      for (let i = 0; i < 20; i++) {
        const lx = cx - topR * 0.85 + Math.random() * topR * 1.7
        const ly = topLeafY + Math.random() * 16
        ctx.save()
        ctx.translate(lx, ly)
        ctx.rotate(Math.random() * Math.PI)
        ctx.beginPath()
        ctx.ellipse(0, 0, 3 + Math.random() * 5, 1.5 + Math.random() * 2.5, 0, 0, Math.PI * 2)
        ctx.fillStyle = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]
        ctx.globalAlpha = 0.55
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.restore()
      }
      ctx.restore()

      // ── Bottom leaf pile ──
      ctx.save()
      botHalfPath(); ctx.clip()
      const bGrd = ctx.createLinearGradient(cx, botLeafY, cx, botY)
      bGrd.addColorStop(0,   '#3d2510')
      bGrd.addColorStop(0.4, '#5c3515')
      bGrd.addColorStop(1,   '#1e1208')
      ctx.fillStyle = bGrd
      ctx.fillRect(cx - botR, botLeafY, botR * 2, botY - botLeafY + 8)

      // Scattered leaves in bottom pile
      for (let i = 0; i < 22; i++) {
        const lx = cx - botR * 0.8 + Math.random() * botR * 1.6
        const ly = botLeafY + Math.random() * (botY - botLeafY)
        ctx.save()
        ctx.translate(lx, ly); ctx.rotate(Math.random() * Math.PI)
        ctx.beginPath()
        ctx.ellipse(0, 0, 3 + Math.random() * 5, 1.5 + Math.random() * 3, 0, 0, Math.PI * 2)
        ctx.fillStyle = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]
        ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1
        ctx.restore()
      }
      ctx.restore()

      // ── Falling leaves (stream through neck) ──
      if (progress < 0.99) {
        ctx.save()
        glassPath(); ctx.clip()
        for (const lf of leaves) {
          lf.swing  += lf.swingSpd
          lf.x      += lf.vx + Math.sin(lf.swing) * 0.45
          lf.y      += lf.vy
          lf.rot    += lf.rotV

          // Reset when leaf reaches the bottom pile
          if (lf.y > botLeafY + 8) {
            lf.y  = neckY - 5 - Math.random() * 25
            lf.x  = cx + (Math.random() - 0.5) * neckR * 1.1
            lf.vy = 0.25 + Math.random() * 0.35
            lf.vx = (Math.random() - 0.5) * 0.2
          }
          drawLeaf(lf)
        }
        ctx.restore()
      }

      // ── Glass reflections & outline ──
      drawGlassReflections()
      drawGlassOutline()

      // ── Tree-bark pillars ──
      drawBranchPillar('left')
      drawBranchPillar('right')

      // ── Carved root caps ──
      drawRootCap(topY - capH * 0.35, false)
      drawRootCap(botY + capH * 0.35, true)

      // ── Vine waist ring ──
      ctx.save()
      const vineGrd = ctx.createRadialGradient(cx, neckY, 2, cx, neckY, neckR + 12 * sc)
      vineGrd.addColorStop(0,   '#5a3212')
      vineGrd.addColorStop(0.5, '#7a4a1e')
      vineGrd.addColorStop(1,   '#2c1a08')
      ctx.beginPath()
      ctx.ellipse(cx, neckY, neckR + 10 * sc, 7 * sc, 0, 0, Math.PI * 2)
      ctx.fillStyle = vineGrd
      ctx.fill()
      ctx.strokeStyle = '#8a5222'
      ctx.lineWidth = 1.5
      ctx.stroke()
      // Tiny leaf buds on the vine ring
      for (let v = 0; v < 5; v++) {
        const a  = (v / 5) * Math.PI * 2
        const vx = cx + Math.cos(a) * (neckR + 8 * sc)
        const vy = neckY + Math.sin(a) * 5.5 * sc
        ctx.beginPath()
        ctx.ellipse(vx, vy, 3 * sc, 2 * sc, a, 0, Math.PI * 2)
        ctx.fillStyle = '#4ade80'
        ctx.fill()
      }
      ctx.restore()
    }

    const loop = () => { drawAll(); rafRef.current = requestAnimationFrame(loop) }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [progress, compact])

  return (
    <div className={`hourglass-wrap ${compact ? 'compact' : ''}`}>
      <canvas ref={canvasRef} className="hourglass-canvas" />
      <div className={`hourglass-timer-block ${compact ? 'compact' : ''}`}>
        <div className="hourglass-loading-label">
          <span className="loading-pulsing-dot" />
          <span>LOADING</span>
        </div>
        <div className={`timer-display ${remaining <= 10 ? 'urgent' : ''} ${compact ? 'compact' : ''}`}>
          {remaining}s
        </div>
      </div>
      <div className={`progress-bar-wrap ${compact ? 'compact' : ''}`}>
        <div className="progress-bar" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  )
}
