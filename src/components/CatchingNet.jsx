import './CatchingNet.css'

export default function CatchingNet({ mousePos, isSwinging }) {
  return (
    <div
      className={`catching-net-wrap ${isSwinging ? 'swing' : ''}`}
      style={{
        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
      }}
    >
      {/* Bamboo handle */}
      <div className="net-handle">
        <div className="handle-wrap-grip" />
        <div className="handle-ring" />
      </div>

      {/* Net Hoop & Mesh */}
      <div className="net-hoop">
        {/* Animated translucent net bag with woven texture */}
        <div className="net-bag">
          <div className="net-mesh-pattern" />
          <div className="net-inner-glow" />
        </div>

        {/* Outer wooden / brass rim */}
        <div className="net-rim" />
      </div>

      {/* Trailing sparkle particles */}
      <div className="net-sparkle-trail">
        <span className="sparkle s1">✦</span>
        <span className="sparkle s2">✧</span>
        <span className="sparkle s3">✦</span>
      </div>
    </div>
  )
}
