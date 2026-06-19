import Stars from './Stars'

function LandingPage({ onEnter }) {
  return (
    <section className="landing-page">
      <Stars count={100} parallax={false} />
      <div className="landing-content">
        <h1 className="landing-title">Astro Sphere</h1>
        <p className="landing-copy">Explore the infinite space with glowing planets, interactive orbit paths, and a cosmic story.</p>
        <button className="enter-button" type="button" onClick={onEnter}>
          Enter Galaxy
        </button>
      </div>
    </section>
  )
}

export default LandingPage
