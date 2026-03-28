/* Birthday Dad — script.js */

// ─── Confetti ───────────────────────────────────────────────────────────────
(function initConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let pieces = [];
  let animId;

  const COLORS = ['#d4af37', '#c0161e', '#f0d060', '#ffffff', '#9e2f4e', '#d4708a', '#a8861a'];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function randomPiece() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      w: Math.random() * 9 + 5,
      h: Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.15,
      vx: (Math.random() - 0.5) * 2.5,
      vy: Math.random() * 2.5 + 1.5,
      opacity: 1,
      fade: Math.random() * 0.005 + 0.003,
    };
  }

  function burst(n = 120) {
    for (let i = 0; i < n; i++) {
      pieces.push(randomPiece());
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.spin += p.spinSpeed;
      p.opacity -= p.fade;
      if (p.opacity <= 0 || p.y > canvas.height + 30) {
        pieces.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    animId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);

  // Initial burst after a short delay
  setTimeout(() => burst(150), 400);
  // A second burst
  setTimeout(() => burst(100), 1800);

  loop();
})();


// ─── Balloons ───────────────────────────────────────────────────────────────
(function initBalloons() {
  const container = document.getElementById('balloonsContainer');
  const EMOJIS = ['🏮', '🏮', '🏮', '🌸', '✨', '🌺', '⭐', '福', '寿', '喜'];

  function spawnBalloon() {
    const el = document.createElement('div');
    el.className = 'balloon';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left = Math.random() * 100 + 'vw';
    const duration = Math.random() * 12 + 10; // 10–22s
    const delay    = Math.random() * 8;
    el.style.animationDuration  = duration + 's';
    el.style.animationDelay     = delay + 's';
    el.style.fontSize           = (Math.random() * 1.4 + 1.4) + 'rem';
    container.appendChild(el);

    // Remove after animation so DOM stays clean
    setTimeout(() => el.remove(), (duration + delay) * 1000 + 500);
  }

  // Seed initial batch
  for (let i = 0; i < 14; i++) spawnBalloon();
  // Keep spawning
  setInterval(spawnBalloon, 2200);
})();


// ─── Carousel ────────────────────────────────────────────────────────────────
(function initCarousel() {
  const track   = document.getElementById('carouselTrack');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  const dotsEl  = document.getElementById('carouselDots');
  if (!track) return;

  const slides = Array.from(track.children);
  let current  = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Photo ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  const dots = Array.from(dotsEl.children);

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    btnPrev.disabled = false;
    btnNext.disabled = false;
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  // Swipe support
  let startX = null;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    startX = null;
  });

  // Auto-advance every 4s, pause on hover/touch
  let timer = setInterval(() => goTo(current + 1), 4000);
  const pause  = () => clearInterval(timer);
  const resume = () => { timer = setInterval(() => goTo(current + 1), 4000); };
  track.closest('.carousel').addEventListener('mouseenter', pause);
  track.closest('.carousel').addEventListener('mouseleave', resume);
  track.closest('.carousel').addEventListener('touchstart', pause, { passive: true });
})();


// ─── Message cards (mom & dad) ───────────────────────────────────────────────
(function initCards() {
  function wireCard(cardId, contentId) {
    const card    = document.getElementById(cardId);
    const content = document.getElementById(contentId);
    if (!card || !content) return;

    card.addEventListener('click', function () {
      if (card.classList.contains('opened')) return;
      card.classList.add('opened');
      content.classList.remove('hidden');
      requestAnimationFrame(() => content.classList.add('visible'));
      setTimeout(() => {
        if (typeof window.birthdayBurst === 'function') window.birthdayBurst();
      }, 50);
    });
  }

  wireCard('cardMom', 'cardContentMom');
  wireCard('cardDad', 'cardContentDad');
})();


// ─── Click-to-burst confetti anywhere ────────────────────────────────────────
window.birthdayBurst = function () {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const COLORS = ['#d4af37', '#c0161e', '#f0d060', '#ffffff', '#9e2f4e', '#d4708a', '#a8861a'];
  // Push directly into the global pieces array via re-dispatching to confetti module
  // Instead, just run a small local burst overlay
  const tempPieces = [];
  for (let i = 0; i < 80; i++) {
    tempPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4,
      w: Math.random() * 9 + 5,
      h: Math.random() * 5 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.15,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 1,
      opacity: 1,
      fade: 0.008,
    });
  }

  function animExtra() {
    for (let i = tempPieces.length - 1; i >= 0; i--) {
      const p = tempPieces[i];
      p.x += p.vx; p.y += p.vy; p.spin += p.spinSpeed; p.opacity -= p.fade;
      if (p.opacity <= 0) { tempPieces.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (tempPieces.length > 0) requestAnimationFrame(animExtra);
  }
  animExtra();
};
