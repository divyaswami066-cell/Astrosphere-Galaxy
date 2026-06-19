import { useEffect, useRef, useState } from 'react'
import Planet from './Planet'
import Stars from './Stars'

const DRAG_LIMIT = { x: 220, y: 180 }

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function Galaxy({ planets, onSelectPlanet, onCreatePlanet, currentFact, onNextFact, onBlackHoleClick }) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [sceneOffset, setSceneOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [isDraggingMotion, setIsDraggingMotion] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [form, setForm] = useState({ name: '', color: '#6f8cff', size: 12000 })

  const [shootingStars] = useState(() =>
    Array.from({ length: 6 }, (_, index) => ({
      id: index,
      top: `${Math.random() * 40 + 5}%`,
      left: `${Math.random() * 75 + 5}%`,
      animationDuration: `${1.2 + Math.random() * 1.4}s`,
      animationDelay: `${index * 0.4}s`,
    })),
  )

  const dragStartRef = useRef({ x: 0, y: 0 })
  const draggingMotionRef = useRef(false)
  const sceneOffsetRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const lastMoveRef = useRef({ x: 0, y: 0, time: 0 })
  const frameRef = useRef(0)
  const pointerIdRef = useRef(null)

  useEffect(() => {
    const timeout = setTimeout(() => setShowHint(false), 3600)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    function handleMove(event) {
      const x = (event.clientX / window.innerWidth - 0.5) * 20
      const y = (event.clientY / window.innerHeight - 0.5) * 20
      setParallax({ x, y })
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  function updateSceneOffset(next) {
    sceneOffsetRef.current = next
    setSceneOffset(next)
  }

  function startInertia() {
    cancelAnimationFrame(frameRef.current)

    const step = () => {
      const friction = 0.92
      let vx = velocityRef.current.x * friction
      let vy = velocityRef.current.y * friction

      if (Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01) {
        velocityRef.current = { x: 0, y: 0 }
        frameRef.current = 0
        return
      }

      const next = {
        x: clamp(sceneOffsetRef.current.x + vx * 16, -DRAG_LIMIT.x, DRAG_LIMIT.x),
        y: clamp(sceneOffsetRef.current.y + vy * 16, -DRAG_LIMIT.y, DRAG_LIMIT.y),
      }

      updateSceneOffset(next)
      velocityRef.current = { x: vx, y: vy }
      frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)
  }

  function handlePointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (event.target.closest('button, input, textarea, select, label')) {
      return
    }

    pointerIdRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStartRef.current = { x: event.clientX, y: event.clientY }
    lastMoveRef.current = { x: event.clientX, y: event.clientY, time: performance.now() }
    velocityRef.current = { x: 0, y: 0 }
    setDragging(true)
    setIsDraggingMotion(false)
    draggingMotionRef.current = false
    cancelAnimationFrame(frameRef.current)
  }

  function handlePointerMove(event) {
    if (!dragging || event.pointerId !== pointerIdRef.current) return

    const dx = event.clientX - dragStartRef.current.x
    const dy = event.clientY - dragStartRef.current.y
    const distance = Math.hypot(dx, dy)

    if (!draggingMotionRef.current && distance > 8) {
      draggingMotionRef.current = true
      setIsDraggingMotion(true)
      setShowHint(false)
    }

    if (!draggingMotionRef.current) return

    const next = {
      x: clamp(sceneOffsetRef.current.x + dx, -DRAG_LIMIT.x, DRAG_LIMIT.x),
      y: clamp(sceneOffsetRef.current.y + dy, -DRAG_LIMIT.y, DRAG_LIMIT.y),
    }

    updateSceneOffset(next)

    const now = performance.now()
    const dt = Math.max(now - lastMoveRef.current.time, 16)
    velocityRef.current = {
      x: (event.clientX - lastMoveRef.current.x) / dt,
      y: (event.clientY - lastMoveRef.current.y) / dt,
    }

    lastMoveRef.current = { x: event.clientX, y: event.clientY, time: now }
    dragStartRef.current = { x: event.clientX, y: event.clientY }
  }

  function handleWheel(event) {
    if (dragging) return
    event.preventDefault()
    const next = {
      x: clamp(sceneOffsetRef.current.x + event.deltaX * 0.8, -DRAG_LIMIT.x, DRAG_LIMIT.x),
      y: clamp(sceneOffsetRef.current.y + event.deltaY * 0.8, -DRAG_LIMIT.y, DRAG_LIMIT.y),
    }
    updateSceneOffset(next)
    setShowHint(false)
  }

  function finishDrag(event) {
    if (!dragging || event.pointerId !== pointerIdRef.current) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragging(false)
    if (draggingMotionRef.current) {
      startInertia()
    }
    setIsDraggingMotion(false)
    draggingMotionRef.current = false
    pointerIdRef.current = null
  }

  function handleSubmit(event) {
    event.preventDefault()
    onCreatePlanet(form.name, form.color, form.size)
    setForm({ name: '', color: '#6f8cff', size: 12000 })
  }

  return (
    <section
      className={`galaxy-page ${dragging ? 'dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onPointerLeave={finishDrag}
      onWheel={handleWheel}
    >
      <Stars count={110} parallax={parallax} />
      <div className="shooting-list">
        {shootingStars.map((star) => (
          <span
            key={star.id}
            className="shooting-star"
            style={{
              top: star.top,
              left: star.left,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      <div
        className="galaxy-view"
        style={{ transform: `translate(${parallax.x + sceneOffset.x}px, ${parallax.y + sceneOffset.y}px)` }}
      >
        <div className="sun-glow" />
        <div className="sun-core" />

        {planets.map((planet) => (
          <Planet
            key={`${planet.name}-${planet.distance}`}
            planet={planet}
            onSelectPlanet={onSelectPlanet}
            isDragging={isDraggingMotion}
          />
        ))}
      </div>

      {showHint && <div className="drag-hint">Drag to explore</div>}

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
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="My Planet"
              />
            </label>
            <label>
              Color
              <input
                type="color"
                value={form.color}
                onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
              />
            </label>
            <label>
              Size (km)
              <input
                type="number"
                min="2000"
                max="70000"
                value={form.size}
                onChange={(event) => setForm((prev) => ({ ...prev, size: Number(event.target.value) }))}
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
