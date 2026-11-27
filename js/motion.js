(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Hero headline: split into words so each can rise in with a blur (CSS does the animation).
  var h = $('h1[data-split]');
  if (h) {
    var text = h.textContent.trim();
    h.setAttribute('aria-label', text);
    h.textContent = '';
    text.split(/\s+/).forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'word';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = w;
      h.appendChild(s);
    });
    h.classList.add('split-done');
  }

  // 2. Marquee built from the skill chips (two copies for a seamless loop; one copy if reduced motion).
  var track = $('#mq-track');
  if (track) {
    var names = $$('#chips li').map(function (li) { return li.textContent.trim(); });
    for (var r = 0; r < (reduce ? 1 : 2); r++) {
      names.forEach(function (n) {
        var c = document.createElement('span');
        c.className = 'chip';
        c.textContent = n;
        track.appendChild(c);
      });
    }
    track.style.animationDuration = Math.max(30, names.length * 2) + 's'; // TWEAK: seconds per full loop
  }

  // 3. Rotating focus line. Pauses on hover/focus and in hidden tabs. Off for reduced motion.
  var cyc = $('[data-cycle]');
  if (cyc && !reduce) {
    var items = $$('.focus-item', cyc), idx = 0, paused = false;
    cyc.addEventListener('mouseenter', function () { paused = true; });
    cyc.addEventListener('mouseleave', function () { paused = false; });
    cyc.addEventListener('focusin', function () { paused = true; });
    cyc.addEventListener('focusout', function () { paused = false; });
    setInterval(function () {
      if (paused || document.visibilityState !== 'visible') return;
      idx = (idx + 1) % items.length;
      items.forEach(function (el, i) { el.classList.toggle('on', i === idx); });
    }, 3200); // TWEAK: ms per item
  }

  // 4. Sticky stepped sections: the item nearest the middle of the screen is "active".
  function steps(items, counter) {
    if (!items.length || !('IntersectionObserver' in window)) { items.forEach(function (i) { i.classList.add('active'); }); return; }
    // Pick by position, not by the last entry, so fast scrolls and anchor jumps cannot leave a stale number.
    function pick() {
      var mid = innerHeight * 0.55, k = 0;
      items.forEach(function (it, n) { if (it.getBoundingClientRect().top <= mid) k = n; });
      items.forEach(function (it, n) { it.classList.toggle('active', n === k); });
      if (counter) counter.textContent = ('0' + (k + 1)).slice(-2);
    }
    var o = new IntersectionObserver(pick, { rootMargin: '-40% 0px -45% 0px' });
    items.forEach(function (i) { o.observe(i); });
    addEventListener('scroll', pick, { passive: true });
    pick();
  }
  steps($$('#exp-steps li'), $('#exp-n'));
  steps($$('#svc-grid .svc'), $('#svc-n'));

  // 5. Cursor glow and card spotlight (fine pointers only, not for reduced motion).
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (fine && !reduce) {
    var glow = $('.cursor-glow'), x = 0, y = 0, pending = false;
    document.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      var card = e.target.closest && e.target.closest('.card');
      if (card) {
        var b = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - b.left) + 'px');
        card.style.setProperty('--my', (e.clientY - b.top) + 'px');
      }
      if (!pending) {
        pending = true;
        requestAnimationFrame(function () {
          pending = false;
          glow.style.transform = 'translate(' + x + 'px,' + y + 'px)';
          glow.classList.add('on');
        });
      }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { glow.classList.remove('on'); });
  }

  // 6. After the entrance stagger, drop the inline delay so hover lifts are instant.
  setTimeout(function () { $$('.case').forEach(function (c) { c.style.transitionDelay = ''; }); }, 3500);
})();
