/**
 * Subtle physics background.
 * Small particles drift with gentle Brownian motion, bounce elastically
 * off the viewport edges, softly repel from the cursor, and draw thin
 * connecting lines when close together (a quiet constellation/network
 * effect). Kept low-opacity and low-density on purpose so it never
 * competes with foreground content.
 */
(function () {
  const canvas = document.getElementById('bg-physics');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, dpr;
  let particles = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let running = true;
  let rafId = null;

  const CONFIG = {
    maxParticles: 70,
    density: 16000,       // px^2 per particle (lower = more particles)
    maxSpeed: 0.18,        // px per ms, kept gentle
    linkDistance: 130,
    mouseRadius: 140,
    mouseForce: 0.02,
    colorSplit: 0.78,      // fraction of particles that are white vs red
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedParticles();
  }

  function seedParticles() {
    const count = Math.min(CONFIG.maxParticles, Math.floor((width * height) / CONFIG.density));
    particles = new Array(count).fill(0).map(() => spawnParticle());
  }

  function spawnParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.02 + Math.random() * CONFIG.maxSpeed);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1 + Math.random() * 1.6,
      red: Math.random() > CONFIG.colorSplit,
    };
  }

  function step(dt) {
    for (const p of particles) {
      // gentle random jitter (Brownian-ish)
      p.vx += (Math.random() - 0.5) * 0.004;
      p.vy += (Math.random() - 0.5) * 0.004;

      // soft cursor repulsion
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONFIG.mouseRadius && dist > 0.001) {
          const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // clamp speed
      const speed = Math.hypot(p.vx, p.vy);
      const max = CONFIG.maxSpeed;
      if (speed > max) {
        p.vx = (p.vx / speed) * max;
        p.vy = (p.vy / speed) * max;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // elastic bounce off edges
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > height) { p.y = height; p.vy *= -1; }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // links
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONFIG.linkDistance) {
          const alpha = (1 - dist / CONFIG.linkDistance) * 0.12;
          ctx.strokeStyle = `rgba(245, 245, 242, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // particles
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.red ? 'rgba(255, 43, 43, 0.55)' : 'rgba(245, 245, 242, 0.4)';
      ctx.fill();
    }
  }

  let last = performance.now();
  function loop(now) {
    if (!running) return;
    const dt = Math.min(now - last, 48);
    last = now;
    step(dt);
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (rafId) return;
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
  }, { passive: true });
  window.addEventListener('pointerleave', () => { mouse.active = false; }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else if (!prefersReducedMotion) start();
  });

  resize();

  if (prefersReducedMotion) {
    // draw a single static frame, no animation loop
    draw();
  } else {
    start();
  }
})();
