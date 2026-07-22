(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav toggle ---------- */
  const topbar = document.getElementById('topbar');
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle && topbar) {
    navToggle.addEventListener('click', () => {
      const open = topbar.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    topbar.querySelectorAll('.primary-nav a').forEach((link) => {
      link.addEventListener('click', () => {
        topbar.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- active nav link on scroll ---------- */
  const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = '#' + entry.target.id;
          const link = navLinks.find((a) => a.getAttribute('href') === id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- status pill rotator ---------- */
  const statusPill = document.getElementById('status-pill');
  const statuses = [
    '🟢 currently compiling',
    '☕ caffeine level: critical',
    '🚴 out riding, will debug later',
    '🎯 airsoft mode: engaged',
    '🐛 fixing a bug I wrote yesterday',
    '🏃 running from deadlines, literally',
    '🛠️ overengineering a solved problem',
  ];
  if (statusPill && !prefersReducedMotion) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % statuses.length;
      statusPill.style.opacity = '0';
      setTimeout(() => {
        statusPill.textContent = statuses[i];
        statusPill.style.opacity = '1';
      }, 250);
    }, 4200);
  }

  /* ---------- like buttons (local, playful, resets on reload) ---------- */
  document.querySelectorAll('.like-btn').forEach((btn) => {
    const countEl = btn.querySelector('span');
    const base = parseInt(btn.dataset.count, 10) || 0;
    let liked = false;
    btn.addEventListener('click', () => {
      liked = !liked;
      btn.classList.toggle('liked', liked);
      countEl.textContent = liked ? base + 1 : base;
    });
  });

  /* ---------- scroll reveal ---------- */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.post, .stack-group, .gallery-item, .hobby-card, .section-head'
    );
    revealTargets.forEach((el) => el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }
})();
