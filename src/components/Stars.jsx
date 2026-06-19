import { useMemo } from 'react'

function Stars({ count = 80, parallax = false }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 5,
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
