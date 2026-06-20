/* ==========================================================================
   AstroSphere Explorer JavaScript
   Trigonometric Orbits, LERP transitions, Synced Typewriter & TTS Voice Synth
   ========================================================================== */

// Planet Database containing explorer stats, narration scripts and settings
const planetExplorerDb = {
  mercury: {
    name: "Mercury",
    tagline: "The Tiny Swift Planet",
    type: "Rocky / Terrestrial",
    diameter: "4,879 km",
    distance: "57.9 Million km",
    moons: "0 Moons",
    temp: "-180°C to 430°C",
    funfact: "A day on Mercury is 59 Earth days long, but a year is only 88!",
    emoji: "☄️",
    color: "#a1a1aa",
    script: "Hello there space explorer! I am Mercury, the closest planet to the Sun. I am tiny, but super fast. Because I have almost no atmosphere to trap heat, I get freezing cold at night and boiling hot during the day! Let's zoom around the Sun together!",
    vocal: { pitch: 1.45, rate: 1.2 }
  },
  venus: {
    name: "Venus",
    tagline: "The Greenhouse Oven",
    type: "Rocky / Terrestrial",
    diameter: "12,104 km",
    distance: "108.2 Million km",
    moons: "0 Moons",
    temp: "460°C",
    funfact: "Venus spins backwards compared to most other planets in the solar system.",
    emoji: "🔥",
    color: "#ca8a04",
    script: "Welcome! I am Venus, the second planet from the Sun. I am often called Earth's twin, but I am very different! I am covered in thick yellow clouds that trap heat in a runaway greenhouse effect, making me the hottest planet in the solar system.",
    vocal: { pitch: 1.1, rate: 0.95 }
  },
  earth: {
    name: "Earth",
    tagline: "Our Beautiful Blue Home",
    type: "Rocky / Terrestrial",
    diameter: "12,742 km",
    distance: "149.6 Million km",
    moons: "1 Moon",
    temp: "-88°C to 58°C",
    funfact: "The only known planet that supports life and has liquid water on its surface.",
    emoji: "🌍",
    color: "#3b82f6",
    script: "Hi there! I am Earth, your home planet. I am the only planet we know of that has liquid water, blue oceans, green forests, and life. Look closely—you can see my moon orbiting around me! Let's work together to take good care of my environment.",
    vocal: { pitch: 1.0, rate: 1.0 }
  },
  mars: {
    name: "Mars",
    tagline: "The Rusty Red Desert",
    type: "Rocky / Terrestrial",
    diameter: "6,779 km",
    distance: "227.9 Million km",
    moons: "2 Moons",
    temp: "-140°C to 20°C",
    funfact: "Mars is home to Olympus Mons, the largest volcano in the solar system, 3x taller than Mount Everest!",
    emoji: "🔴",
    color: "#ef4444",
    script: "Greetings! I am Mars, the Red Planet. My ground is covered in rusty iron oxide, which makes me look like a glowing red beacon. I have two tiny moons named Phobos and Deimos, and ancient dry lakebeds. Maybe you will visit me one day!",
    vocal: { pitch: 0.95, rate: 1.05 }
  },
  jupiter: {
    name: "Jupiter",
    tagline: "The Booming Gas King",
    type: "Gas Giant",
    diameter: "139,820 km",
    distance: "778.5 Million km",
    moons: "95 Moons",
    temp: "-110°C",
    funfact: "Its Great Red Spot is a giant spinning storm that has raged for over 300 years and could fit Earth inside it!",
    emoji: "⚡",
    color: "#f97316",
    script: "Greetings, little star traveler! I am Jupiter, the king of the solar system. I am a gas giant, made mostly of swirling hydrogen and helium. I have a giant storm twice the size of Earth, and ninety-five moons! I am so massive I protect other planets from comets.",
    vocal: { pitch: 0.75, rate: 0.85 }
  },
  saturn: {
    name: "Saturn",
    tagline: "The Crowned Giant",
    type: "Gas Giant",
    diameter: "116,460 km",
    distance: "1.4 Billion km",
    moons: "146 Moons",
    temp: "-140°C",
    funfact: "Saturn's rings are made of chunks of ice and rock, ranging from tiny dust grains to mountain-sized houses!",
    emoji: "🪐",
    color: "#fbbf24",
    script: "Hello explorer! I am Saturn. I am famous for my spectacular rings made of billions of ice chunks, dust, and rock. I also have the most moons in the solar system. I am so light and gassy that if you could find a bathtub big enough, I would float in it!",
    vocal: { pitch: 0.9, rate: 0.95 }
  },
  uranus: {
    name: "Uranus",
    tagline: "The Tilted Ice Giant",
    type: "Ice Giant",
    diameter: "50,724 km",
    distance: "2.9 Billion km",
    moons: "28 Moons",
    temp: "-195°C",
    funfact: "Because it spins on its side, Uranus experiences extreme 21-year-long seasons!",
    emoji: "🌀",
    color: "#06b6d4",
    script: "Oh, hey! I am Uranus, the cold ice giant. I spin completely on my side, like a rolling bowling ball! A giant crash long ago probably knocked me over. I have faint vertical rings and methane clouds that give me my beautiful pale blue color.",
    vocal: { pitch: 1.15, rate: 1.05 }
  },
  neptune: {
    name: "Neptune",
    tagline: "The Windy Abyss",
    type: "Ice Giant",
    diameter: "49,244 km",
    distance: "4.5 Billion km",
    moons: "16 Moons",
    temp: "-200°C",
    funfact: "Neptune experiences supersonic winds that travel faster than the speed of sound!",
    emoji: "🌀",
    color: "#2563eb",
    script: "Brrr! Hello! I am Neptune, the windiest planet. I am a deep blue ice giant located at the very edge of our solar system. My winds blow at supersonic speeds, faster than a jet plane! It takes me one hundred and sixty-five Earth years to orbit the Sun just once.",
    vocal: { pitch: 0.85, rate: 0.9 }
  }
};

// Simulation State variables
let viewMode = 'orbit'; // 'orbit' or 'zoomed'
let selectedPlanet = null;

// Orbit Parameters: radius values matching CSS ring diameters/2
const orbits = {
  mercury: { r: 90, speed: 0.015, angle: Math.random() * Math.PI * 2, cx: 0, cy: 0, currentX: 0, currentY: 0 },
  venus:   { r: 140, speed: 0.010, angle: Math.random() * Math.PI * 2, cx: 0, cy: 0, currentX: 0, currentY: 0 },
  earth:   { r: 190, speed: 0.007, angle: Math.random() * Math.PI * 2, cx: 0, cy: 0, currentX: 0, currentY: 0 },
  mars:    { r: 240, speed: 0.005, angle: Math.random() * Math.PI * 2, cx: 0, cy: 0, currentX: 0, currentY: 0 },
  jupiter: { r: 310, speed: 0.003, angle: Math.random() * Math.PI * 2, cx: 0, cy: 0, currentX: 0, currentY: 0 },
  saturn:  { r: 390, speed: 0.002, angle: Math.random() * Math.PI * 2, cx: 0, cy: 0, currentX: 0, currentY: 0 },
  uranus:  { r: 460, speed: 0.001, angle: Math.random() * Math.PI * 2, cx: 0, cy: 0, currentX: 0, currentY: 0 },
  neptune: { r: 530, speed: 0.0007, angle: Math.random() * Math.PI * 2, cx: 0, cy: 0, currentX: 0, currentY: 0 }
};

// Typewriter timers & active speech
let typewriterInterval = null;
let activeUtterance = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Space Canvas background
  initSpaceCanvas();

  // 2. Initialize Planet Coordinates and start Orbital Loop
  initOrbits();

  // 3. Bind UI Click Events
  bindExplorerEvents();

  // 4. Check for query parameters to trigger automatic zoom
  const urlParams = new URLSearchParams(window.location.search);
  const startPlanet = urlParams.get('planet');
  if (startPlanet && planetExplorerDb[startPlanet]) {
    setTimeout(() => {
      zoomPlanet(startPlanet);
    }, 1000);
  }
});

/* ==========================================================================
   1. Canvas Starfield Background
   ========================================================================== */
function initSpaceCanvas() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let shootingStars = [];
  let particles = [];
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5;
      this.opacity = Math.random();
      this.twinkleSpeed = 0.005 + Math.random() * 0.015;
      this.phase = Math.random() * Math.PI * 2;
      this.color = Math.random() > 0.8 ? 'rgba(34, 211, 238, ' : 'rgba(255, 255, 255, ';
    }
    update() {
      this.phase += this.twinkleSpeed;
      this.opacity = 0.2 + Math.abs(Math.sin(this.phase)) * 0.8;
    }
    draw() {
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.size = 0.5 + Math.random() * 1.5;
      this.speedY = -(0.1 + Math.random() * 0.3);
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.opacity = 0.05 + Math.random() * 0.25;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -10 || this.x < -10 || this.x > width + 10) this.reset();
    }
    draw() {
      ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class ShootingStar {
    constructor() { this.active = false; }
    trigger() {
      this.active = true;
      this.x = Math.random() * width;
      this.y = Math.random() * (height * 0.4);
      this.speed = 12 + Math.random() * 10;
      this.angle = (Math.PI / 6) + Math.random() * (Math.PI / 12);
      this.dx = Math.cos(this.angle) * this.speed;
      this.dy = Math.sin(this.angle) * this.speed;
      this.length = 70 + Math.random() * 80;
      this.opacity = 1;
      this.fadeSpeed = 0.015 + Math.random() * 0.01;
    }
    update() {
      if (!this.active) return;
      this.x += this.dx;
      this.y += this.dy;
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0 || this.x > width || this.y > height) this.active = false;
    }
    draw() {
      if (!this.active) return;
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.dx * (this.length / this.speed), this.y - this.dy * (this.length / this.speed));
      ctx.stroke();
    }
  }

  for (let i = 0; i < 150; i++) stars.push(new Star());
  for (let i = 0; i < 20; i++) particles.push(new Particle());
  for (let i = 0; i < 2; i++) shootingStars.push(new ShootingStar());

  setInterval(() => {
    const s = shootingStars.find(st => !st.active);
    if (s && Math.random() > 0.5) s.trigger();
  }, 5000);

  const nebulae = [
    { x: width * 0.3, y: height * 0.4, r: 300, color: 'rgba(168, 85, 247, 0.05)' },
    { x: width * 0.7, y: height * 0.5, r: 400, color: 'rgba(34, 211, 238, 0.03)' }
  ];

  function draw() {
    ctx.clearRect(0, 0, width, height);

    nebulae.forEach(neb => {
      neb.x += Math.sin(Date.now() * 0.00015) * 0.03;
      const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'rgba(11, 16, 38, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
      ctx.fill();
    });

    stars.forEach(s => { s.update(); s.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    shootingStars.forEach(s => { s.update(); s.draw(); });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ==========================================================================
   2. Trigonometric Orbits Loop & LERP Transitions
   ========================================================================== */
function initOrbits() {
  const systemCenterX = window.innerWidth / 2;
  const systemCenterY = window.innerHeight / 2;

  // Pre-populate actual coordinates immediately to prevent planets zooming in from (0,0) on page load
  Object.keys(orbits).forEach(key => {
    const o = orbits[key];
    const initX = systemCenterX + o.r * Math.cos(o.angle);
    const initY = systemCenterY + o.r * Math.sin(o.angle);
    o.currentX = initX;
    o.currentY = initY;

    // Apply immediate CSS positioning
    const el = document.getElementById(`planet-${key}`);
    if (el) {
      el.style.left = `${initX}px`;
      el.style.top = `${initY}px`;
    }
  });

  // Start coordinate calculation loop
  requestAnimationFrame(updateOrbitsFrame);
}

function updateOrbitsFrame() {
  // Recalculate centers on every frame to support resize perfectly
  const systemCenterX = window.innerWidth / 2;
  const systemCenterY = window.innerHeight / 2;

  const isMobile = window.innerWidth <= 1024;
  const zoomCenterX = isMobile ? window.innerWidth / 2 : window.innerWidth * 0.35;
  const zoomCenterY = isMobile ? window.innerHeight * 0.35 : window.innerHeight / 2;

  Object.keys(orbits).forEach(key => {
    const o = orbits[key];
    const el = document.getElementById(`planet-${key}`);
    if (!el) return;

    let targetX, targetY;

    if (viewMode === 'orbit') {
      // 1. Standard Orbit State
      o.angle += o.speed;
      targetX = systemCenterX + o.r * Math.cos(o.angle);
      targetY = systemCenterY + o.r * Math.sin(o.angle);

      // Glide smoothly back into orbit path using Lerp
      o.currentX = lerp(o.currentX, targetX, 0.08);
      o.currentY = lerp(o.currentY, targetY, 0.08);
    } 
    else if (viewMode === 'zoomed') {
      if (selectedPlanet === key) {
        // 2. Zoomed Planet: Lerp smoothly to Zoom Center
        targetX = zoomCenterX;
        targetY = zoomCenterY;
        o.currentX = lerp(o.currentX, targetX, 0.08);
        o.currentY = lerp(o.currentY, targetY, 0.08);
      } else {
        // 3. Faded Planets: Keep orbiting quietly in background
        o.angle += o.speed;
        targetX = systemCenterX + o.r * Math.cos(o.angle);
        targetY = systemCenterY + o.r * Math.sin(o.angle);
        o.currentX = lerp(o.currentX, targetX, 0.08);
        o.currentY = lerp(o.currentY, targetY, 0.08);
      }
    }

    // Apply coordinate updates
    el.style.left = `${o.currentX}px`;
    el.style.top = `${o.currentY}px`;
  });

  requestAnimationFrame(updateOrbitsFrame);
}

// Helper linear interpolation function
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

/* ==========================================================================
   3. Binding Click Handlers & Panel Controls
   ========================================================================== */
function bindExplorerEvents() {
  const planets = document.querySelectorAll('.explorer-planet');
  const btnBack = document.getElementById('btn-back');
  const btnReplay = document.getElementById('btn-replay');
  const btnNext = document.getElementById('btn-next');

  // Trigger Zoom-in on planet click
  planets.forEach(planet => {
    planet.addEventListener('click', () => {
      if (viewMode === 'zoomed' && selectedPlanet === planet.getAttribute('data-planet')) return;
      zoomPlanet(planet.getAttribute('data-planet'));
    });
  });

  // Panel Control actions
  btnBack.addEventListener('click', returnToOrbitView);
  btnReplay.addEventListener('click', replayActiveNarration);
  btnNext.addEventListener('click', zoomToNextPlanet);
}

/* ==========================================================================
   4. Zoom Transitions & State Controls
   ========================================================================== */
function zoomPlanet(key) {
  if (typewriterInterval) clearInterval(typewriterInterval);
  window.speechSynthesis.cancel(); // Stop active voices

  viewMode = 'zoomed';
  selectedPlanet = key;

  const db = planetExplorerDb[key];
  if (!db) return;

  // 1. Apply visual layout class transitions
  document.querySelectorAll('.explorer-planet').forEach(el => {
    if (el.getAttribute('data-planet') === key) {
      el.classList.add('zoomed');
      el.classList.remove('faded');
    } else {
      el.classList.remove('zoomed');
      el.classList.add('faded');
    }
  });

  // Fade out Sun and Orbit dashed circles
  document.getElementById('system-sun').classList.add('fade-out');
  document.querySelectorAll('.system-orbit').forEach(orb => orb.classList.add('fade-out'));

  // 2. Populate stats in Sidebar
  document.getElementById('sidebar-title').textContent = db.name;
  document.getElementById('sidebar-tagline').textContent = db.tagline;
  document.getElementById('sidebar-tagline').style.color = db.color;
  document.getElementById('stat-type').textContent = db.type;
  document.getElementById('stat-diameter').textContent = db.diameter;
  document.getElementById('stat-distance').textContent = db.distance;
  document.getElementById('stat-moons').textContent = db.moons;
  document.getElementById('stat-temp').textContent = db.temp;
  document.getElementById('stat-funfact').textContent = db.funfact;

  document.getElementById('sidebar-glow-color').style.background = `radial-gradient(circle, ${db.color}, transparent 70%)`;

  // 3. Update Speech Bubble Header
  document.getElementById('bubble-speaker-name').textContent = db.name;
  document.getElementById('bubble-speaker-emoji').textContent = db.emoji;

  // Open sidebar & speech bubble
  document.getElementById('explorer-sidebar').classList.add('open');
  document.getElementById('explorer-speech-bubble').classList.add('open');

  // 4. Trigger typing animation and Voice Synthesis
  triggerNarration(db);
}

function returnToOrbitView() {
  if (typewriterInterval) clearInterval(typewriterInterval);
  window.speechSynthesis.cancel();

  viewMode = 'orbit';
  selectedPlanet = null;

  // 1. Remove all zoom and fade classes
  document.querySelectorAll('.explorer-planet').forEach(el => {
    el.classList.remove('zoomed', 'faded');
  });

  document.getElementById('system-sun').classList.remove('fade-out');
  document.querySelectorAll('.system-orbit').forEach(orb => orb.classList.remove('fade-out'));

  // 2. Slide back Sidebar and speech bubble
  document.getElementById('explorer-sidebar').classList.remove('open');
  document.getElementById('explorer-speech-bubble').classList.remove('open');
}

function zoomToNextPlanet() {
  const planetKeys = Object.keys(planetExplorerDb);
  let nextIndex = 0;

  if (selectedPlanet) {
    const currentIndex = planetKeys.indexOf(selectedPlanet);
    nextIndex = (currentIndex + 1) % planetKeys.length;
  }

  zoomPlanet(planetKeys[nextIndex]);
}

/* ==========================================================================
   5. Synced Typewriter & TTS Narration
   ========================================================================== */
function triggerNarration(db) {
  const bubbleText = document.getElementById('bubble-text');
  bubbleText.textContent = '';
  bubbleText.classList.remove('typing-done');

  // 1. Character Typing Animation Setup
  const chars = db.script.split('');
  let i = 0;

  typewriterInterval = setInterval(() => {
    if (i < chars.length) {
      bubbleText.textContent += chars[i];
      i++;
    } else {
      clearInterval(typewriterInterval);
      bubbleText.classList.add('typing-done');
    }
  }, 35); // Fast typing speed (approx 35ms per letter)

  // 2. Audio voice synthesis setup
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(db.script);

    // Pick a local English voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (voice) utterance.voice = voice;

    // Apply voice settings
    utterance.pitch = db.vocal.pitch;
    utterance.rate = db.vocal.rate;

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

function replayActiveNarration() {
  if (!selectedPlanet) return;
  const db = planetExplorerDb[selectedPlanet];
  if (!db) return;

  if (typewriterInterval) clearInterval(typewriterInterval);
  window.speechSynthesis.cancel();

  triggerNarration(db);
}

// Pre-fetch speech voices asynchronously
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
