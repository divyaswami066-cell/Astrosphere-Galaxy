import { useEffect, useMemo, useState } from 'react'
import Planet from './Planet'
import Stars from './Stars'

function Galaxy({ planets, onSelectPlanet, onCreatePlanet, currentFact, onNextFact, onBlackHoleClick }) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [form, setForm] = useState({ name: '', color: '#6f8cff', size: 12000 })

  const allPlanets = useMemo(() => planets, [planets])

  useEffect(() => {
    function handleMove(event) {
      const x = (event.clientX / window.innerWidth - 0.5) * 20
      const y = (event.clientY / window.innerHeight - 0.5) * 20
      setParallax({ x, y })
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    onCreatePlanet(form.name, form.color, form.size)
    setForm({ name: '', color: '#6f8cff', size: 12000 })
  }

  return (
    <section className="galaxy-page">
      <Stars count={110} parallax={parallax} />
      <div className="shooting-list">
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className="shooting-star"
            style={{
              top: `${Math.random() * 40 + 5}%`,
              left: `${Math.random() * 75 + 5}%`,
              animationDuration: `${1.2 + Math.random() * 1.4}s`,
              animationDelay: `${index * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="galaxy-view" style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}>
        <div className="sun-glow" />
        <div className="sun-core" />

        {allPlanets.map(planet => (
          <Planet key={`${planet.name}-${planet.distance}`} planet={planet} onSelectPlanet={onSelectPlanet} />
        ))}
      </div>

      <button className="hidden-blackhole" type="button" onClick={onBlackHoleClick} aria-label="Hidden black hole" />

      <div className="controls-panel">
        <div className="controls-row">
          <div className="fact-box">
            <h3>Random Space Fact</h3>
            <p>{currentFact}</p>
            <button className="random-fact-button" type="button" onClick={onNextFact}>
              New Fact
            </button>
          </div>

          <form className="custom-planet-form" onSubmit={handleSubmit}>
            <h3>Create Your Own Planet</h3>
            <label>
              Planet Name
              <input
                type="text"
                value={form.name}
                onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
                placeholder="My Planet"
              />
            </label>
            <label>
              Color
              <input
                type="color"
                value={form.color}
                onChange={event => setForm(prev => ({ ...prev, color: event.target.value }))}
              />
            </label>
            <label>
              Size (km)
              <input
                type="number"
                min="2000"
                max="70000"
                value={form.size}
                onChange={event => setForm(prev => ({ ...prev, size: Number(event.target.value) }))}
              />
            </label>
            <button className="submit-planet" type="submit">
              Add Planet
            </button>
          </form>
        </div>

        <div className="galaxy-info">
          <h2>Galaxy exploration mode</h2>
          <p>Click a planet to open an info card. Hover on planets to feel the cosmic glow.</p>
        </div>
      </div>
    </section>
  )
}

export default Galaxy
