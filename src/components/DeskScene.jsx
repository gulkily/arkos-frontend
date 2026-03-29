export default function DeskScene({ notifications }) {
  return (
    <section className="scene-stage" aria-label="Desk scene stage">
      <div className="scene-stage__placeholder">
        <p>DeskScene placeholder</p>
        <span>{notifications.length} notifications loaded</span>
      </div>
    </section>
  );
}
