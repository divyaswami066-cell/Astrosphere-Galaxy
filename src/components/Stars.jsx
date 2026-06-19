import { useMemo } from 'react'

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function Stars({ count = 130, parallax = false }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        top: seededRandom(index * 1.1) * 100,
        left: seededRandom(index * 2.3) * 100,
        size: seededRandom(index * 3.7) * 2 + 1,
        duration: seededRandom(index * 4.9) * 5 + 3,
        delay: seededRandom(index * 5.6) * 5,
      })),
    [count],
  )

  return (
    <div
      className="star-field"
      style={
        parallax
          ? {
              transform: `translate(${parallax.x}px, ${parallax.y}px)`,
            }
          : undefined
      }
    >
      {stars.map(star => (
        <span
          key={star.id}
          className="star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default Stars
