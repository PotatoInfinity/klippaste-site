// Klip landing: sticky nav, active link, dropdown, parallax, spotlight video, compare, FAQ hover
(function () {
  var pill = document.getElementById('navPill');
  var bgFixed = document.getElementById('bgFixed');
  var bgSky = document.getElementById('bgSky');
  var spot = document.getElementById('demo');
  var veil = document.getElementById('spotVeil');
  var video = document.getElementById('demoVideo');
  var frame = video ? video.closest('.spot-frame') : null;

  // Nav: always visible, depth on scroll
  function navDepth() {
    if (pill) pill.classList.toggle('scrolled', window.scrollY > 24);
  }

  // Parallax: background drifts with content; veil blur handled in spotlight tick
  var ticking = false;
  function tick() {
    ticking = false;
    var y = window.scrollY;
    navDepth();
    if (bgFixed) bgFixed.style.transform = 'translateY(' + (y * 0.12) + 'px)';
    if (bgSky) bgSky.style.transform = 'translateY(' + (y * 0.06) + 'px)';
    spotlight(y);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Spotlight: blur surroundings near video center, autoplay; exit resets to start
  var wasPlaying = false;
  function spotlight(y) {
    if (!spot || !video) return;
    var r = spot.getBoundingClientRect();
    var vh = window.innerHeight;
    var center = r.top + r.height / 2;
    var dist = Math.abs(vh / 2 - center);
    var zone = vh * 0.45;
    var k = Math.max(0, Math.min(1, 1 - dist / (vh * 0.9))); // 0 far .. 1 centered
    if (veil) {
      veil.style.background = 'rgba(11,31,22,' + (k * 0.62).toFixed(3) + ')';
      veil.style.backdropFilter = 'blur(' + (k * 14).toFixed(1) + 'px)';
      veil.style.webkitBackdropFilter = 'blur(' + (k * 14).toFixed(1) + 'px)';
    }
    if (frame) frame.style.transform = 'scale(' + (0.94 + k * 0.06).toFixed(3) + ')';
    if (bgFixed) bgFixed.style.filter = 'blur(' + (k * 6).toFixed(1) + 'px)';
    var inZone = dist < zone && r.bottom > 0 && r.top < vh;
    if (inZone && !wasPlaying) {
      wasPlaying = true;
      try { video.currentTime = 0; } catch (e) {}
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    } else if (!inZone && wasPlaying) {
      wasPlaying = false;
      try { video.pause(); video.currentTime = 0; } catch (e) {}
    }
  }

  // Mute toggle
  var muteBtn = document.getElementById('spotMute');
  if (muteBtn && video) {
    muteBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });
  }

  // Mobile menu: smooth open + close
  var burger = document.getElementById('navBurger');
  var mobile = document.getElementById('navMobile');
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open && mobile.animate) {
        mobile.animate(
          [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }],
          { duration: 250, easing: 'cubic-bezier(.22,1,.36,1)' }
        );
      }
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        if (mobile.classList.contains('open') && mobile.animate) {
          var anim = mobile.animate(
            [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-6px)' }],
            { duration: 180, easing: 'ease-in' }
          );
          anim.onfinish = function () { mobile.classList.remove('open'); };
        } else mobile.classList.remove('open');
      });
    });
  }

  // Nav dropdown aria (CSS handles show/hide on hover + focus)
  var navDl = document.querySelector('.nav-dl');
  var navDlBtn = document.getElementById('navDlBtn');
  if (navDl && navDlBtn) {
    navDl.addEventListener('mouseenter', function () { navDlBtn.setAttribute('aria-expanded', 'true'); });
    navDl.addEventListener('mouseleave', function () { navDlBtn.setAttribute('aria-expanded', 'false'); });
  }

  // Active-section highlight
  var links = Array.prototype.slice.call(document.querySelectorAll('#navLinks a'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var secIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (a) { a.classList.remove('active'); });
        var a = map[e.target.id];
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['apps', 'demo', 'compare', 'features', 'faq'].forEach(function (id) {
    var s = document.getElementById(id);
    if (s) secIo.observe(s);
  });

  // Reveal on scroll
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

  // FAQ: hover to open (single-open), click still works
  var faqBox = document.getElementById('faqBox');
  var faqs = Array.prototype.slice.call(document.querySelectorAll('.faq details'));
  function openOnly(d) {
    faqs.forEach(function (o) { if (o !== d && o.open) o.open = false; });
    if (!d.open) d.open = true;
  }
  faqs.forEach(function (d) {
    d.addEventListener('mouseenter', function () { openOnly(d); });
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
  if (faqBox) faqBox.addEventListener('mouseleave', function () {});

  // Compare slider: drag handle + range input
  var box = document.getElementById('compareBox');
  var range = document.getElementById('cmpRange');
  function setPos(p) {
    p = Math.max(2, Math.min(98, p));
    if (box) box.style.setProperty('--pos', p + '%');
    if (range && document.activeElement !== range) range.value = Math.round(p);
  }
  if (box && range) {
    setPos(50);
    range.addEventListener('input', function () { setPos(parseFloat(range.value)); });
    var dragging = false;
    function xToPos(clientX) {
      var r = box.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    }
    box.addEventListener('pointerdown', function (e) { dragging = true; box.setPointerCapture(e.pointerId); setPos(xToPos(e.clientX)); });
    box.addEventListener('pointermove', function (e) { if (dragging) setPos(xToPos(e.clientX)); });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      box.addEventListener(ev, function () { dragging = false; });
    });
  }

  // Marquee: duplicate cards for a seamless loop
  var mq = document.getElementById('mqTrack');
  if (mq && !mq.dataset.dup) {
    mq.dataset.dup = '1';
    mq.innerHTML += mq.innerHTML;
  }

  tick();
})();
