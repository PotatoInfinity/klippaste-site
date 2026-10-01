// Klip landing: nav, parallax, spotlight video, wall, faq
(function () {
  var pill = document.getElementById('navPill');
  var bgFixed = document.getElementById('bgFixed');
  var bgSky = document.getElementById('bgSky');
  var spot = document.getElementById('demo');
  var veil = document.getElementById('spotVeil');
  var video = document.getElementById('demoVideo');
  var frame = video ? video.closest('.spot-frame') : null;

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ticking = false;
  function tick() {
    ticking = false;
    var y = window.scrollY;
    if (pill) pill.classList.toggle('scrolled', y > 24);
    if (!RM) {
      if (bgFixed) bgFixed.style.transform = 'translateY(' + (y * 0.12) + 'px)';
      if (bgSky) bgSky.style.transform = 'translateY(' + (y * 0.06) + 'px)';
    }
    spotlight();
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  }, { passive: true });

  // Spotlight: veil up to 8px near center, autoplay; exit pauses + resets.
  // Reduced motion: static veil, no autoplay — video keeps controls.
  var wasPlaying = false;
  function spotlight() {
    if (!spot || !video) return;
    if (RM) {
      if (!video.hasAttribute('controls')) video.setAttribute('controls', '');
      return;
    }
    var r = spot.getBoundingClientRect();
    var vh = window.innerHeight;
    var center = r.top + r.height / 2;
    var dist = Math.abs(vh / 2 - center);
    var t = Math.max(0, Math.min(1, 1 - dist / (vh * 1.1)));
    var k = t * t * (3 - 2 * t); // smoothstep: blur eases in, never abrupt
    if (veil) {
      veil.style.background = 'rgba(10,30,20,' + (k * 0.55).toFixed(3) + ')';
      veil.style.backdropFilter = 'blur(' + (k * 8).toFixed(1) + 'px)';
      veil.style.webkitBackdropFilter = 'blur(' + (k * 8).toFixed(1) + 'px)';
    }
    if (frame) frame.style.transform = 'scale(' + (0.96 + k * 0.04).toFixed(3) + ')';
    var inZone = dist < vh * 0.45 && r.bottom > 0 && r.top < vh;
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

  // Click frame toggles play; controls appear if autoplay was blocked
  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
      else video.pause();
    });
    video.addEventListener('play', function () { wasPlaying = true; }, true);
    setTimeout(function () {
      if (video.paused && !wasPlaying && !RM) video.setAttribute('controls', '');
    }, 4000);
  }
  window.addEventListener('resize', function () { tick(); });
  var muteBtn = document.getElementById('spotMute');
  if (muteBtn && video) {
    muteBtn.addEventListener('click', function () {
      video.muted = !video.muted;
      muteBtn.classList.toggle('live', !video.muted);
      muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
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
        mobile.classList.remove('open');
      });
    });
  }

  // Active-section highlight
  var links = Array.prototype.slice.call(document.querySelectorAll('#navLinks a'));
  var map = {};
  links.forEach(function (a) { map[(a.getAttribute('href') || '').slice(1)] = a; });
  var secIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (a) { a.classList.remove('active'); });
        var a = map[e.target.id];
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  ['apps', 'demo', 'features', 'faq'].forEach(function (id) {
    var s = document.getElementById(id);
    if (s) secIo.observe(s);
  });

  // Reveal on scroll (instant if observer unsupported)
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  } else {
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
  }

  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // FAQ: click toggle, single-open
  var faqs = Array.prototype.slice.call(document.querySelectorAll('.faq details'));
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Compatibility wall: dots + arrows + auto-advance + pause
  var wall = document.getElementById('wallTrack');
  var dotsWrap = document.getElementById('wallDots');
  var pauseBtn = document.getElementById('wallPause');
  var prevBtn = document.getElementById('wallPrev');
  var nextBtn = document.getElementById('wallNext');
  var wallPaused = false;
  var wallTimer = null;
  var wallVisible = false;
  var SVG_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var SVG_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  function wallCards() { return wall ? Array.prototype.slice.call(wall.querySelectorAll('.wall-card')) : []; }
  function wallGo(i) {
    var cards = wallCards();
    if (!cards.length) return;
    i = (i + cards.length) % cards.length;
    wall.scrollTo({ left: cards[i].offsetLeft - wall.offsetLeft - (wall.clientWidth - cards[i].clientWidth) / 2, behavior: RM ? 'auto' : 'smooth' });
  }
  function wallActive() {
    var cards = wallCards();
    if (!cards.length || !dotsWrap) return 0;
    var mid = wall.scrollLeft + wall.clientWidth / 2;
    var best = 0, bd = Infinity;
    cards.forEach(function (c, i) {
      var d = Math.abs(c.offsetLeft - wall.offsetLeft + c.clientWidth / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    Array.prototype.forEach.call(dotsWrap.children, function (b, i) {
      var on = i === best;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    return best;
  }
  function wallAuto() {
    if (wallTimer) { clearInterval(wallTimer); wallTimer = null; }
    if (wallPaused || !wall || RM || document.hidden || !wallVisible) return;
    wallTimer = setInterval(function () { wallGo(wallActive() + 1); }, 5000);
  }
  if (wall && dotsWrap) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        wallVisible = entries[0].isIntersecting;
        wallAuto();
      }, { threshold: 0.15 }).observe(document.getElementById('wall'));
    } else wallVisible = true;
    wallCards().forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Show application ' + (i + 1));
      b.addEventListener('click', function () { wallGo(i); wallAuto(); });
      dotsWrap.appendChild(b);
    });
    var wallTick = false;
    wall.addEventListener('scroll', function () {
      if (!wallTick) { wallTick = true; requestAnimationFrame(function () { wallTick = false; wallActive(); }); }
    }, { passive: true });
    wall.addEventListener('mouseenter', function () { if (wallTimer) { clearInterval(wallTimer); wallTimer = null; } });
    wall.addEventListener('mouseleave', wallAuto);
    wall.addEventListener('pointerdown', function () { if (wallTimer) { clearInterval(wallTimer); wallTimer = null; } });
    wall.addEventListener('pointerup', wallAuto);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (wallTimer) { clearInterval(wallTimer); wallTimer = null; } }
      else wallAuto();
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { wallGo(wallActive() - 1); wallAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { wallGo(wallActive() + 1); wallAuto(); });
    wallActive();
    wallAuto();
  }
  if (pauseBtn && wall) {
    pauseBtn.innerHTML = SVG_PAUSE;
    pauseBtn.addEventListener('click', function () {
      wallPaused = !wallPaused;
      pauseBtn.innerHTML = wallPaused ? SVG_PLAY : SVG_PAUSE;
      pauseBtn.setAttribute('aria-label', wallPaused ? 'Resume auto-scroll' : 'Pause auto-scroll');
      wallAuto();
    });
  }

  tick();
})();
