/* =============================================
   NEXUS LABS — main.js
   Canvas particles · Custom cursor · Typed text
   Counters · Reveal · Burger · FAQ · Form
   ============================================= */

// ============ CANVAS PARTICLES ============
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#00e87a', '#7c6af7', '#00cfff', '#ffd166'];
const particles = [];
const PARTICLE_COUNT = 60;

class Particle {
  constructor() { this.reset(true); }
  reset(random) {
    this.x = Math.random() * canvas.width;
    this.y = random ? Math.random() * canvas.height : canvas.height + 10;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life = 0;
    this.maxLife = Math.random() * 400 + 200;
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.life++;
    if (this.y < -10 || this.life > this.maxLife) this.reset(false);
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity * Math.sin((this.life / this.maxLife) * Math.PI);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Grid lines
function drawGrid() {
  ctx.save();
  ctx.strokeStyle = 'rgba(124,106,247,0.04)';
  ctx.lineWidth = 0.5;
  const size = 80;
  for (let x = 0; x < canvas.width; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

// Connection lines between nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 120) * 0.08;
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ============ CUSTOM CURSOR ============
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (cursor && follower && window.innerWidth > 768) {
  let mx = 0, my = 0;
  let fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function followCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(followCursor);
  }
  followCursor();

  document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.7)');
  document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
}

// ============ NAV SCROLL ============
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ============ BURGER MENU ============
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============ REVEAL ON SCROLL ============
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// ============ TYPED TEXT ============
const typedEl = document.getElementById('typedText');
if (typedEl) {
  const phrases = [
    '> build --project="votre-business"',
    '> deploy --target=production',
    '> optimize --seo --performance',
    '> scale --ready=true',
  ];
  let pi = 0, ci = 0, typing = true, pause = 0;

  function typeLoop() {
    const phrase = phrases[pi];
    if (pause > 0) { pause--; setTimeout(typeLoop, 40); return; }
    if (typing) {
      typedEl.textContent = phrase.slice(0, ci + 1) + '▌';
      ci++;
      if (ci >= phrase.length) { typing = false; pause = 60; }
    } else {
      typedEl.textContent = phrase.slice(0, ci - 1) + (ci > 1 ? '▌' : '');
      ci--;
      if (ci <= 0) { typing = true; pi = (pi + 1) % phrases.length; pause = 20; }
    }
    setTimeout(typeLoop, typing ? 55 : 30);
  }
  typeLoop();
}

// ============ CODE BG (hero) ============
const codeBg = document.getElementById('codeBg');
if (codeBg) {
  const lines = [
    'const web = await nexus.build({ client: "you" })',
    'function deploy(project) { return success; }',
    'git commit -m "feat: launch new website 🚀"',
    'npm run build:production',
    'docker compose up --scale app=3',
    'SELECT * FROM clients WHERE satisfied = true',
    'export default function NextWebApp() {',
    '  return <Site speed="A+" design="premium" />',
    '}',
    '.hero { background: #000; color: #00e87a; }',
    'const response = await api.get("/success")',
    'kubectl apply -f deployment.yaml',
    'const revenue = sales.increase("300%")',
    'async function growBusiness(idea) {',
    '  return await nexus.build(idea)',
    '}',
    '@media (max-width: 768px) { /* responsive */ }',
    'console.log("Votre site est en ligne ✓")',
  ];
  codeBg.textContent = Array.from({length: 4}, () => lines.join('\n')).join('\n');
}

// ============ COUNTER ANIMATION ============
const statNums = document.querySelectorAll('.stat-num[data-count]');
if (statNums.length) {
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1800;
      const t0 = performance.now();

      function countUp(now) {
        const progress = Math.min((now - t0) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(countUp);
      }
      requestAnimationFrame(countUp);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => countObs.observe(el));
}

// ============ FAQ ============
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ============ CONTACT FORM ============
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#ff4e6a';
        field.style.boxShadow = '0 0 0 3px rgba(255,78,106,0.1)';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    if (btnText) btnText.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      form.style.display = 'none';
      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.style.animation = 'fadeIn 0.5s ease forwards';
      }
    }, 1400);
  });
}

// ============ HOVER EFFECTS ============
// Add magnetic effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1 - 2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// Glitch on logo hover
const logo = document.querySelector('.nav-logo');
if (logo) {
  logo.addEventListener('mouseenter', () => {
    logo.style.textShadow = `2px 0 var(--cyan), -2px 0 var(--violet)`;
    setTimeout(() => { logo.style.textShadow = ''; }, 200);
  });
}

// ============ PAGE LOAD ANIMATION ============
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

// Smooth page transitions
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel') && !href.startsWith('#')) {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { window.location.href = href; }, 280);
    });
  }
});