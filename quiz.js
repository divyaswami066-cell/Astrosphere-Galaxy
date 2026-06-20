/* ==========================================================================
   AstroSphere Quiz — quiz.js
   10-question quiz engine with scoring, streaks, and explorer rank reveal
   ========================================================================== */

/* ── Question Bank ── */
const QUESTIONS = [
  {
    badge: '☀️ The Sun',
    text: 'What is the Sun primarily composed of?',
    options: ['Iron and Nickel', 'Hydrogen and Helium', 'Carbon and Oxygen', 'Rock and Ice'],
    correct: 1,
    fact: 'The Sun is about 73% hydrogen and 25% helium, fusing hydrogen into helium in its core.'
  },
  {
    badge: '🌍 Earth',
    text: 'How long does it take Earth to orbit the Sun once?',
    options: ['24 hours', '30 days', '365.25 days', '687 days'],
    correct: 2,
    fact: 'Earth takes 365.25 days — that extra 0.25 adds up to a leap day every four years!'
  },
  {
    badge: '🔴 Mars',
    text: 'What is the tallest volcano in our entire solar system?',
    options: ['Mount Everest', 'Olympus Mons', 'Maxwell Montes', 'Mauna Kea'],
    correct: 1,
    fact: 'Olympus Mons on Mars is about 22 km tall — nearly 3× the height of Mount Everest!'
  },
  {
    badge: '⚡ Jupiter',
    text: 'How many Earths could fit inside Jupiter?',
    options: ['Around 100', 'Around 500', 'Over 1,300', 'Over 10,000'],
    correct: 2,
    fact: 'Jupiter is so massive that more than 1,300 Earths could fit inside it with room to spare.'
  },
  {
    badge: '🪐 Saturn',
    text: "What are Saturn's famous rings mostly made of?",
    options: ['Solid rock and lava', 'Ice chunks and rock debris', 'Liquid methane', 'Compressed gas clouds'],
    correct: 1,
    fact: "Saturn's rings are billions of ice and rock particles ranging from tiny grains to house-sized chunks."
  },
  {
    badge: '🌀 Neptune',
    text: 'Which planet has the strongest winds in the solar system?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correct: 3,
    fact: "Neptune's winds can reach 2,100 km/h — faster than the speed of sound on Earth!"
  },
  {
    badge: '🚀 Apollo 11',
    text: 'Who was the first human to walk on the Moon?',
    options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'],
    correct: 2,
    fact: 'Neil Armstrong became the first human to walk on the Moon on July 20, 1969.'
  },
  {
    badge: '🛰 Voyager 1',
    text: 'Voyager 1 is currently the most distant human-made object. Where is it now?',
    options: ['Orbiting Jupiter', 'Beyond our solar system in interstellar space', 'On the surface of Mars', 'In an asteroid belt'],
    correct: 1,
    fact: 'Launched in 1977, Voyager 1 crossed into interstellar space in 2012 — over 24 billion km from Earth!'
  },
  {
    badge: '🔥 Venus',
    text: 'Why is Venus the hottest planet despite not being closest to the Sun?',
    options: ['It is made of lava', 'Its thick CO₂ atmosphere traps heat (greenhouse effect)', 'It rotates very fast', 'It has no night side'],
    correct: 1,
    fact: "Venus's dense atmosphere creates a runaway greenhouse effect, pushing surface temps to 460°C."
  },
  {
    badge: '🤖 Perseverance',
    text: 'What is the primary mission goal of the Perseverance Rover on Mars?',
    options: ['Plant a flag on Mars', 'Search for signs of ancient microbial life', 'Build a base for astronauts', 'Map the Martian moons'],
    correct: 1,
    fact: 'Perseverance explores Jezero Crater, an ancient lake bed — a prime location to find fossilised life.'
  }
];

/* ── Explorer Ranks (by score) ── */
const RANKS = [
  { min: 0,  max: 3,  badge: '🌱', title: 'Space Cadet',       desc: 'Keep exploring — the stars are waiting for you!' },
  { min: 4,  max: 5,  badge: '🌙', title: 'Lunar Scout',       desc: 'Good start! You know the basics of space.' },
  { min: 6,  max: 7,  badge: '🚀', title: 'Orbit Pilot',       desc: 'Impressive! You have real cosmic knowledge.' },
  { min: 8,  max: 9,  badge: '⭐', title: 'Star Navigator',    desc: 'Outstanding! You know the solar system inside out.' },
  { min: 10, max: 10, badge: '🏆', title: 'Galaxy Commander',  desc: 'Perfect score! You are a true cosmic master!' }
];

/* ── State ── */
let currentQ   = 0;
let score      = 0;
let streak     = 0;
let bestStreak = 0;
let answered   = false;
let shuffled   = [];

/* ── DOM refs ── */
const screenStart    = document.getElementById('screen-start');
const screenQuestion = document.getElementById('screen-question');
const screenResults  = document.getElementById('screen-results');

const hudScore    = document.getElementById('hud-score');
const hudStreak   = document.getElementById('hud-streak');
const hudFill     = document.getElementById('hud-progress-fill');
const hudLabel    = document.getElementById('hud-q-label');
const qBadge      = document.getElementById('q-badge');
const qText       = document.getElementById('q-text');
const qOptions    = document.getElementById('q-options');
const qFeedback   = document.getElementById('q-feedback');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackText = document.getElementById('feedback-text');
const feedbackFact = document.getElementById('feedback-fact');
const btnNextQ    = document.getElementById('btn-next-q');
const nextBtnLabel = document.getElementById('next-btn-label');

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initNavbar();

  document.getElementById('btn-start').addEventListener('click', startQuiz);
  document.getElementById('btn-retry').addEventListener('click', startQuiz);
  btnNextQ.addEventListener('click', nextQuestion);

  // Option click delegation
  qOptions.addEventListener('click', e => {
    const opt = e.target.closest('.q-opt');
    if (opt && !answered) handleAnswer(parseInt(opt.dataset.index));
  });
});

/* ── Quiz Flow ── */
function startQuiz() {
  currentQ   = 0;
  score      = 0;
  streak     = 0;
  bestStreak = 0;
  answered   = false;
  shuffled   = [...QUESTIONS]; // keep order for better UX

  showScreen(screenQuestion);
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const q = shuffled[currentQ];

  // HUD update
  const progress = (currentQ / shuffled.length) * 100;
  hudFill.style.width  = progress + '%';
  hudLabel.textContent = `Question ${currentQ + 1} of ${shuffled.length}`;
  hudScore.textContent = score;
  hudStreak.textContent = streak > 0 ? `🔥 ${streak}` : streak;

  // Question card content
  qBadge.textContent = q.badge;
  qText.textContent  = q.text;

  // Reset options
  const opts = qOptions.querySelectorAll('.q-opt');
  opts.forEach((btn, i) => {
    btn.textContent = q.options[i];
    btn.className   = 'q-opt';
    btn.disabled    = false;
  });

  // Reset feedback & next
  qFeedback.className = 'q-feedback hidden';
  btnNextQ.classList.add('hidden');

  // Card entrance animation
  const card = document.getElementById('question-card');
  card.style.animation = 'none';
  void card.offsetWidth; // reflow
  card.style.animation = 'card-enter 0.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards';
}

function handleAnswer(index) {
  answered = true;
  const q       = shuffled[currentQ];
  const isRight = index === q.correct;
  const opts    = qOptions.querySelectorAll('.q-opt');

  // Disable all options
  opts.forEach(btn => (btn.disabled = true));

  // Highlight correct & chosen
  opts[q.correct].classList.add('correct');
  if (!isRight) opts[index].classList.add('wrong');

  // Update score / streak
  if (isRight) {
    score++;
    streak++;
    bestStreak = Math.max(bestStreak, streak);
  } else {
    streak = 0;
  }

  hudScore.textContent  = score;
  hudStreak.textContent = streak > 0 ? `🔥 ${streak}` : streak;

  // Show feedback
  qFeedback.className = 'q-feedback ' + (isRight ? 'correct-fb' : 'wrong-fb');
  feedbackIcon.textContent = isRight ? '✅' : '❌';
  feedbackText.textContent = isRight ? 'Correct! Well done, Explorer!' : `Not quite — the answer was: "${q.options[q.correct]}"`;
  feedbackFact.textContent = q.fact;

  // Next button label
  nextBtnLabel.textContent = currentQ + 1 < shuffled.length ? 'Next Question ➡️' : 'See My Results 🏆';
  btnNextQ.classList.remove('hidden');
}

function nextQuestion() {
  currentQ++;
  if (currentQ < shuffled.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

/* ── Results ── */
function showResults() {
  showScreen(screenResults);

  // Determine rank
  const rank = RANKS.find(r => score >= r.min && score <= r.max) || RANKS[0];

  document.getElementById('results-rank-badge').textContent = rank.badge;
  document.getElementById('results-rank-title').textContent = rank.title;
  document.getElementById('results-rank-desc').textContent  = rank.desc;

  // Animated score counter
  animateCounter('score-num', 0, score, 800);

  document.getElementById('r-correct').textContent = score;
  document.getElementById('r-wrong').textContent   = shuffled.length - score;
  document.getElementById('r-streak').textContent  = bestStreak;

  // Conic gradient score arc (CSS custom property)
  const pct = (score / shuffled.length) * 100;
  document.getElementById('score-circle').style.setProperty('--score-pct', pct + '%');

  // HUD final state
  hudFill.style.width  = '100%';
  hudLabel.textContent = 'Quiz Complete!';
}

/* ── Helpers ── */
function showScreen(target) {
  [screenStart, screenQuestion, screenResults].forEach(s => {
    s.classList.toggle('hidden', s !== target);
  });
}

function animateCounter(id, from, to, duration) {
  const el   = document.getElementById(id);
  const diff = to - from;
  const start = performance.now();
  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    el.textContent = Math.round(from + diff * progress);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Canvas Starfield ── */
function initCanvas() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Stars
  const stars = Array.from({ length: 180 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
    speed: 0.005 + Math.random() * 0.015,
    color: Math.random() > 0.8 ? 'rgba(34,211,238,' : 'rgba(255,255,255,'
  }));

  // Shooting stars
  const shots = [{ active: false }, { active: false }];
  setInterval(() => {
    const s = shots.find(s => !s.active);
    if (s && Math.random() > 0.4) {
      s.active = true;
      s.x  = Math.random() * W;
      s.y  = Math.random() * H * 0.5;
      s.dx = 12 + Math.random() * 8;
      s.dy = 6  + Math.random() * 4;
      s.len = 80 + Math.random() * 60;
      s.op  = 1;
    }
  }, 5000);

  const nebulae = [
    { x: W * 0.2, y: H * 0.3, r: 280, col: 'rgba(168,85,247,0.06)'  },
    { x: W * 0.8, y: H * 0.7, r: 360, col: 'rgba(34,211,238,0.035)' }
  ];

  (function draw() {
    ctx.clearRect(0, 0, W, H);

    // Nebulae
    nebulae.forEach(n => {
      n.x += Math.sin(Date.now() * 0.00015) * 0.04;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, n.col);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars
    stars.forEach(s => {
      s.phase += s.speed;
      const op = 0.2 + Math.abs(Math.sin(s.phase)) * 0.8;
      ctx.fillStyle = s.color + op + ')';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Shooting stars
    shots.forEach(s => {
      if (!s.active) return;
      s.x += s.dx; s.y += s.dy; s.op -= 0.018;
      if (s.op <= 0 || s.x > W || s.y > H) { s.active = false; return; }
      ctx.strokeStyle = `rgba(255,255,255,${s.op})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.dx * (s.len / (s.dx || 1)), s.y - s.dy * (s.len / (s.dy || 1)));
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  })();
}

/* ── Navbar ── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('menu-toggle');
  const wrapper = document.getElementById('nav-links-wrapper');

  window.addEventListener('scroll', () =>
    navbar.classList.toggle('scrolled', window.scrollY > 50)
  );

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    wrapper.classList.toggle('open');
  });
}
