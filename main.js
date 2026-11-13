/* Interacciones. Sin dependencias. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* El velo de entrada solo se aplica si podemos retirarlo. */
  root.classList.add('js');

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Envoltura necesaria para el tachado de "No somos". */
  document.querySelectorAll('.ledger--struck li').forEach(function (li) {
    li.innerHTML = '<span>' + li.innerHTML + '</span>';
  });

  var revealables = document.querySelectorAll('.reveal, .step, .ledger--struck li');

  function show(el) {
    el.style.setProperty('--d', (el.dataset.delay || 0) + 'ms');
    el.classList.add('is-in');
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -7% 0px' });

  revealables.forEach(function (el) { observer.observe(el); });

  /* Red de seguridad: nada se queda invisible si el observador falla. */
  window.setTimeout(function () {
    revealables.forEach(function (el) {
      if (!el.classList.contains('is-in')) { show(el); observer.unobserve(el); }
    });
  }, 1200);

  /* ---- nav y progreso del proceso ---- */
  var nav = document.getElementById('nav');
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      nav.classList.toggle('is-stuck', y > 40);
      nav.classList.toggle('is-hidden', y > lastY && y > 420);
      lastY = y;
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
