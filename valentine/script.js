(function () {
  'use strict';

  const HEARTS = ['💕', '💖', '💗', '💓', '💝', '❤️', '🌸'];
  const CARD_ID = 'card';
  const CARD_WRAPPER_ID = 'cardWrapper';

  const card = document.getElementById(CARD_ID);
  const cardWrapper = document.getElementById(CARD_WRAPPER_ID);

  if (card && cardWrapper) {
    cardWrapper.addEventListener('click', function () {
      card.classList.toggle('opened');
    });
  }

  // Will you be my Valentine? — Yes / No
  const askButtons = document.getElementById('askButtons');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const yesResponse = document.getElementById('yesResponse');

  if (btnYes && yesResponse && askButtons) {
    btnYes.addEventListener('click', function () {
      askButtons.classList.add('hidden');
      yesResponse.classList.remove('hidden');
      yesResponse.style.display = 'block';
      // Spawn a bunch of hearts at the center
      var rect = btnYes.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      for (var i = 0; i < 12; i++) {
        (function (ix, iy) {
          setTimeout(function () {
            var ev = { clientX: ix + (Math.random() - 0.5) * 40, clientY: iy + (Math.random() - 0.5) * 40 };
            document.body.dispatchEvent(new MouseEvent('click', ev));
          }, i * 80);
        })(x, y);
      }
    });
  }

  if (btnNo) {
    btnNo.addEventListener('click', function () {
      var w = window.innerWidth;
      var h = window.innerHeight;
      var rect = btnNo.getBoundingClientRect();
      var maxX = w - rect.width - 20;
      var maxY = h - rect.height - 20;
      var newX = 20 + Math.random() * Math.max(0, maxX - 20);
      var newY = 20 + Math.random() * Math.max(0, maxY - 20);
      btnNo.style.position = 'fixed';
      btnNo.style.left = newX + 'px';
      btnNo.style.top = newY + 'px';
    });
  }

  // Click anywhere to spawn hearts
  document.body.addEventListener('click', function (e) {
    const trail = document.getElementById('heartTrail');
    if (!trail) return;

    const count = 4 + Math.floor(Math.random() * 3);
    const x = e.clientX;
    const y = e.clientY;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'heart-burst';
      el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      const angle = (Math.PI * 2 * i) / count + Math.random();
      const dist = 30 + Math.random() * 40;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      el.style.setProperty('--dx', dx + 'px');
      el.style.setProperty('--dy', dy + 'px');
      trail.appendChild(el);
      setTimeout(function () {
        el.remove();
      }, 1200);
    }
  });

  // Add a few more floating hearts in the background
  const heartsBg = document.querySelector('.hearts-bg');
  if (heartsBg) {
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement('span');
      heart.textContent = '♥';
      heart.style.cssText = [
        'position: absolute',
        'font-size: ' + (14 + Math.random() * 12) + 'px',
        'opacity: ' + (0.08 + Math.random() * 0.12),
        'color: #e8a0b5',
        'left: ' + Math.random() * 100 + '%',
        'top: ' + Math.random() * 100 + '%',
        'animation: float ' + (6 + Math.random() * 6) + 's ease-in-out infinite',
        'animation-delay: ' + (Math.random() * -8) + 's'
      ].join('; ');
      heartsBg.appendChild(heart);
    }
  }
})();
