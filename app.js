// Klip landing: nav, parallax, spotlight video, wall, faq
(function () {
  var pill = document.getElementById('navPill');
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
    spotlight();
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(tick); }
  }, { passive: true });

  // Spotlight: veil up to 8px near center, autoplay; exit pauses + resets.
  // Reduced motion: static veil, no autoplay — video keeps controls.
  // Perf: skip layout + style writes while #demo is off-screen (IO-gated);
  // write veil/frame styles only when the rounded value actually changed.
  var wasPlaying = false;
  var spotVisible = true;
  var lastVeilBg = '', lastVeilBlur = '', lastFrameT = '';
  if ('IntersectionObserver' in window && spot) {
    new IntersectionObserver(function (entries) {
      spotVisible = entries[0].isIntersecting;
      if (!spotVisible && !RM && video) {
        wasPlaying = false;
        try { if (!video.paused) video.pause(); video.currentTime = 0; } catch (e) {}
      }
    }, { threshold: 0 }).observe(spot);
  }
  document.addEventListener('visibilitychange', function () {
    if (!video) return;
    if (document.hidden) {
      wasPlaying = false;
      try { video.pause(); } catch (e) {}
    } else tick();
  });
  function spotlight() {
    if (!spot || !video) return;
    if (RM) {
      if (!video.hasAttribute('controls')) video.setAttribute('controls', '');
      return;
    }
    if (!spotVisible) return;
    var r = spot.getBoundingClientRect();
    var vh = window.innerHeight;
    var center = r.top + r.height / 2;
    var dist = Math.abs(vh / 2 - center);
    var t = Math.max(0, Math.min(1, 1 - dist / (vh * 1.1)));
    var k = t * t * (3 - 2 * t); // smoothstep: blur eases in, never abrupt
    if (veil) {
      var vBg = 'rgba(253,252,247,' + (k * 0.55).toFixed(3) + ')';
      if (vBg !== lastVeilBg) { veil.style.background = vBg; lastVeilBg = vBg; }
      var vBl = (k * 8).toFixed(1);
      if (vBl !== lastVeilBlur) {
        veil.style.backdropFilter = 'blur(' + vBl + 'px)';
        veil.style.webkitBackdropFilter = 'blur(' + vBl + 'px)';
        lastVeilBlur = vBl;
      }
    }
    if (frame) {
      var fT = 'scale(' + (0.96 + k * 0.04).toFixed(3) + ')';
      if (fT !== lastFrameT) { frame.style.transform = fT; lastFrameT = fT; }
    }
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
      if (open && !RM && mobile.animate) {
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
  var secIo = null;
  if ('IntersectionObserver' in window) {
  secIo = new IntersectionObserver(function (entries) {
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
  }

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

  // FAQ: smooth close + single-open (native <details> snaps shut, so animate height first)
  var faqs = Array.prototype.slice.call(document.querySelectorAll('.faq details'));
  function faqClose(d) {
    if (!d.open || d.getAttribute('data-closing')) return;
    var a = d.querySelector('.a');
    if (RM || !a || !a.animate) { d.open = false; return; }
    var h = a.offsetHeight;
    if (!h) { d.open = false; return; }
    var inner = a.firstElementChild;
    d.setAttribute('data-closing', '1');
    a.style.height = h + 'px';
    a.style.overflow = 'hidden';
    var anim = a.animate([{ height: h + 'px', opacity: '1' }, { height: '0px', opacity: '0.4' }], { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    if (inner && inner.animate) {
      try { inner.animate([{ opacity: '1', transform: 'translateY(0px)' }, { opacity: '0', transform: 'translateY(-6px)' }], { duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }); } catch (e) {}
    }
    anim.onfinish = function () {
      d.open = false;
      d.removeAttribute('data-closing');
      a.style.height = '';
      a.style.overflow = '';
    };
    anim.oncancel = function () {
      d.removeAttribute('data-closing');
      a.style.height = '';
      a.style.overflow = '';
    };
  }
  faqs.forEach(function (d) {
    var s = d.querySelector('summary');
    if (!s) return;
    s.addEventListener('click', function (e) {
      if (RM) return;
      if (d.getAttribute('data-closing')) { e.preventDefault(); return; }
      if (d.open) { e.preventDefault(); faqClose(d); }
      else { faqs.forEach(function (o) { if (o !== d && o.open) faqClose(o); }); }
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
  // Windowed dots (Instagram / Swiper dynamicBullets pattern): when dots are
  // cut off, the highlight advances only up to the slot before the last
  // visible dot, then parks — further pages slide the dots strip under it,
  // scrolling back reverses. Strip glides via scroll-behavior: smooth
  // (instant under reduced motion); moves in whole-dot steps only, so fast
  // scrubbing never queues laggy animations. Geometry cached, reset on resize.
  var dotsGeom = null;
  var dotsStart = -1;
  function dotsGeomGet() {
    if (!dotsGeom && dotsWrap && dotsWrap.children.length) {
      var cs = window.getComputedStyle(dotsWrap);
      var gap = parseFloat(cs.columnGap || cs.gap) || 0;
      dotsGeom = {
        slot: dotsWrap.children[0].offsetWidth + gap,
        gap: gap,
        padL: parseFloat(cs.paddingLeft) || 0,
        padR: parseFloat(cs.paddingRight) || 0
      };
    }
    return dotsGeom;
  }
  function pinDots(active) {
    var n = dotsWrap ? dotsWrap.children.length : 0;
    var g = dotsGeomGet();
    if (!n || !g || !g.slot) return;
    var vw = dotsWrap.clientWidth;
    var visible = Math.max(1, Math.floor((vw - g.padL - g.padR + g.gap) / g.slot));
    // Cutoff-only: everything below runs solely when dots overflow. When all
    // dots fit, the pill is byte-for-byte the old static behavior.
    var cut = visible < n;
    if (dotsWrap.classList.contains('cut') !== cut) dotsWrap.classList.toggle('cut', cut);
    if (!cut) {
      dotsStart = 0;
      if (dotsWrap.scrollLeft) dotsWrap.scrollLeft = 0;
      return;
    }
    var cap = Math.max(0, visible - 2);
    var start = Math.min(Math.max(active - cap, 0), n - visible);
    if (start === dotsStart) return;
    dotsStart = start;
    // Center the window when possible: equal breathing room at both pill
    // edges, so no dot or highlight ever sits flush against the border.
    // Clamped at the ends, where the pill's own padding takes over.
    var maxScroll = Math.max(dotsWrap.scrollWidth - vw, 0);
    var target = g.padL + start * g.slot + (visible * g.slot - g.gap) / 2 - vw / 2;
    dotsWrap.scrollLeft = Math.min(Math.max(target, 0), maxScroll);
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
    pinDots(best);
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
    window.addEventListener('resize', function () { dotsGeom = null; dotsStart = -1; wallActive(); });
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

  // Download buttons: icon follows the visitor's OS. macOS/iOS keeps the
  // Apple mark already in the markup; Windows gets a Windows mark; anything
  // else gets a neutral download arrow. License (seal) buttons untouched.
  var WIN_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M3 5.5 10.5 4.4v7.1H3zM11.6 4.2 21 3v8.5h-9.4zM3 12.5h7.5v7.1L3 18.5zM11.6 12.5H21V21l-9.4-1.2z"/></svg>';
  var DL_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>';
  function visitorOS() {
    var p = '';
    try {
      if (navigator.userAgentData && navigator.userAgentData.platform) p = navigator.userAgentData.platform;
      else p = navigator.platform || navigator.userAgent || '';
    } catch (e) { p = ''; }
    if (/mac|iphone|ipad|ipod|darwin/i.test(p)) return 'mac';
    if (/win/i.test(p)) return 'windows';
    return 'other';
  }
  (function swapDlIcons() {
    var os = visitorOS();
    if (os === 'mac') return;
    var icon = os === 'windows' ? WIN_ICON : DL_ICON;
    Array.prototype.forEach.call(document.querySelectorAll('.dl-btn'), function (btn) {
      var label = btn.querySelector('.dl-text');
      if (!label || !/download/i.test(label.textContent || '')) return;
      var slot = btn.querySelector('.dl-apple');
      if (slot) slot.innerHTML = icon;
    });
  })();

  tick();
})();
