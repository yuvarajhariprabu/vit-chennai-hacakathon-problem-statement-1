import { useEffect, useState } from 'react'
import './StatusMessage.css'

export default function StatusMessage({ message, phase, remaining }) {
  const [displayed, setDisplayed] = useState(message)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => {
      setDisplayed(message)
      setVisible(true)
    }, 400)
    return () => clearTimeout(t)
  }, [message])

  const urgentMsg = remaining <= 4 && remaining > 0
    ? `⚡ CRITICAL — ${remaining}s REMAINING`
    : remaining <= 10 && remaining > 0
    ? `⚠ DESTABILIZING — ${remaining}s`
    : null

  return (
    <div className="status-wrap">
      <div className={`status-msg ${visible ? 'visible' : ''} ${urgentMsg ? 'urgent' : ''}`}>
        {urgentMsg || displayed}
      </div>
      {phase === 'active' && (
        <div className="status-hint">CLICK TO STRIKE THE OBSTACLE</div>
      )}
    </div>
  )
}
