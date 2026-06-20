/* ==========================================================================
   AstroSphere Space Missions Page — space-missions.js
   Canvas starfield, navbar behaviour, 3D card tilts, scroll reveals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initNavbar();
  initCardTilts();
  initScrollReveal();
});

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

  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5,
    phase: Math.random() * Math.PI * 2,
    speed: 0.005 + Math.random() * 0.015,
    col: Math.random() > 0.8 ? 'rgba(34,211,238,' : Math.random() > 0.9 ? 'rgba(255,159,28,' : 'rgba(255,255,255,'
  }));

  const shots = [{ active: false }, { active: false }, { active: false }];
  setInterval(() => {
    const s = shots.find(s => !s.active);
    if (s && Math.random() > 0.4) {
      s.active = true;
      s.x  = Math.random() * W;
      s.y  = Math.random() * H * 0.5;
      const angle = Math.PI / 6 + Math.random() * (Math.PI / 12);
      const speed = 10 + Math.random() * 10;
      s.dx = Math.cos(angle) * speed;
      s.dy = Math.sin(angle) * speed;
      s.len = 80 + Math.random() * 80;
      s.op = 1;
    }
  }, 4500);

  const nebulae = [
    { x: W * 0.15, y: H * 0.25, r: 320, col: 'rgba(168,85,247,0.06)' },
    { x: W * 0.8,  y: H * 0.65, r: 400, col: 'rgba(34,211,238,0.04)' }
  ];

  const particles = Array.from({ length: 25 }, () => ({
    x: Math.random() * W,
    y: H + 10,
    r: 0.5 + Math.random() * 1.5,
    vy: -(0.2 + Math.random() * 0.4),
    vx: (Math.random() - 0.5) * 0.2,
    op: 0.05 + Math.random() * 0.3
  }));

  (function draw() {
    ctx.clearRect(0, 0, W, H);

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

    stars.forEach(s => {
      s.phase += s.speed;
      const op = 0.2 + Math.abs(Math.sin(s.phase)) * 0.8;
      ctx.fillStyle = s.col + op + ')';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    particles.forEach(p => {
      p.y += p.vy; p.x += p.vx;
      if (p.y < -10 || p.x < -10 || p.x > W + 10) {
        p.x = Math.random() * W;
        p.y = H + 10;
      }
      ctx.fillStyle = `rgba(168,85,247,${p.op})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    shots.forEach(s => {
      if (!s.active) return;
      s.x += s.dx; s.y += s.dy; s.op -= 0.015;
      if (s.op <= 0 || s.x > W || s.y > H) { s.active = false; return; }
      ctx.strokeStyle = `rgba(255,255,255,${s.op})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.dx * (s.len / (Math.abs(s.dx) || 1)), s.y - s.dy * (s.len / (Math.abs(s.dy) || 1)));
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
  const links   = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () =>
    navbar.classList.toggle('scrolled', window.scrollY > 50)
  );

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    wrapper.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      wrapper.classList.remove('open');
    });
  });
}

/* ── 3D Card Tilts ── */
function initCardTilts() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const tiltX = (y / rect.height - 0.5) * -18;
      const tiltY = (x / rect.width  - 0.5) *  18;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.transform  = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03,1.03,1.03)`;
      card.style.transition = 'transform 0.05s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      card.style.transition = 'transform 0.5s ease';
    });
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.scroll-reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}
