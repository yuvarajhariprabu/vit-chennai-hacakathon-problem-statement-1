import { useEffect, useState } from 'react'
import './EasterEgg.css'

export default function EasterEgg() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`easter-egg ${visible ? 'show' : ''}`}>
      <div className="eg-inner">
        <div className="eg-icon">👁</div>
        <div className="eg-title">SECRET PROTOCOL DISCOVERED</div>
        <div className="eg-sub">YOU FOUND THE NEXUS CORE</div>
        <div className="eg-code">// CLEARANCE LEVEL: OMEGA //</div>
      </div>
    </div>
  )
}
