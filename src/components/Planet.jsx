const planetStyles = {
  Mercury: {
    background:
      'radial-gradient(circle at 24% 18%, #f7f7f2 0%, #b6b6b6 40%, #7b7d82 100%)',
    boxShadow: '0 0 24px rgba(255, 255, 255, 0.12)',
  },
  Venus: {
    background:
      'radial-gradient(circle at 32% 28%, #fff6c8 0%, #f5c16a 24%, #d9914f 52%, #b66f3e 100%)',
    boxShadow: '0 0 24px rgba(255, 194, 112, 0.18)',
  },
  Earth: {
    background:
      'radial-gradient(circle at 34% 34%, #a4deff 0%, #1f6bbb 38%, #0e3d7c 62%), radial-gradient(circle at 66% 62%, rgba(92, 167, 100, 0.75), transparent 30%)',
    boxShadow: '0 0 28px rgba(86, 166, 227, 0.22)',
  },
  Mars: {
    background:
      'radial-gradient(circle at 28% 28%, #ffb67b 0%, #d35d42 34%, #9b3b23 70%, #792f1d 100%)',
    boxShadow: '0 0 24px rgba(255, 135, 90, 0.2)',
  },
  Jupiter: {
    background:
      'linear-gradient(120deg, #d9a06d 12%, #c4763d 22%, #f0c98f 30%, #be7f48 48%, #d1a278 62%, #9c6139 75%, #d09d69 92%)',
    boxShadow: '0 0 28px rgba(255, 171, 110, 0.22)',
  },
  Saturn: {
    background:
      'linear-gradient(160deg, #f5dab4 17%, #d8ac75 36%, #ab7f4d 54%, #d7a56f 72%, #f4d4ad 92%)',
    boxShadow: '0 0 28px rgba(255, 190, 140, 0.22)',
  },
  Uranus: {
    background:
      'radial-gradient(circle at 30% 30%, #b5f1ff 0%, #6cc5f4 36%, #3f99c2 70%, #2c6d8d 100%)',
    boxShadow: '0 0 24px rgba(139, 223, 255, 0.18)',
  },
  Neptune: {
    background:
      'radial-gradient(circle at 24% 24%, #a3d8ff 0%, #3a7ab5 34%, #1f3d76 70%, #102854 100%)',
    boxShadow: '0 0 28px rgba(82, 147, 255, 0.22)',
  },
}

function Planet({ planet, onSelectPlanet, isDragging }) {
  function handleClick(event) {
    event.stopPropagation()
    if (isDragging) return
    onSelectPlanet(planet)
  }

  const visualStyle = planetStyles[planet.name] || {
    background: planet.color,
    boxShadow: `0 0 26px ${planet.color}`,
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
        className={`planet-button ${planet.rings ? 'saturn' : ''} ${planet.name.toLowerCase()}`}
        onClick={handleClick}
        style={{
          width: `${planet.size}px`,
          height: `${planet.size}px`,
          ...visualStyle,
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
