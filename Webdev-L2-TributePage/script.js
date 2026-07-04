// ── Sticky Nav ──────────────────────────────
const nav = document.getElementById('stickyNav');
const hero = document.querySelector('.hero');

const navObserver = new IntersectionObserver(([entry]) => {
  nav.classList.toggle('visible', !entry.isIntersecting);
}, { threshold: 0.1 });
navObserver.observe(hero);

// ── Scroll Reveals ───────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings in same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Active Nav Link ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sticky-nav a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.sticky-nav a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(s => activeObserver.observe(s));

// ── Smooth Scroll ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Fight Card Tilt on Hover ─────────────────
document.querySelectorAll('.fight-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${(-y * 8).toFixed(1)}deg) rotateY(${(x * 8).toFixed(1)}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Quote Card Hover Glow ────────────────────
document.querySelectorAll('.q-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 0 30px rgba(212,160,23,0.25)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// ── Stat Counter Animation ───────────────────
function animateCounter(el, target, suffix = '') {
  const isNum = typeof target === 'number';
  if (!isNum) { el.textContent = target; return; }
  let start = 0;
  const dur = 1500;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / dur, 1);
    el.textContent = Math.floor(progress * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const statBar = document.querySelector('.stat-bar');
if (statBar) {
  const statObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      const nums = statBar.querySelectorAll('.stat-num');
      animateCounter(nums[0], 56);
      animateCounter(nums[1], 37);
      animateCounter(nums[2], 5);
      nums[3].textContent = '3×';
      statObserver.disconnect();
    }
  }, { threshold: 0.5 });
  statObserver.observe(statBar);
}
