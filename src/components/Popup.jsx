function Popup({ planet, onClose }) {
  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div
        className="popup-card"
        role="dialog"
        aria-modal="true"
        aria-label={`${planet.label} details`}
        onClick={event => event.stopPropagation()}
      >
        <button className="popup-close" type="button" onClick={onClose}>
          ×
        </button>
        <div className="popup-header">
          <div className="popup-planet" style={{ background: planet.color }} />
          <div>
            <h3>{planet.label}</h3>
            <p className="popup-meta">Size: {planet.diameter}</p>
            <p className="popup-meta">Distance: {planet.distance}</p>
          </div>
        </div>
        <p className="popup-fact">Fun fact: {planet.fact}</p>
      </div>
    </div>
  )
}

export default Popup
