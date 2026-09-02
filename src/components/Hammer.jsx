import './Hammer.css'

export default function Hammer({ mousePos, isHammering }) {
  return (
    <div
      className={`hammer-wrap ${isHammering ? 'swing' : ''}`}
      style={{
        transform: `translate(${mousePos.x + 20}px, ${mousePos.y - 60}px)`,
      }}
    >
      {/* Hammer head */}
      <div className="hammer-head">
        <div className="hammer-head-face" />
        <div className="hammer-head-top" />
        <div className="hammer-head-side" />
      </div>
      {/* Handle */}
      <div className="hammer-handle" />
      {/* Glow */}
      <div className="hammer-glow" />
    </div>
  )
}
