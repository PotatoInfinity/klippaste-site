// Klip landing interactions: pill nav hide/show, reveal, mobile menu, video lazy
(function () {
  var pill = document.getElementById('navPill');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    if (pill) {
      pill.classList.toggle('scrolled', y > 24);
      if (y > 300 && y > lastY + 4) pill.classList.add('hide');
      else if (y < lastY - 4 || y < 300) pill.classList.remove('hide');
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('navBurger');
  var mobile = document.getElementById('navMobile');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobile.classList.remove('open'); });
    });
  }

  // Staggered reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Footer year
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Single-open FAQ
  var faqs = document.querySelectorAll('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();
