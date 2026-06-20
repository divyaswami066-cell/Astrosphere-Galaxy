/* ==========================================================================
   AstroSphere JS Script
   Core Interactions, Canvas Background Engine, 3D Tilt, Voice Synth & Carousel
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Background Canvas
  initSpaceCanvas();

  // Initialize Hero Dynamic Title
  initHeroTitle();

  // Initialize Orbit Hover Tooltips
  initOrbitTooltips();

  // Initialize 3D Card Tilts
  initCardTilts();

  // Initialize Interactive Deep Dive Explorer
  initInteractiveExplorer();

  // Initialize Fun Facts Carousel
  initCarousel();

  // Initialize Scroll Reveal Animations
  initScrollReveal();

  // Initialize Navbar Scroll Behavior & Mobile Menu
  initNavbar();
});

/* ==========================================================================
   1. Space Canvas Engine
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

  // Star and Particle configurations
  const numStars = 200;
  const numParticles = 30;

  // Track window resizing
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Star Blueprint
  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5;
      this.opacity = Math.random();
      this.twinkleSpeed = 0.005 + Math.random() * 0.015;
      this.phase = Math.random() * Math.PI * 2;
      // Tailored color glows (mostly white, some pale blue, some pale orange)
      const colorRand = Math.random();
      if (colorRand > 0.85) {
        this.color = 'rgba(34, 211, 238, '; // Pale cyan
      } else if (colorRand > 0.7) {
        this.color = 'rgba(255, 159, 28, '; // Pale orange
      } else {
        this.color = 'rgba(255, 255, 255, '; // Pure white
      }
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

  // Floating Dust Particle Blueprint
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.size = 0.5 + Math.random() * 1.5;
      this.speedY = -(0.2 + Math.random() * 0.4);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = 0.1 + Math.random() * 0.4;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Shooting Star Blueprint
  class ShootingStar {
    constructor() {
      this.active = false;
    }

    trigger() {
      this.active = true;
      this.x = Math.random() * width;
      this.y = Math.random() * (height * 0.5);
      this.speed = 10 + Math.random() * 12;
      this.angle = (Math.PI / 6) + Math.random() * (Math.PI / 12); // ~30 to 45 deg down
      this.dx = Math.cos(this.angle) * this.speed;
      this.dy = Math.sin(this.angle) * this.speed;
      this.length = 80 + Math.random() * 100;
      this.opacity = 1;
      this.fadeSpeed = 0.015 + Math.random() * 0.02;
    }

    update() {
      if (!this.active) return;
      this.x += this.dx;
      this.y += this.dy;
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0 || this.x > width || this.y > height) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.dx * (this.length / this.speed), this.y - this.dy * (this.length / this.speed));
      ctx.stroke();
    }
  }

  // Initialize arrays
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
  for (let i = 0; i < 3; i++) {
    shootingStars.push(new ShootingStar());
  }

  // Random trigger of shooting stars
  setInterval(() => {
    const inactiveStar = shootingStars.find(s => !s.active);
    if (inactiveStar && Math.random() > 0.4) {
      inactiveStar.trigger();
    }
  }, 4000);

  // Nebula cloud specifications
  const nebulae = [
    { x: width * 0.25, y: height * 0.3, r: 250, color: 'rgba(168, 85, 247, 0.06)' }, // Purple
    { x: width * 0.75, y: height * 0.6, r: 350, color: 'rgba(34, 211, 238, 0.04)' }  // Cyan
  ];

  // Render Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Nebula Background glows
    nebulae.forEach(neb => {
      // Dynamic scaling drift
      neb.x += Math.sin(Date.now() * 0.0002) * 0.03;
      neb.y += Math.cos(Date.now() * 0.0002) * 0.03;

      const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'rgba(11, 16, 38, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Draw Stars
    stars.forEach(star => {
      star.update();
      star.draw();
    });

    // 3. Draw Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // 4. Draw Shooting Stars
    shootingStars.forEach(s => {
      s.update();
      s.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Hero Title Typing Effect
   ========================================================================== */
function initHeroTitle() {
  const titleEl = document.getElementById('hero-title');
  if (!titleEl) return;

  const text = "Explore the Wonders of Our Solar System";
  
  // Format letters with custom staggered animations
  titleEl.innerHTML = '';
  
  // Add rocket emoji first
  const emojiSpan = document.createElement('span');
  emojiSpan.className = 'title-emoji';
  emojiSpan.textContent = '🚀 ';
  emojiSpan.style.opacity = '0';
  emojiSpan.style.animation = 'fade-up-char 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards';
  titleEl.appendChild(emojiSpan);

  // Stagger each letter
  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.className = 'title-char';
    if (char === ' ') {
      span.style.marginRight = '0.45rem';
    }
    span.style.opacity = '0';
    span.style.display = 'inline-block';
    // Delay each character slightly
    span.style.animation = `fade-up-char 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) ${0.1 + index * 0.03}s forwards`;
    titleEl.appendChild(span);
  });
}

/* ==========================================================================
   3. Orbit Hover Tooltips
   ========================================================================== */
function initOrbitTooltips() {
  const planets = document.querySelectorAll('.orbit-planet');
  const tooltip = document.getElementById('orbit-tooltip');
  const tooltipName = document.getElementById('tooltip-name');
  const tooltipText = document.getElementById('tooltip-text');

  const planetFacts = {
    'Mercury': 'Closest planet to the Sun. A rocky world with extreme temperatures.',
    'Venus': 'The hottest planet in our solar system, covered in thick toxic clouds.',
    'Earth': 'Our beautiful home. The only place in the universe known to harbor life.',
    'Mars': 'A dusty, cold desert world. Scientists are searching for signs of ancient life.',
    'Jupiter': 'The largest planet. A giant gas world with a storm twice the size of Earth!',
    'Saturn': 'Famous for its spectacular icy rings. It has 146 known moons!',
    'Uranus': 'An icy giant that rotates on its side. It has a beautiful pale blue color.',
    'Neptune': 'The most distant planet. It has the strongest winds in the solar system.'
  };

  planets.forEach(planet => {
    planet.addEventListener('mouseenter', (e) => {
      const name = planet.getAttribute('data-name');
      const fact = planetFacts[name] || '';

      tooltipName.textContent = name;
      tooltipText.textContent = fact;
      tooltip.classList.add('show');

      // Pause orbit rotation on the parent container when hovering
      planet.parentElement.classList.add('paused');
    });

    planet.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
      planet.parentElement.classList.remove('paused');
    });
  });
}

/* ==========================================================================
   4. 3D Card Tilts
   ========================================================================== */
function initCardTilts() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside the card
      const y = e.clientY - rect.top;  // y coordinate inside the card

      // Calculate tilt angles based on position (-0.5 to 0.5 range)
      const tiltX = (y / rect.height) - 0.5;
      const tiltY = (x / rect.width) - 0.5;

      // Apply CSS variables for the radial cursor glow
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Set 3D rotation transform values
      card.style.transform = `perspective(1000px) rotateX(${tiltX * -20}deg) rotateY(${tiltY * 20}deg) scale3d(1.03, 1.03, 1.03)`;
      card.style.transition = 'transform 0.05s ease';
    });

    card.addEventListener('mouseleave', () => {
      // Reset card tilt smoothly
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('click', () => {
      const planetKey = card.getAttribute('data-planet');
      if (planetKey) {
        window.location.href = `explorer.html?planet=${planetKey}`;
      }
    });
  });
}

/* ==========================================================================
   5. Interactive Deep Dive Explorer & Voice Narration
   ========================================================================== */
const planetDatabase = {
  mercury: {
    name: "Mercury",
    tagline: "The Tiny Swift Planet",
    distance: "57.9 Million km",
    year: "88 Days",
    moons: "0 Moons",
    desc: "Mercury is the smallest planet in our solar system and the closest to the Sun. It has no moons and travels through space faster than any other planet, completing an orbit in just 88 Earth days.",
    funfact: "A day on Mercury is 59 Earth days long, but a year is only 88!",
    color: "#a1a1aa",
    glow: "rgba(161, 161, 170, 0.4)",
    avatarGrad: "radial-gradient(circle at 30% 30%, #d4d4d8 0%, #71717a 70%, #27272a 100%)",
    speechVoice: { pitch: 1.4, rate: 1.15 } // Fast, energetic voice
  },
  venus: {
    name: "Venus",
    tagline: "The Greenhouse Oven",
    distance: "108.2 Million km",
    year: "225 Days",
    moons: "0 Moons",
    desc: "Venus is the second planet from the Sun and our closest planetary neighbor. Its thick, toxic atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in the solar system.",
    funfact: "Venus spins backwards compared to most other planets in the solar system.",
    color: "#ca8a04",
    glow: "rgba(202, 138, 4, 0.4)",
    avatarGrad: "radial-gradient(circle at 30% 30%, #fef08a 0%, #eab308 60%, #854d0e 100%)",
    speechVoice: { pitch: 1.1, rate: 0.95 }
  },
  earth: {
    name: "Earth",
    tagline: "Our Beautiful Blue Home",
    distance: "149.6 Million km",
    year: "365 Days",
    moons: "1 Moon",
    desc: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29.2% of Earth's surface is land, while the remaining 70.8% is covered with water.",
    funfact: "The only known planet that supports life and has liquid water on its surface.",
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.4)",
    avatarGrad: "radial-gradient(circle at 30% 30%, #93c5fd 0%, #2563eb 60%, #1e3a8a 100%)",
    speechVoice: { pitch: 1.0, rate: 1.0 }
  },
  mars: {
    name: "Mars",
    tagline: "The Rusty Red Desert",
    distance: "227.9 Million km",
    year: "687 Days",
    moons: "2 Moons",
    desc: "Mars is the fourth planet from the Sun and the second-smallest planet in the solar system. It is a dusty, cold, desert world with a very thin atmosphere, famous for its reddish rust-colored iron oxide soil.",
    funfact: "Mars is home to Olympus Mons, the largest volcano in the solar system, 3x taller than Mount Everest!",
    color: "#ef4444",
    glow: "rgba(239, 68, 68, 0.4)",
    avatarGrad: "radial-gradient(circle at 30% 30%, #fca5a5 0%, #dc2626 65%, #7f1d1d 100%)",
    speechVoice: { pitch: 0.95, rate: 1.05 }
  },
  jupiter: {
    name: "Jupiter",
    tagline: "The Booming Gas King",
    distance: "778.5 Million km",
    year: "12 Years",
    moons: "95 Moons",
    desc: "Jupiter is the largest planet in our solar system, more than twice as massive as all the other planets combined. It is a gas giant made primarily of hydrogen and helium, wrapped in colorful cloud stripes.",
    funfact: "Its Great Red Spot is a giant spinning storm that has raged for over 300 years and could fit Earth inside it!",
    color: "#f97316",
    glow: "rgba(249, 115, 22, 0.4)",
    avatarGrad: "radial-gradient(circle at 30% 30%, #ffedd5 0%, #ea580c 60%, #7c2d12 100%)",
    speechVoice: { pitch: 0.75, rate: 0.85 } // Deep voice
  },
  saturn: {
    name: "Saturn",
    tagline: "The Crowned Giant",
    distance: "1.4 Billion km",
    year: "29 Years",
    moons: "146 Moons",
    desc: "Saturn is the sixth planet from the Sun and the second-largest planet in our solar system. Adorned with thousands of beautiful, icy rings, Saturn is unique and boasts more moons than any other planet.",
    funfact: "Saturn's rings are made of chunks of ice and rock, ranging from tiny dust grains to mountain-sized houses!",
    color: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.4)",
    avatarGrad: "radial-gradient(circle at 30% 30%, #fef9c3 0%, #d97706 60%, #78350f 100%)",
    speechVoice: { pitch: 0.9, rate: 0.95 }
  },
  uranus: {
    name: "Uranus",
    tagline: "The Tilted Ice Giant",
    distance: "2.9 Billion km",
    year: "84 Years",
    moons: "28 Moons",
    desc: "Uranus is the seventh planet from the Sun. It rotates on its side like a rolling ball, likely due to a collision with an Earth-sized object long ago. It is an ice giant with faint rings and blue-green methane clouds.",
    funfact: "Because it spins on its side, Uranus experiences extreme 21-year-long seasons!",
    color: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.4)",
    avatarGrad: "radial-gradient(circle at 30% 30%, #cffafe 0%, #0891b2 60%, #164e63 100%)",
    speechVoice: { pitch: 1.15, rate: 1.05 }
  },
  neptune: {
    name: "Neptune",
    tagline: "The Windy Abyss",
    distance: "4.5 Billion km",
    year: "165 Years",
    moons: "16 Moons",
    desc: "Neptune is the eighth and most distant planet orbiting the Sun. It is a dark, cold ice giant whipped by supersonic winds. It was the first planet discovered through mathematical calculations rather than telescope searching.",
    funfact: "Neptune experiences supersonic winds that travel faster than the speed of sound!",
    color: "#2563eb",
    glow: "rgba(37, 99, 235, 0.4)",
    avatarGrad: "radial-gradient(circle at 30% 30%, #dbeafe 0%, #2563eb 60%, #1e3a8a 100%)",
    speechVoice: { pitch: 0.85, rate: 0.9 }
  }
};

let currentSpeechUtterance = null;
let voiceActive = false;

function initInteractiveExplorer() {
  const dots = document.querySelectorAll('.preview-orbit-ring');
  const panel = document.getElementById('planet-detail-panel');
  const btnVoice = document.getElementById('btn-voice');
  const voiceWave = document.getElementById('voice-wave-container');

  // Interactive selectors
  dots.forEach(ring => {
    ring.addEventListener('click', () => {
      const planetKey = ring.getAttribute('data-planet');
      
      // Toggle active states
      document.querySelectorAll('.preview-dot').forEach(dot => dot.classList.remove('active'));
      ring.querySelector('.preview-dot').classList.add('active');

      // Update Detail content
      updateDetailPanel(planetKey);
    });
  });

  // Voice synth triggers
  btnVoice.addEventListener('click', () => {
    if (voiceActive) {
      stopVoiceNarration();
    } else {
      startVoiceNarration();
    }
  });
}

function updateDetailPanel(key) {
  stopVoiceNarration(); // Reset active speech on planet swap
  
  const data = planetDatabase[key];
  if (!data) return;

  const panel = document.getElementById('planet-detail-panel');
  const glow = document.getElementById('panel-glow-color');
  const avatar = document.getElementById('detail-planet-avatar');
  const name = document.getElementById('detail-planet-name');
  const tagline = document.getElementById('detail-planet-tagline');
  const dist = document.getElementById('detail-stat-distance');
  const year = document.getElementById('detail-stat-year');
  const moons = document.getElementById('detail-stat-moons');
  const desc = document.getElementById('detail-planet-desc');
  const funfact = document.getElementById('detail-planet-funfact');

  // Class animation trigger
  panel.style.opacity = '0.3';
  panel.style.transform = 'translateY(10px)';

  setTimeout(() => {
    // Apply changes
    glow.style.background = `radial-gradient(circle, ${data.color}, transparent 70%)`;
    avatar.style.background = data.avatarGrad;
    avatar.style.boxShadow = `inset -10px -10px 20px rgba(0, 0, 0, 0.8), 0 0 25px ${data.color}`;
    
    // Add rings visual for Saturn
    if (key === 'saturn') {
      avatar.innerHTML = `<div class="saturn-rings-visual" style="width: 100px; height: 30px; border-width: 6px;"></div>`;
    } else {
      avatar.innerHTML = '';
    }

    name.textContent = data.name;
    tagline.textContent = data.tagline;
    tagline.style.color = data.color;
    dist.textContent = data.distance;
    year.textContent = data.year;
    moons.textContent = data.moons;
    desc.textContent = data.desc;
    funfact.textContent = data.funfact;

    panel.style.opacity = '1';
    panel.style.transform = 'translateY(0)';
  }, 300);
}

function startVoiceNarration() {
  if (!('speechSynthesis' in window)) {
    alert("Speech synthesis is not supported in this browser. Try Chrome, Edge, or Safari!");
    return;
  }

  window.speechSynthesis.cancel(); // Stop anything ongoing

  const activeName = document.getElementById('detail-planet-name').textContent.toLowerCase();
  const data = planetDatabase[activeName];
  if (!data) return;

  const btnVoice = document.getElementById('btn-voice');
  const voiceText = document.getElementById('voice-btn-text');
  const voiceWave = document.getElementById('voice-wave-container');

  // Build the script
  const scriptText = `I am ${data.name}. ${data.tagline}. ${data.desc} Did you know? ${data.funfact}`;
  
  currentSpeechUtterance = new SpeechSynthesisUtterance(scriptText);
  
  // Find system English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
  if (englishVoice) {
    currentSpeechUtterance.voice = englishVoice;
  }

  // Adjust parameters
  currentSpeechUtterance.pitch = data.speechVoice.pitch;
  currentSpeechUtterance.rate = data.speechVoice.rate;

  currentSpeechUtterance.onstart = () => {
    voiceActive = true;
    voiceText.textContent = "Stop Voice Narration";
    btnVoice.style.background = 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)';
    btnVoice.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
    btnVoice.style.color = '#ffffff';
    voiceWave.classList.add('active');
  };

  currentSpeechUtterance.onend = () => {
    resetVoiceBtnState();
  };

  currentSpeechUtterance.onerror = () => {
    resetVoiceBtnState();
  };

  window.speechSynthesis.speak(currentSpeechUtterance);
}

function stopVoiceNarration() {
  window.speechSynthesis.cancel();
  resetVoiceBtnState();
}

function resetVoiceBtnState() {
  voiceActive = false;
  const btnVoice = document.getElementById('btn-voice');
  const voiceText = document.getElementById('voice-btn-text');
  const voiceWave = document.getElementById('voice-wave-container');

  if (btnVoice) {
    btnVoice.style.background = 'linear-gradient(135deg, var(--color-blue) 0%, rgba(34, 211, 238, 0.7) 100%)';
    btnVoice.style.boxShadow = '0 4px 15px rgba(34, 211, 238, 0.2)';
    btnVoice.style.color = 'var(--color-bg-space)';
    voiceText.textContent = "Planet Voice Narration";
  }
  if (voiceWave) {
    voiceWave.classList.remove('active');
  }
}

// Chrome loads voices asynchronously, trigger loading early
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
}

/* ==========================================================================
   6. Fun Facts Carousel
   ========================================================================== */
function initCarousel() {
  const track = document.getElementById('carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextBtn = document.getElementById('carousel-next');
  const prevBtn = document.getElementById('carousel-prev');
  const indicators = Array.from(document.querySelectorAll('.indicator'));
  const fill = document.getElementById('carousel-progress-fill');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoTimer = null;
  const intervalTime = 5000; // 5 seconds
  let progressStart = 0;

  function updateCarousel(index) {
    // Bounds check
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;

    // Shift slides track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Swap active slide visibility classes
    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update indicator dots
    indicators.forEach((indicator, i) => {
      if (i === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });

    resetProgress();
  }

  // Linear progress bar countdown
  function resetProgress() {
    if (autoTimer) clearInterval(autoTimer);
    fill.style.width = '0%';
    fill.style.transition = 'none';

    // Delay briefly to allow paint before animation
    setTimeout(() => {
      fill.style.transition = `width ${intervalTime}ms linear`;
      fill.style.width = '100%';
    }, 50);

    autoTimer = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, intervalTime);
  }

  // Click Handlers
  nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
  prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));

  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      const slideIndex = parseInt(indicator.getAttribute('data-slide'));
      updateCarousel(slideIndex);
    });
  });

  // Start progress loop
  resetProgress();
}

/* ==========================================================================
   7. Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once animation has played
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of card is shown
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it enters screen
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   8. Navbar Scroll State & Mobile Menu Toggle
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const linksWrapper = document.getElementById('nav-links-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll color shift triggers
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger drawer
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    linksWrapper.classList.toggle('open');
  });

  // Close menu drawer when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      linksWrapper.classList.remove('open');

      // Active state highlight swap
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}
