function Planet({ planet, onSelectPlanet, isDragging }) {
  function handleClick(event) {
    event.stopPropagation()
    if (isDragging) return
    onSelectPlanet(planet)
  }

  return (
    <div
      className="orbit"
      style={{
        width: `${planet.orbitRadius * 2}px`,
        height: `${planet.orbitRadius * 2}px`,
        animationDuration: `${planet.orbitDuration}s`,
      }}
    >
      <button
        type="button"
        className={`planet-button ${planet.rings ? 'saturn' : ''}`}
        onClick={handleClick}
        style={{
          width: `${planet.size}px`,
          height: `${planet.size}px`,
          background: planet.color,
          boxShadow: `0 0 26px ${planet.color}`,
          zIndex: 5,
        }}
        aria-label={`Show details for ${planet.label}`}
      >
        <span>{planet.label}</span>
        {planet.rings && <span className="ring" />}
      </button>
    </div>
  )
}

export default Planet
