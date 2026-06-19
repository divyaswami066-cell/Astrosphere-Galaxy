import { useMemo, useState } from 'react'
import LandingPage from './components/LandingPage'
import Galaxy from './components/Galaxy'
import Popup from './components/Popup'

const planets = [
  {
    name: 'Mercury',
    label: 'Mercury',
    color: '#b7b7d4',
    diameter: '4,880 km',
    distance: '58 million km',
    fact: 'Mercury is the fastest planet in our solar system.',
    orbitRadius: 120,
    orbitDuration: 8.8,
    size: 16,
  },
  {
    name: 'Venus',
    label: 'Venus',
    color: '#e8c77e',
    diameter: '12,104 km',
    distance: '108 million km',
    fact: 'Venus spins backward compared to most planets.',
    orbitRadius: 165,
    orbitDuration: 12.4,
    size: 20,
  },
  {
    name: 'Earth',
    label: 'Earth',
    color: '#4d9cff',
    diameter: '12,742 km',
    distance: '150 million km',
    fact: 'Earth is the only planet known to support life.',
    orbitRadius: 210,
    orbitDuration: 16.5,
    size: 22,
  },
  {
    name: 'Mars',
    label: 'Mars',
    color: '#ff7c42',
    diameter: '6,779 km',
    distance: '228 million km',
    fact: 'Mars has the tallest volcano in the solar system.',
    orbitRadius: 255,
    orbitDuration: 20.3,
    size: 18,
  },
  {
    name: 'Jupiter',
    label: 'Jupiter',
    color: '#e8c27a',
    diameter: '139,820 km',
    distance: '778 million km',
    fact: 'Jupiter is so large it could fit 1,300 Earths inside.',
    orbitRadius: 305,
    orbitDuration: 28.1,
    size: 28,
  },
  {
    name: 'Saturn',
    label: 'Saturn',
    color: '#dac48d',
    diameter: '116,460 km',
    distance: '1.4 billion km',
    fact: 'Saturn appears flat because of its wide rings.',
    orbitRadius: 355,
    orbitDuration: 34.4,
    size: 26,
    rings: true,
  },
  {
    name: 'Uranus',
    label: 'Uranus',
    color: '#8fd3ff',
    diameter: '50,724 km',
    distance: '2.9 billion km',
    fact: 'Uranus rolls on its side as it travels around the sun.',
    orbitRadius: 405,
    orbitDuration: 42.0,
    size: 24,
  },
  {
    name: 'Neptune',
    label: 'Neptune',
    color: '#4a7bff',
    diameter: '49,244 km',
    distance: '4.5 billion km',
    fact: 'Neptune has the strongest winds in the solar system.',
    orbitRadius: 455,
    orbitDuration: 49.2,
    size: 24,
  },
  {
    name: 'Pluto',
    label: 'Pluto',
    color: '#c6a6ff',
    diameter: '2,377 km',
    distance: '5.9 billion km',
    fact: 'Pluto is a dwarf planet with a heart-shaped ice region.',
    orbitRadius: 500,
    orbitDuration: 56.7,
    size: 14,
  },
]

const spaceFacts = [
  'A day on Venus is longer than a year on Venus.',
  'There are more stars in the universe than grains of sand on Earth.',
  'Jupiter has a giant storm that has been raging for centuries.',
  'The Sun makes up 99.86% of the mass in our solar system.',
  'A spoonful of neutron star matter would weigh about a billion tons.',
  'Saturn could float in water because it is mostly gas.',
]

function getRandomFact(currentFact) {
  const options = spaceFacts.filter(fact => fact !== currentFact)
  return options[Math.floor(Math.random() * options.length)]
}

function App() {
  const [entered, setEntered] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [customPlanets, setCustomPlanets] = useState([])
  const [currentFact, setCurrentFact] = useState(spaceFacts[0])
  const [blackHoleActive, setBlackHoleActive] = useState(false)

  const allPlanets = useMemo(() => [...planets, ...customPlanets], [customPlanets])

  function handleCreatePlanet(name, color, size) {
    const safeName = name.trim() || `New planet ${customPlanets.length + 1}`
    const nextRadius = 560 + customPlanets.length * 45
    const newPlanet = {
      name: safeName,
      label: safeName,
      color,
      diameter: `${size} km`,
      distance: `${nextRadius} million km`,
      fact: 'A custom planet born from your imagination.',
      orbitRadius: nextRadius,
      orbitDuration: 62 + customPlanets.length * 8,
      size: Math.max(14, Math.min(size / 50, 34)),
      custom: true,
    }
    setCustomPlanets(prev => [...prev, newPlanet])
  }

  function handleBlackHoleClick() {
    setBlackHoleActive(true)
    setTimeout(() => setBlackHoleActive(false), 1200)
  }

  return (
    <div className={`app ${blackHoleActive ? 'blackhole-active' : ''}`}>
      {!entered && <LandingPage onEnter={() => setEntered(true)} />}
      {entered && (
        <Galaxy
          planets={allPlanets}
          onSelectPlanet={planet => setSelectedPlanet(planet)}
          onCreatePlanet={handleCreatePlanet}
          currentFact={currentFact}
          onNextFact={() => setCurrentFact(getRandomFact(currentFact))}
          onBlackHoleClick={handleBlackHoleClick}
        />
      )}
      {selectedPlanet && (
        <Popup planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />
      )}
    </div>
  )
}

export default App
