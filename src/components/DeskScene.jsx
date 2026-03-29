export default function DeskScene({ notifications, children }) {
  return (
    <section className="scene-stage" aria-label="Desk scene stage">
      <div className="desk-scene">
        <div className="desk-scene__sky" aria-hidden="true" />
        <div className="desk-scene__window" aria-hidden="true">
          <div className="desk-scene__sun" />
          <div className="desk-scene__grid" />
        </div>
        <div className="desk-scene__shelf" aria-hidden="true">
          <span className="shelf-item shelf-item--book" />
          <span className="shelf-item shelf-item--book shelf-item--short" />
          <span className="shelf-item shelf-item--plant" />
        </div>
        <div className="desk-scene__monitor" aria-hidden="true">
          <div className="monitor-screen">
            <div className="monitor-screen__glow" />
            <div className="monitor-screen__line" />
            <div className="monitor-screen__line monitor-screen__line--short" />
          </div>
        </div>
        <div className="desk-scene__lamp" aria-hidden="true">
          <span className="lamp-head" />
          <span className="lamp-arm" />
          <span className="lamp-base" />
        </div>
        <div className="desk-scene__notification-layer">{children}</div>
        <div className="desk-scene__keyboard" aria-hidden="true" />
        <div className="desk-scene__mug" aria-hidden="true" />
        <div className="desk-scene__desk" aria-hidden="true" />
        <p className="desk-scene__status">{notifications.length} notifications loaded</p>
      </div>
    </section>
  );
}
